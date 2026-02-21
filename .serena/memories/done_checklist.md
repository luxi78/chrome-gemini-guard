# Task 完成后永远要运行

## 前端改动 (src/ 下)
```powershell
bun run test
```
确认 `api-contract.test.ts` 和 `ui-contract.test.tsx` 均通过。

## Rust 改动 (src-tauri/ 下)
```powershell
cd src-tauri; cargo test
```

## 如果同时改动了 command 接口 / 共享状态
两者都要跑。

## 烟雾测试 (optional, 大改后建议)
```powershell
bun run tauri:dev
```手动确认应用正常启动。

## Lint / Format
- 暂无统一配置 ESLint/Prettier，保持与周围代码风格一致即可。
- Rust: `cargo fmt`（可选，但推荐）