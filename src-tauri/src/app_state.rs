use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum GuardianStatus {
    Idle,
    Running,
    Error(String),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppState {
    pub strict_mode: bool,
    pub status: GuardianStatus,
    pub autostart_enabled: bool,
    pub network_hint: Option<String>,
}

impl Default for AppState {
    fn default() -> Self {
        Self {
            strict_mode: false,
            status: GuardianStatus::Idle,
            autostart_enabled: true,
            network_hint: None,
        }
    }
}
