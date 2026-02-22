# 🛡️ Chrome Gemini Guard

[![Release](https://img.shields.io/github/v/release/luxi78/chrome-gemini-guard?style=flat-square)](https://github.com/luxi78/chrome-gemini-guard/releases)
[![Downloads](https://img.shields.io/github/downloads/luxi78/chrome-gemini-guard/total?style=flat-square)](https://github.com/luxi78/chrome-gemini-guard/releases)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS-blue?style=flat-square)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**English** | [中文](README.zh-CN.md)

**Chrome Gemini Guard** is a lightweight desktop guardian that permanently enables the built-in Gemini AI assistant (glic) in Google Chrome, even when your network is outside the US region.

---

## 💡 Why does this exist?

Google's Gemini AI is integrated directly into Chrome (the icon in the top-right corner of the address bar), but it is restricted to US-region network environments.

Common workarounds — Python scripts, manual config edits — are one-shot fixes. **Chrome silently rewrites the country code in its `Local State` configuration file on every sync or restart, causing the Gemini icon to disappear repeatedly.**

**This project's approach:** Chrome Gemini Guard runs as a system-tray resident and uses filesystem-level monitoring (Watcher) to watch Chrome's `Local State` file in real time. The moment Chrome tries to disable Gemini or reset the region, the guardian intercepts and restores the correct values within milliseconds — **no more manual re-patching**.

## ✨ Features

- 🛡️ **Real-time protection** — File-system-level monitoring; reverts Chrome's changes instantly.
- 🚀 **Zero configuration** — A visual control panel; start the guardian with one click.
- 👻 **Silent operation** — Optional launch at login, lives in the system tray, minimal resource usage (built with Rust + Tauri).
- 🌍 **Cross-platform** — Supports Windows and macOS.
- 🧠 **Precise patching** — Targets `variations_country`, `variations_permanent_consistency_country` (set to `us`) and the global `is_glic_eligible` flag (set to `true`).

## 📥 Download & Usage

### 1. Download (portable, no installation required)

Head to the [Releases page](https://github.com/luxi78/chrome-gemini-guard/releases) for the latest build:

- **Windows** — Download `chrome-gemini-guard.exe` (single portable executable, no install needed)
- **macOS** — Download the `.dmg` or standalone app bundle

### 2. Quick start

1. Close all running Chrome windows.
2. Open **Chrome Gemini Guard**.
3. Make sure "Guardian Mode" is active in the control panel.
4. Reopen Chrome — the Gemini icon will now stay permanently.

![Screenshot](docs/main.png)

---

## 🛠️ Developer Guide

Frontend: **React + TypeScript + TailwindCSS**. Backend: **Rust + Tauri 2.x**. PRs and Issues are welcome!

### Prerequisites

- [Bun](https://bun.sh/) — frontend package manager & test runner
- [Rust + Cargo](https://rustup.rs/) — Rust compiler & test runner
- **Windows only**: Visual Studio Build Tools 2022 (C++ workload + MSVC toolchain)

### Run locally

```bash
# Install frontend dependencies
bun install

# Start the full desktop app in dev mode
bun run tauri:dev
```

### Build

```bash
bun run tauri:build
```

> Note: The Windows build statically links the C runtime to produce a zero-dependency portable executable. See `src-tauri/.cargo/config.toml` for details.

### Tests

- **Frontend (Vitest)**: `bun run test`
- **Backend (Cargo)**: `cd src-tauri && cargo test`

## 🤝 Credits

Inspired by the open-source community's exploration — special thanks to:

- [lcandy2/enable-chrome-ai](https://github.com/lcandy2/enable-chrome-ai) for the original Python parsing and patching approach.

## 📄 License

Released under the [MIT License](LICENSE). Do not use this software for any illegal or destructive purposes; all consequences arising from misuse are solely the responsibility of the user.
