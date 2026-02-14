use chrome_gemini_guard::commands::guardian::reconcile_now;

#[test]
fn red_startup_flow_notifies_before_repair() {
    // RED contract test placeholder:
    // Step 3 should refactor reconcile orchestrator to emit sequence events:
    // detected_drift -> notify_user -> repair_attempt -> terminal_event.
    reconcile_now();
}
