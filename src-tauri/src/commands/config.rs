use serde::{Deserialize, Serialize};
use tauri::AppHandle;

use super::guardian::{get_snapshot, set_autostart_enabled, set_strict_mode_cmd};
use crate::services::audit_log_service::{append_event, now_timestamp, AuditEvent, LogLevel};
use crate::services::autostart_service::{is_autostart_enabled, set_autostart};

#[derive(Debug, Deserialize)]
pub struct UpdateConfigRequest {
    pub strict_mode: bool,
    pub autostart_enabled: bool,
}

#[derive(Debug, Serialize)]
pub struct UpdateConfigResponse {
    pub accepted: bool,
}

pub fn update_config(_request: UpdateConfigRequest) -> UpdateConfigResponse {
    let _ = set_strict_mode_cmd(_request.strict_mode);
    let _ = _request.autostart_enabled;
    UpdateConfigResponse { accepted: true }
}

#[tauri::command]
pub fn update_config_cmd(
    app: AppHandle,
    request: UpdateConfigRequest,
) -> Result<UpdateConfigResponse, String> {
    let _ = set_strict_mode_cmd(request.strict_mode)?;
    set_autostart(&app, request.autostart_enabled)?;
    set_autostart_enabled(request.autostart_enabled);
    append_event(AuditEvent {
        at: now_timestamp(),
        level: LogLevel::Info,
        message: format!(
            "设置已更新：严格模式={}，开机自启动={}",
            request.strict_mode, request.autostart_enabled
        ),
        detail: None,
    });
    Ok(UpdateConfigResponse { accepted: true })
}

#[tauri::command]
pub fn get_runtime_config_cmd() -> serde_json::Value {
    let snapshot = get_snapshot();
    serde_json::json!({
        "strictMode": snapshot.strict_mode,
        "autostartEnabled": snapshot.autostart_enabled
    })
}

#[tauri::command]
pub fn set_autostart_cmd(app: AppHandle, enabled: bool) -> Result<serde_json::Value, String> {
    set_autostart(&app, enabled)?;
    set_autostart_enabled(enabled);
    append_event(AuditEvent {
        at: now_timestamp(),
        level: LogLevel::Info,
        message: format!("开机自启动已{}", if enabled { "开启" } else { "关闭" }),
        detail: None,
    });
    Ok(serde_json::json!({
        "autostartEnabled": enabled
    }))
}

#[tauri::command]
pub fn get_autostart_status_cmd(app: AppHandle) -> Result<serde_json::Value, String> {
    let enabled = is_autostart_enabled(&app)?;
    set_autostart_enabled(enabled);
    Ok(serde_json::json!({
        "autostartEnabled": enabled
    }))
}
