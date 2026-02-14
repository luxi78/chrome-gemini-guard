use chrome_gemini_guard::services::tray_service::{default_close_action, WindowCloseAction};

#[test]
fn red_default_close_action_is_minimize_to_tray() {
    let action = default_close_action();
    assert_eq!(action, WindowCloseAction::MinimizeToTray);
}
