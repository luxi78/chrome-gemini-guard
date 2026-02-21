# 代码风格与规范

## TypeScript / React
- **命名**: camelCase 局变量/函数， PascalCase React 组件/接口/类型
- **Strict TS**: 所有组件使用显式类型，禁止 `any`
- **样式**: TailwindCSS utility-first，条件类使用 `clsx`/`tailwind-merge`，禁用 inline styles 和纯 CSS
- **UI 组件**: shadcn/ui + Radix UI primitives，图标用 lucide-react
- **测试锊**: 组件中 `data-testid` 属性必须保留，禁止在 UI 重构时删除
- **包管理**: Bun (禁用 npm/yarn)

## Rust
- Rust 2021 edition，标准异步 (tokio)
- 错误处理: `thiserror` 定义错误类型，显式 `if let Err` / `?` 传播
- Tauri commands 均在 `src-tauri/src/commands/` 下，在 `main.rs` 的 `invoke_handler!` 中注册
- 全局状态通过 `app_state.rs` 的 `Mutex<RuntimeState>` 管理 (非 Tauri 请求中直接 lock)

## 注释风格
- 只写非显而易见的意图、trade-off、约束。不写基础语法注释。

## 其他
- 改动范围小、聚焦，非必要不重构
- 前后端共享类型定义在 `src/lib/types.ts`，Tauri invoke 封装在 `src/lib/api.ts`