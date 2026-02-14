use std::path::PathBuf;

#[derive(Debug, thiserror::Error)]
pub enum PathResolverError {
    #[error("LOCALAPPDATA environment variable is not available")]
    MissingLocalAppData,
}

pub fn resolve_local_state_path() -> Result<PathBuf, PathResolverError> {
    #[cfg(target_os = "windows")]
    {
        let base =
            std::env::var("LOCALAPPDATA").map_err(|_| PathResolverError::MissingLocalAppData)?;
        return Ok(PathBuf::from(base)
            .join("Google")
            .join("Chrome")
            .join("User Data")
            .join("Local State"));
    }

    #[cfg(target_os = "macos")]
    {
        let home = std::env::var("HOME").map_err(|_| PathResolverError::MissingLocalAppData)?;
        return Ok(PathBuf::from(home)
            .join("Library")
            .join("Application Support")
            .join("Google")
            .join("Chrome")
            .join("Local State"));
    }

    #[cfg(all(not(target_os = "windows"), not(target_os = "macos")))]
    {
        let home = std::env::var("HOME").map_err(|_| PathResolverError::MissingLocalAppData)?;
        Ok(PathBuf::from(home)
            .join(".config")
            .join("google-chrome")
            .join("Local State"))
    }
}
