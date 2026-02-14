use serde::Serialize;

use crate::services::audit_log_service::{recent_events, LogLevel};

#[derive(Debug, Clone, Serialize)]
pub struct EventDto {
    pub at: String,
    pub level: String,
    pub message: String,
}

#[tauri::command]
pub fn get_recent_events_cmd(limit: Option<usize>) -> Vec<EventDto> {
    let take = limit.unwrap_or(100).max(1).min(200);
    let all = recent_events();
    all.into_iter()
        .rev()
        .take(take)
        .map(|event| EventDto {
            at: event.at,
            level: match event.level {
                LogLevel::Info => "info",
                LogLevel::Warn => "warn",
                LogLevel::Error => "error",
            }
            .to_string(),
            message: event.message,
        })
        .collect()
}
