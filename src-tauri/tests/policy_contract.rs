use chrome_gemini_guard::domain::policy::{analyze_drift, plan_patch, PolicyOptions};
use serde_json::json;

#[test]
fn red_policy_detects_cn_country_and_false_glic() {
    let data = json!({
        "variations_country": "cn",
        "variations_permanent_consistency_country": ["145.0.7632.68", "cn"],
        "nested": { "is_glic_eligible": false }
    });

    let report = analyze_drift(&data, PolicyOptions { strict_mode: false });
    assert!(report.has_drift);
}

#[test]
fn red_policy_strict_mode_forces_non_cn_country_values() {
    let data = json!({
        "variations_country": "fr",
        "variations_permanent_consistency_country": ["145.0.7632.68", "de"]
    });

    let patched = plan_patch(&data, PolicyOptions { strict_mode: true });
    assert_eq!(patched["variations_country"], "us");
    assert_eq!(patched["variations_permanent_consistency_country"][1], "us");
}
