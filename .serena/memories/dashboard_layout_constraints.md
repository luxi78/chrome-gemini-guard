# Dashboard 布局强约束

## Status Cards 单行约束
- Dashboard 页面的 Status Cards（守护进程状态、网络环境等）**必须始终在同一行显示**，禁止换行/堆叠。
- 宽度不足时通过 **压缩内容**（流体字号 clamp、truncate 截断）来适配，而非响应式断点换行。
- 容器使用固定 `grid-cols-N`（N = 卡片数量），不使用 `md:grid-cols-*` / `lg:grid-cols-*` 等断点切换列数。
- 每张 Card 必须有 `min-w-0` 以允许 grid item 缩小到比内容更窄。
- 状态值字号使用 `clamp()` 实现流体缩放，而非断点式阶梯变化。
- 图标使用 `shrink-0` 防止被压缩。
