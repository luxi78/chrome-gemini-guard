use notify::{EventKind, RecursiveMode, Watcher};
use std::path::PathBuf;
use std::sync::mpsc;
use std::thread;
use std::time::{Duration, Instant};

pub struct WatchService;

impl WatchService {
    pub fn new() -> Self {
        Self
    }

    pub fn start<F>(&self, watch_path: PathBuf, on_change: F) -> Result<(), String>
    where
        F: Fn() + Send + Sync + 'static,
    {
        let on_change = std::sync::Arc::new(on_change);
        thread::Builder::new()
            .name("local-state-watcher".to_string())
            .spawn(move || {
                let (tx, rx) = mpsc::channel();
                let mut watcher = match notify::recommended_watcher(move |res| {
                    let _ = tx.send(res);
                }) {
                    Ok(w) => w,
                    Err(err) => {
                        eprintln!("failed to create watcher: {err}");
                        return;
                    }
                };

                if let Err(err) = watcher.watch(&watch_path, RecursiveMode::NonRecursive) {
                    eprintln!("failed to watch local state: {err}");
                    return;
                }

                let mut last_run = Instant::now()
                    .checked_sub(Duration::from_millis(250))
                    .unwrap_or_else(Instant::now);

                loop {
                    let event = match rx.recv() {
                        Ok(Ok(event)) => event,
                        Ok(Err(err)) => {
                            eprintln!("watch error: {err}");
                            continue;
                        }
                        Err(_) => return,
                    };

                    let should_reconcile = matches!(
                        event.kind,
                        EventKind::Modify(_) | EventKind::Create(_) | EventKind::Any
                    );
                    if !should_reconcile {
                        continue;
                    }

                    if last_run.elapsed() < Duration::from_millis(250) {
                        continue;
                    }
                    last_run = Instant::now();
                    on_change();
                }
            })
            .map(|_| ())
            .map_err(|e| e.to_string())
    }
}
