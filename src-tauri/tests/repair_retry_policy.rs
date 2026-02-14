use chrome_gemini_guard::services::repair_service::{repair_with_retry, RetryPolicy};
use serde_json::json;

#[tokio::test]
async fn red_repair_uses_retry_contract() {
    let payload = json!({ "k": "v" });
    let policy = RetryPolicy {
        max_attempts: 5,
        base_delay_ms: 100,
    };

    let result = repair_with_retry("C:\\\\tmp\\\\local_state.json", &payload, policy).await;
    assert!(
        result.is_ok(),
        "expected retry-driven success path once implemented"
    );
}
