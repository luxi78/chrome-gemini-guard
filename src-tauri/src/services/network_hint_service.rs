use serde::Deserialize;
use std::sync::{Arc, Mutex, OnceLock};
use std::time::{Duration, Instant};

/// Shared state for the detected network country code.
struct NetworkState {
    country: Option<String>,
    last_checked: Option<Instant>,
}

fn network_state() -> &'static Arc<Mutex<NetworkState>> {
    static STATE: OnceLock<Arc<Mutex<NetworkState>>> = OnceLock::new();
    STATE.get_or_init(|| {
        Arc::new(Mutex::new(NetworkState {
            country: None,
            last_checked: None,
        }))
    })
}

/// Debounce: skip if last check was within this duration.
const DEBOUNCE: Duration = Duration::from_secs(5);

/// Periodic fallback interval.
const PERIODIC_INTERVAL: Duration = Duration::from_secs(120);

#[derive(Debug, Deserialize)]
struct IpApiResponse {
    #[serde(rename = "countryCode")]
    country_code: Option<String>,
}

/// Call ip-api.com and return the 2-letter country code (e.g. "US", "CN").
async fn fetch_country_code() -> Option<String> {
    let resp = reqwest::Client::builder()
        .timeout(Duration::from_secs(10))
        .build()
        .ok()?
        .get("http://ip-api.com/json/?fields=countryCode")
        .send()
        .await
        .ok()?;

    let body = resp.json::<IpApiResponse>().await.ok()?;
    body.country_code
}

/// Refresh country code with debounce protection.
fn refresh_country() {
    let state = network_state().clone();

    // Debounce check
    if let Ok(guard) = state.lock() {
        if let Some(last) = guard.last_checked {
            if last.elapsed() < DEBOUNCE {
                return;
            }
        }
    }

    tauri::async_runtime::spawn(async move {
        if let Some(code) = fetch_country_code().await {
            if let Ok(mut guard) = state.lock() {
                guard.country = Some(code);
                guard.last_checked = Some(Instant::now());
            }
        } else {
            // Mark as checked even on failure to avoid hammering
            if let Ok(mut guard) = state.lock() {
                guard.last_checked = Some(Instant::now());
            }
        }
    });
}

/// Get the current detected country code.
pub fn get_network_country() -> Option<String> {
    network_state()
        .lock()
        .ok()
        .and_then(|g| g.country.clone())
}

/// Spawn background threads for network monitoring.
/// 1. Windows `NotifyAddrChange` listener for instant network change detection.
/// 2. Periodic fallback timer.
pub fn spawn_network_watcher() {
    // Initial fetch
    refresh_country();

    // Thread 1: Periodic fallback
    std::thread::spawn(move || loop {
        std::thread::sleep(PERIODIC_INTERVAL);
        refresh_country();
    });

    // Thread 2: Windows network change listener via raw FFI
    #[cfg(windows)]
    std::thread::spawn(move || {
        // NotifyAddrChange from iphlpapi.dll
        // Signature: DWORD NotifyAddrChange(PHANDLE Handle, LPOVERLAPPED overlapped)
        // When both params are NULL, it blocks synchronously until a change occurs.
        // Returns NO_ERROR (0) on success.
        #[link(name = "iphlpapi")]
        extern "system" {
            fn NotifyAddrChange(
                handle: *mut std::ffi::c_void,
                overlapped: *mut std::ffi::c_void,
            ) -> u32;
        }

        loop {
            let result = unsafe { NotifyAddrChange(std::ptr::null_mut(), std::ptr::null_mut()) };
            if result == 0 {
                // Small delay: Windows may fire multiple events in rapid succession
                std::thread::sleep(Duration::from_secs(2));
                refresh_country();
            } else {
                // If the API fails, fall back to sleeping and retrying
                std::thread::sleep(Duration::from_secs(30));
            }
        }
    });
}
