use chrome_gemini_guard::services::path_resolver::resolve_local_state_path;

#[test]
fn red_resolves_windows_local_state_suffix() {
    let path = resolve_local_state_path().expect("path should resolve in proper env");
    let text = path.to_string_lossy().to_lowercase();
    assert!(text.contains("google\\chrome\\user data\\local state"));
}
