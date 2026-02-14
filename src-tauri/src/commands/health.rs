use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct HealthResponse {
    pub ok: bool,
    pub stage: String,
}

pub fn get_health() -> HealthResponse {
    HealthResponse {
        ok: true,
        stage: "step1-step2-only".to_string(),
    }
}

#[tauri::command]
pub fn get_health_cmd() -> HealthResponse {
    get_health()
}
