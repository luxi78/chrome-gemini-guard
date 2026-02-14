use tauri::menu::{Menu, MenuItem};
use tauri::tray::TrayIconBuilder;
use tauri::{AppHandle, Manager, Runtime};

use crate::commands::guardian::{
    get_snapshot, reconcile_local_state_change, set_strict_mode_cmd, toggle_guardian_cmd,
};

const TRAY_SHOW: &str = "tray_show";
const TRAY_TOGGLE_GUARD: &str = "tray_toggle_guard";
const TRAY_RECONCILE: &str = "tray_reconcile";
const TRAY_TOGGLE_STRICT: &str = "tray_toggle_strict";
const TRAY_QUIT: &str = "tray_quit";

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum WindowCloseAction {
    MinimizeToTray,
    Exit,
}

pub fn default_close_action() -> WindowCloseAction {
    WindowCloseAction::MinimizeToTray
}

pub fn create_tray<R: Runtime>(app: &AppHandle<R>) -> Result<(), String> {
    let show_item = MenuItem::with_id(app, TRAY_SHOW, "显示主窗口", true, Option::<&str>::None)
        .map_err(|e| e.to_string())?;
    let guard_item = MenuItem::with_id(
        app,
        TRAY_TOGGLE_GUARD,
        "切换守护",
        true,
        Option::<&str>::None,
    )
    .map_err(|e| e.to_string())?;
    let reconcile_item =
        MenuItem::with_id(app, TRAY_RECONCILE, "立即修复", true, Option::<&str>::None)
            .map_err(|e| e.to_string())?;
    let strict_item = MenuItem::with_id(
        app,
        TRAY_TOGGLE_STRICT,
        "切换严格模式",
        true,
        Option::<&str>::None,
    )
    .map_err(|e| e.to_string())?;
    let quit_item = MenuItem::with_id(app, TRAY_QUIT, "退出", true, Option::<&str>::None)
        .map_err(|e| e.to_string())?;
    let menu = Menu::with_items(
        app,
        &[
            &show_item,
            &guard_item,
            &reconcile_item,
            &strict_item,
            &quit_item,
        ],
    )
    .map_err(|e| e.to_string())?;

    TrayIconBuilder::with_id("main-tray")
        .menu(&menu)
        .tooltip("Chrome Gemini Guard")
        .on_menu_event(|app, event| {
            let id = event.id().as_ref();
            match id {
                TRAY_SHOW => {
                    if let Some(window) = app.get_webview_window("main") {
                        let _ = window.show();
                        let _ = window.unminimize();
                        let _ = window.set_focus();
                    }
                }
                TRAY_TOGGLE_GUARD => {
                    let running = get_snapshot().status == "running";
                    let _ = toggle_guardian_cmd(!running);
                }
                TRAY_RECONCILE => {
                    let _ = reconcile_local_state_change();
                }
                TRAY_TOGGLE_STRICT => {
                    let strict_mode = get_snapshot().strict_mode;
                    let _ = set_strict_mode_cmd(!strict_mode);
                }
                TRAY_QUIT => {
                    app.exit(0);
                }
                _ => {}
            }
        })
        .build(app)
        .map(|_| ())
        .map_err(|e| e.to_string())
}
