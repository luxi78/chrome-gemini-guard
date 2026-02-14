use serde_json::Value;

use super::drift_report::{DriftItem, DriftKind, DriftReport};

#[derive(Debug, Clone, Copy)]
pub struct PolicyOptions {
    pub strict_mode: bool,
}

pub fn analyze_drift(local_state: &Value, options: PolicyOptions) -> DriftReport {
    let mut items = Vec::new();

    let country_actual = local_state
        .get("variations_country")
        .and_then(Value::as_str)
        .unwrap_or_default()
        .to_string();
    let country_drift = if options.strict_mode {
        country_actual != "us"
    } else {
        country_actual == "cn"
    };
    if country_drift {
        items.push(DriftItem {
            json_path: "$.variations_country".to_string(),
            kind: DriftKind::CountryField,
            expected: "us".to_string(),
            actual: country_actual,
        });
    }

    let consistency_actual = local_state
        .get("variations_permanent_consistency_country")
        .and_then(Value::as_array)
        .and_then(|arr| arr.get(1))
        .and_then(Value::as_str)
        .unwrap_or_default()
        .to_string();
    let consistency_drift = consistency_actual != "us";
    if consistency_drift {
        items.push(DriftItem {
            json_path: "$.variations_permanent_consistency_country[1]".to_string(),
            kind: DriftKind::CountryField,
            expected: "us".to_string(),
            actual: consistency_actual,
        });
    }

    fn collect_glic(items: &mut Vec<DriftItem>, value: &Value, path: &str) {
        match value {
            Value::Object(map) => {
                for (k, v) in map {
                    let next = format!("{path}.{k}");
                    if k == "is_glic_eligible" {
                        let is_true = v.as_bool().unwrap_or(false);
                        if !is_true {
                            items.push(DriftItem {
                                json_path: next.clone(),
                                kind: DriftKind::GlicEligibility,
                                expected: "true".to_string(),
                                actual: v.to_string(),
                            });
                        }
                    }
                    collect_glic(items, v, &next);
                }
            }
            Value::Array(arr) => {
                for (idx, v) in arr.iter().enumerate() {
                    let next = format!("{path}[{idx}]");
                    collect_glic(items, v, &next);
                }
            }
            _ => {}
        }
    }

    collect_glic(&mut items, local_state, "$");

    DriftReport {
        has_drift: !items.is_empty(),
        items,
    }
}

pub fn plan_patch(local_state: &Value, options: PolicyOptions) -> Value {
    let mut patched = local_state.clone();

    if let Some(obj) = patched.as_object_mut() {
        let should_set_country = |current: Option<&str>| -> bool {
            if options.strict_mode {
                true
            } else {
                current == Some("cn")
            }
        };

        let c1 = obj.get("variations_country").and_then(Value::as_str);
        if should_set_country(c1) {
            obj.insert(
                "variations_country".to_string(),
                Value::String("us".to_string()),
            );
        }

        if let Some(Value::Array(consistency_arr)) =
            obj.get_mut("variations_permanent_consistency_country")
        {
            if consistency_arr.len() > 1 {
                let current = consistency_arr[1].as_str().unwrap_or_default();
                if current != "us" {
                    consistency_arr[1] = Value::String("us".to_string());
                }
            }
        }
    }

    fn patch_glic(value: &mut Value) {
        match value {
            Value::Object(map) => {
                for (k, v) in map.iter_mut() {
                    if k == "is_glic_eligible" {
                        *v = Value::Bool(true);
                    } else {
                        patch_glic(v);
                    }
                }
            }
            Value::Array(arr) => {
                for v in arr {
                    patch_glic(v);
                }
            }
            _ => {}
        }
    }

    patch_glic(&mut patched);
    patched
}
