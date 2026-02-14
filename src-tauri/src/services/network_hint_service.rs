#[derive(Debug, Clone, PartialEq, Eq)]
pub enum NetworkHint {
    LooksUsReachable,
    PossiblyNonUs,
    Unknown,
}

pub async fn detect_network_hint() -> NetworkHint {
    NetworkHint::Unknown
}
