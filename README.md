# chrome-gemini-guard

`chrome-gemini-guard` 是一个基于 **Tauri 2.x + React + TypeScript** 的桌面应用，用于守护 Chrome `Local State` 关键字段，避免被回写后手工反复修改。

当前仓库已具备：

- 前后端工程骨架
- 完整核心业务逻辑实现（Path Resolution, Policy, Repair, Watcher）
- 通过所有核心契约测试（Frontend & Backend）

---

## 1. 功能目标

项目目标是持续监控并修复以下字段：

- `variations_country` -> `us`
- `variations_permanent_consistency_country` -> `us`
- `is_glic_eligible` -> `true`（所有出现位置）

已实现功能：

- 开机自启（Windows/macOS）
- 托盘常驻与系统集成
- 启动时自动检查与修复
- 实时文件监控与自动修复
- 完整的前端控制面板

> 说明：当前代码已通过核心测试，具备完整业务逻辑，正处于集成测试与打磨阶段。

---

## 2. 环境要求

### 2.1 必备工具

- [Bun](https://bun.sh/)（前端包管理和测试）
- [Rust + Cargo](https://rustup.rs/)（Rust 编译与测试）
- Windows 下需要 MSVC 工具链（`link.exe`）：
  - 安装 `Visual Studio Build Tools 2022`
  - 勾选 `Desktop development with C++`
  - 包含 `MSVC v143` 和 `Windows SDK`

### 2.2 验证安装

```powershell
bun --version
rustc --version
cargo --version
```

---

## 3. 安装与运行

### 3.1 安装依赖

在项目根目录执行：

```powershell
cd D:\dev\chrome-gemini-guard
bun install
```

Rust 依赖会在首次 `cargo test`/`cargo build` 或启动应用时自动下载。

### 3.2 启动应用

**桌面模式 (推荐)**：启动完整的 Tauri 桌面应用环境，支持所有原生 API。
```powershell
bun run tauri:dev
```

**浏览器模式**：仅启动前端服务，适合快速 UI 调试（无原生 API 支持）。
```powershell
bun run dev
```

---

## 4. 配置说明

当前版本无独立配置文件，采用内置默认策略（见 Rust domain/service 层实现）：

- 默认 `strict_mode = false`
- 默认 `autostart_enabled = true`
- `get_snapshot()` 返回基础状态给前端

如需调整默认值，可修改：

- `src-tauri/src/commands/guardian.rs`
- `src-tauri/src/app_state.rs`

Chrome `Local State` 常见路径：

- Windows: `%LOCALAPPDATA%\Google\Chrome\User Data\Local State`
- macOS: `~/Library/Application Support/Google/Chrome/Local State`
- Linux: `~/.config/google-chrome/Local State`

---

## 5. 如何测试

### 5.1 前端测试（Vitest）

```powershell
cd D:\dev\chrome-gemini-guard
bun run test
```

监听模式：

```powershell
bun run test:watch
```

### 5.2 Rust 测试（Cargo）

```powershell
cd D:\dev\chrome-gemini-guard\src-tauri
cargo test
```

---

## 6. 如何构建（Build）

### 6.1 构建 Rust 部分

```powershell
cd D:\dev\chrome-gemini-guard\src-tauri
cargo build --release
```

### 6.2 构建前端静态资源（若后续接入 bundler）

当前仓库主要用于契约测试与 Tauri 侧开发；如需完整桌面打包，建议补充标准 Tauri 前端构建脚本后执行统一打包命令。

---

## 7. 开发建议流程

1. 修改实现代码（`src-tauri/src` / `src`）
2. 先跑前端测试：`bun run test`
3. 再跑 Rust 测试：`cargo test`
4. 两侧都通过后再考虑发布构建

---

## 8. 常见问题

### 8.1 `link.exe not found`

说明缺少 MSVC linker。请安装 Visual Studio Build Tools 的 C++ 工作负载，并在新终端中验证：

```powershell
where link
```

### 8.2 测试报错但代码看起来没问题

先确认在正确目录执行命令：

- 前端测试在项目根目录
- Rust 测试在 `src-tauri` 目录

---

## 9. 相关文档

- 阶段边界文档：`docs/tdd-boundary.md`
- Step 3 交接说明：`docs/step3-handoff.md`
