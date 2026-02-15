use chrome_gemini_guard::commands::guardian::{
    initialize_runtime_state, reconcile_local_state_change,
};
use chrome_gemini_guard::services::autostart_service::is_autostart_enabled;
use chrome_gemini_guard::services::network_hint_service::spawn_network_watcher;
use chrome_gemini_guard::services::path_resolver::resolve_local_state_path;
use chrome_gemini_guard::services::tray_service::create_tray;
use chrome_gemini_guard::services::watch_service::WatchService;
use tauri::WindowEvent;
use tauri_plugin_autostart::MacosLauncher;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Option::<Vec<&'static str>>::None,
        ))
        .setup(|app| {
            let autostart_enabled = is_autostart_enabled(&app.handle()).unwrap_or(false);
            initialize_runtime_state(autostart_enabled);

            create_tray(&app.handle())?;

            // Start network country detection (ip-api.com + NotifyAddrChange)
            spawn_network_watcher();

            if let Ok(path) = resolve_local_state_path() {
                let watcher = WatchService::new();
                let _ = watcher.start(path, || {
                    let _ = reconcile_local_state_change();
                });
            }
            let _ = reconcile_local_state_change();

            Ok(())
        })
        .on_window_event(|window, event| {
            if let WindowEvent::CloseRequested { api, .. } = event {
                api.prevent_close();
                let _ = window.hide();
            }
        })
        .invoke_handler(tauri::generate_handler![
            chrome_gemini_guard::commands::health::get_health_cmd,
            chrome_gemini_guard::commands::guardian::get_snapshot_cmd,
            chrome_gemini_guard::commands::guardian::toggle_guardian_cmd,
            chrome_gemini_guard::commands::guardian::set_strict_mode_cmd,
            chrome_gemini_guard::commands::guardian::reconcile_now_cmd,
            chrome_gemini_guard::commands::config::update_config_cmd,
            chrome_gemini_guard::commands::config::get_runtime_config_cmd,
            chrome_gemini_guard::commands::config::set_autostart_cmd,
            chrome_gemini_guard::commands::config::get_autostart_status_cmd,
            chrome_gemini_guard::commands::events::get_recent_events_cmd
        ])
        .run(tauri::generate_context!())
        .expect("failed to run tauri application");
}
