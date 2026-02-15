use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::sync::{Mutex, OnceLock};

use crate::domain::policy::{analyze_drift, plan_patch, PolicyOptions};
use crate::services::audit_log_service::{append_event, now_timestamp, AuditEvent, LogLevel};
use crate::services::network_hint_service::get_network_country;
use crate::services::path_resolver::resolve_local_state_path;
use crate::services::repair_service::{repair_with_retry, RetryPolicy};

#[derive(Debug)]
struct RuntimeState {
    enabled: bool,
    strict_mode: bool,
    autostart_enabled: bool,
    last_error: Option<String>,
}

impl Default for RuntimeState {
    fn default() -> Self {
        Self {
            enabled: true,
            strict_mode: false,
            autostart_enabled: false,
            last_error: None,
        }
    }
}

fn runtime_state() -> &'static Mutex<RuntimeState> {
    static STATE: OnceLock<Mutex<RuntimeState>> = OnceLock::new();
    STATE.get_or_init(|| Mutex::new(RuntimeState::default()))
}

#[derive(Debug, Serialize)]
pub struct GuardianSnapshot {
    pub status: String,
    pub strict_mode: bool,
    pub autostart_enabled: bool,
    pub network_hint: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct ToggleGuardianRequest {
    pub enabled: bool,
}

fn status_from_state(enabled: bool, last_error: Option<&str>) -> String {
    if !enabled {
        return "idle".to_string();
    }
    if last_error.is_some() {
        return "error".to_string();
    }
    "running".to_string()
}

pub fn initialize_runtime_state(autostart_enabled: bool) {
    if let Ok(mut guard) = runtime_state().lock() {
        guard.autostart_enabled = autostart_enabled;
    }
}

pub fn set_autostart_enabled(enabled: bool) {
    if let Ok(mut guard) = runtime_state().lock() {
        guard.autostart_enabled = enabled;
    }
}

pub fn is_guardian_enabled() -> bool {
    runtime_state().lock().map(|g| g.enabled).unwrap_or(true)
}

pub fn get_snapshot() -> GuardianSnapshot {
    let guard = runtime_state().lock().ok();
    let (enabled, strict_mode, autostart_enabled, last_error) = guard
        .map(|g| {
            (
                g.enabled,
                g.strict_mode,
                g.autostart_enabled,
                g.last_error.clone(),
            )
        })
        .unwrap_or((true, false, false, None));
    GuardianSnapshot {
        status: status_from_state(enabled, last_error.as_deref()),
        strict_mode,
        autostart_enabled,
        network_hint: get_network_country(),
    }
}

pub fn toggle_guardian(request: ToggleGuardianRequest) {
    if let Ok(mut guard) = runtime_state().lock() {
        guard.enabled = request.enabled;
        if !request.enabled {
            guard.last_error = None;
        }
    }
    append_event(AuditEvent {
        at: now_timestamp(),
        level: LogLevel::Info,
        message: if request.enabled {
            "守护已启动".to_string()
        } else {
            "守护已停止".to_string()
        },
    });
}

pub fn reconcile_now() {
    let _ = reconcile_internal_blocking();
}

pub fn reconcile_local_state_change() -> Result<(), String> {
    if !is_guardian_enabled() {
        return Ok(());
    }
    reconcile_internal_blocking()
}

fn reconcile_internal_blocking() -> Result<(), String> {
    let strict_mode = runtime_state()
        .lock()
        .map(|g| g.strict_mode)
        .unwrap_or(false);
    let path = resolve_local_state_path().map_err(|e| e.to_string())?;
    let content = std::fs::read_to_string(&path).map_err(|e| e.to_string())?;
    let parsed: Value = serde_json::from_str(&content).map_err(|e| e.to_string())?;

    let report = analyze_drift(&parsed, PolicyOptions { strict_mode });
    if !report.has_drift {
        if let Ok(mut guard) = runtime_state().lock() {
            guard.last_error = None;
        }
        return Ok(());
    }

    let patched = plan_patch(&parsed, PolicyOptions { strict_mode });
    let result = tauri::async_runtime::block_on(async {
        repair_with_retry(
            path.to_string_lossy().as_ref(),
            &patched,
            RetryPolicy::default(),
        )
        .await
    });

    if let Ok(mut guard) = runtime_state().lock() {
        match &result {
            Ok(_) => guard.last_error = None,
            Err(err) => guard.last_error = Some(err.clone()),
        }
    }

    match &result {
        Ok(_) => append_event(AuditEvent {
            at: now_timestamp(),
            level: LogLevel::Info,
            message: format!("检测到 {} 项偏差并已修复", report.items.len()),
        }),
        Err(err) => append_event(AuditEvent {
            at: now_timestamp(),
            level: LogLevel::Error,
            message: format!("修复失败: {err}"),
        }),
    }

    result
}

#[tauri::command]
pub fn get_snapshot_cmd() -> GuardianSnapshot {
    get_snapshot()
}

#[tauri::command]
pub fn toggle_guardian_cmd(enabled: bool) -> Result<GuardianSnapshot, String> {
    toggle_guardian(ToggleGuardianRequest { enabled });
    Ok(get_snapshot())
}

#[tauri::command]
pub fn set_strict_mode_cmd(strict_mode: bool) -> Result<GuardianSnapshot, String> {
    if let Ok(mut guard) = runtime_state().lock() {
        guard.strict_mode = strict_mode;
    }
    append_event(AuditEvent {
        at: now_timestamp(),
        level: LogLevel::Info,
        message: format!("严格模式已{}", if strict_mode { "开启" } else { "关闭" }),
    });
    Ok(get_snapshot())
}

#[tauri::command]
pub fn reconcile_now_cmd() -> Result<GuardianSnapshot, String> {
    reconcile_internal_blocking()?;
    Ok(get_snapshot())
}
