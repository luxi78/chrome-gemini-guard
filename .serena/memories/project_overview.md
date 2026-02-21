# chrome-gemini-guard 项目概览

## 目的
Tauri 2.x 桌面应用，持续监控并修复 Chrome `Local State` 关键字段，防止被浏览器覆写：
- `variations_country` → `"us"`
- `variations_permanent_consistency_country` → `"us"`
- `is_glic_eligible` → `true`（所有出现位置）

## 技术栈
- **Frontend**: React + TypeScript (strict) + Vite, TailwindCSS, shadcn/ui, Radix UI, lucide-react, Bun 包管理
- **Backend**: Rust (Tauri 2.x), tokio async runtime, notify (文件监控), reqwest (HTTP), serde_json
- **Testing**: Vitest + Testing Library (frontend); cargo test (Rust)
- **平台**: Windows 主要目标（MSVC 工具链），兼顾 macOS

## 仓库结构
```
src/                       # React 前端
  app/                     # 页面: dashboard.tsx, logs.tsx, settings.tsx
  components/              # UI 组件: status-cards, event-list, settings-panel, rules-preview
  components/ui/           # shadcn/ui 基础组件
  lib/                     # api.ts (Tauri invoke wrapper), types.ts, utils.ts
  test/                    # api-contract.test.ts, ui-contract.test.tsx
src-tauri/src/             # Rust 后端
  commands/                # Tauri commands: guardian, config, events, health
  domain/                  # 业务逻辑: policy.rs, drift_report.rs
  services/                # 服务: repair, watch, audit_log, autostart, tray, network_hint, path_resolver
  app_state.rs             # 全局运行时状态 (Mutex<RuntimeState>)
  main.rs                  # 入口: setup, 注册 invoke_handler
docs/                      # 设计/边界文档
```

## 核心数据类型 (TypeScript)
```ts
type GuardianStatus = "idle" | "running" | "error";
interface GuardianSnapshot { status, strictMode, autostartEnabled, networkHint }
interface DriftItem { jsonPath, expected, actual, kind: "country"|"glic" }
interface EventItem { at, level: "info"|"warn"|"error", message, detail? }
```

## Tauri Commands (已注册)
- `get_health_cmd`, `get_snapshot_cmd`, `toggle_guardian_cmd`
- `set_strict_mode_cmd`, `reconcile_now_cmd`
- `update_config_cmd`, `get_runtime_config_cmd`
- `set_autostart_cmd`, `get_autostart_status_cmd`
- `get_recent_events_cmd`

## 当前状态
核心业务逻辑完整，契约测试通过，处于集成测试与 UI 打磨阶段。