use serde_json::Value;
use std::path::Path;
use std::time::Duration;

#[derive(Debug, Clone, Copy)]
pub struct RetryPolicy {
    pub max_attempts: u8,
    pub base_delay_ms: u64,
}

impl Default for RetryPolicy {
    fn default() -> Self {
        Self {
            max_attempts: 5,
            base_delay_ms: 100,
        }
    }
}

pub async fn repair_with_retry(
    path: &str,
    patched: &Value,
    retry: RetryPolicy,
) -> Result<(), String> {
    if retry.max_attempts == 0 {
        return Err("max_attempts must be greater than 0".to_string());
    }

    let path_ref = Path::new(path);
    let parent = path_ref
        .parent()
        .ok_or_else(|| "invalid Local State path".to_string())?;
    let temp_path = parent.join("Local State.guard.tmp");
    let json_content = serde_json::to_string_pretty(patched).map_err(|e| e.to_string())?;

    let mut attempt: u8 = 0;
    while attempt < retry.max_attempts {
        let write_result = std::fs::write(&temp_path, &json_content)
            .and_then(|_| std::fs::rename(&temp_path, path_ref));

        if write_result.is_ok() {
            return Ok(());
        }

        attempt += 1;
        if attempt >= retry.max_attempts {
            break;
        }

        let multiplier = 1_u64 << (attempt.saturating_sub(1) as u32);
        let delay_ms = retry.base_delay_ms.saturating_mul(multiplier);
        std::thread::sleep(Duration::from_millis(delay_ms));
    }

    Err("failed to write Local State after retries".to_string())
}
