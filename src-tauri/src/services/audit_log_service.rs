use serde::{Deserialize, Serialize};
use std::collections::VecDeque;
use std::sync::{Mutex, OnceLock};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum LogLevel {
    Info,
    Warn,
    Error,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct AuditEvent {
    pub at: String,
    pub level: LogLevel,
    pub message: String,
}

fn event_buffer() -> &'static Mutex<VecDeque<AuditEvent>> {
    static BUFFER: OnceLock<Mutex<VecDeque<AuditEvent>>> = OnceLock::new();
    BUFFER.get_or_init(|| Mutex::new(VecDeque::with_capacity(200)))
}

pub fn append_event(event: AuditEvent) {
    if let Ok(mut buffer) = event_buffer().lock() {
        if buffer.len() >= 200 {
            buffer.pop_front();
        }
        buffer.push_back(event.clone());
    }

    let log_line = format!("{} [{:?}] {}\n", event.at, event.level, event.message);
    let _ = std::fs::create_dir_all(".guard-logs");
    let _ = std::fs::OpenOptions::new()
        .create(true)
        .append(true)
        .open(".guard-logs/events.log")
        .and_then(|mut f| std::io::Write::write_all(&mut f, log_line.as_bytes()));
}

pub fn recent_events() -> Vec<AuditEvent> {
    event_buffer()
        .lock()
        .map(|b| b.iter().cloned().collect())
        .unwrap_or_default()
}

pub fn now_timestamp() -> String {
    use std::time::{SystemTime, UNIX_EPOCH};
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis()
        .to_string()
}
