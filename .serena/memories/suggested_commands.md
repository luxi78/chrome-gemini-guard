# Suggested Commands (Windows / PowerShell)

## 工具链验证
```powershell
bun --version
rustc --version
cargo --version
```

## 依赖安装
```powershell
bun install          # JS 依赖 (项目根目录)
# Rust 依赖在首次 cargo 命令时自动拉取
```

## 开发运行
```powershell
bun run tauri:dev    # 完整桌面应用 (推荐)
bun run dev          # 仅前端 (http://localhost:1420)，无原生 API
```

## 构建
```powershell
bun run build        # 前端构建
bun run tauri:build  # 生产桌面应用包
cd src-tauri; cargo build --release  # Rust release 构建
```

## 测试
```powershell
bun run test         # 前端单次测试 (Vitest)
bun run test:watch   # 前端监听模式
cd src-tauri; cargo test  # Rust 单元/集成测试
```

## Windows 常用命令
```powershell
Get-ChildItem        # ls 等价
Get-Content <file>   # cat 等价
Select-String        # grep 等价
cd, mv, cp, rm       # 同 unix
rg <pattern>         # ripgrep (已安装，优先使用)
```