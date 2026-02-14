import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { Dashboard } from "./app/dashboard";
import "./app/shell.css";
import {
  fetchAutostartStatus,
  fetchRecentEvents,
  fetchSnapshot,
  reconcileNow,
  setAutostart,
  setStrictMode,
  toggleGuardian
} from "./lib/api";
import type { EventItem, GuardianSnapshot } from "./lib/types";

type PageKey = "dashboard" | "logs" | "settings";
type LogFilter = "all" | EventItem["level"];

function App() {
  const [snapshot, setSnapshot] = useState<GuardianSnapshot>({
    status: "idle",
    strictMode: false,
    autostartEnabled: false,
    networkHint: null
  });
  const [events, setEvents] = useState<EventItem[]>([]);
  const [page, setPage] = useState<PageKey>("dashboard");
  const [search, setSearch] = useState("");
  const [logFilter, setLogFilter] = useState<LogFilter>("all");

  const reload = async () => {
    const [next, autostartEnabled, recentEvents] = await Promise.all([
      fetchSnapshot(),
      fetchAutostartStatus(),
      fetchRecentEvents(120)
    ]);
    setSnapshot({ ...next, autostartEnabled });
    setEvents(recentEvents);
  };

  useEffect(() => {
    void reload();
    const timer = window.setInterval(() => {
      void reload();
    }, 2000);
    return () => window.clearInterval(timer);
  }, []);

  const filteredEvents = events.filter((item) => {
    if (logFilter !== "all" && item.level !== logFilter) {
      return false;
    }
    if (!search.trim()) {
      return true;
    }
    return item.message.toLowerCase().includes(search.trim().toLowerCase());
  });

  const formatTime = (iso: string) => {
    const numeric = Number(iso);
    const dt = Number.isFinite(numeric) ? new Date(numeric) : new Date(iso);
    return Number.isNaN(dt.getTime()) ? iso : dt.toLocaleTimeString("zh-CN", { hour12: false });
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <p className="brand-title">Chrome Gemini Guard</p>
          <p className="brand-subtitle">本地状态守护工具</p>
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-btn ${page === "dashboard" ? "active" : ""}`} onClick={() => setPage("dashboard")}>
            仪表盘
          </button>
          <button className={`nav-btn ${page === "logs" ? "active" : ""}`} onClick={() => setPage("logs")}>
            日志
          </button>
          <button className={`nav-btn ${page === "settings" ? "active" : ""}`} onClick={() => setPage("settings")}>
            设置
          </button>
        </nav>

      </aside>

      <section className="content">
        {page === "dashboard" && (
          <div className="content-wrap">
            {snapshot.status === "error" && (
              <section className="alert">
                <div>
                  <p className="alert-title">需要处理</p>
                  <p className="alert-desc">检测到修复失败，请使用管理员权限重新执行修复。</p>
                </div>
              </section>
            )}

            <Dashboard snapshot={snapshot} events={events} />

            <section className="card">
              <h2 className="card-title">操作</h2>
              <p className="card-subtitle">保留关键操作入口，主次分明并减少误触。</p>
              <div className="btn-group" style={{ marginTop: 12 }}>
                <button
                  className="btn-primary"
                  onClick={async () => {
                    if (snapshot.status === "error") {
                      await reconcileNow();
                      await reload();
                      return;
                    }
                    await toggleGuardian(snapshot.status !== "running");
                    await reload();
                  }}
                >
                  {snapshot.status === "error" ? "Run as Admin" : snapshot.status === "running" ? "停止守护" : "启动守护"}
                </button>
                <button
                  className="btn-secondary"
                  onClick={async () => {
                    await reconcileNow();
                    await reload();
                  }}
                >
                  立即修复
                </button>
              </div>
            </section>
          </div>
        )}

        {page === "logs" && (
          <div className="content-wrap">
            <section className="card">
              <h2 className="card-title">事件日志</h2>
              <p className="card-subtitle">支持检索和按级别筛选，不包含日志详情弹层。</p>
              <div className="log-controls" style={{ marginTop: 12 }}>
                <input
                  className="search-input"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="搜索关键词..."
                />
                <div className="filter-row">
                  {(["all", "info", "warn", "error"] as const).map((item) => (
                    <button
                      key={item}
                      className={`chip ${logFilter === item ? "active" : ""}`}
                      onClick={() => setLogFilter(item)}
                    >
                      {item === "all" ? "全部" : item.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <ul className="event-list" style={{ marginTop: 14 }}>
                {filteredEvents.length === 0 ? (
                  <li className="event-item">
                    <p className="event-message">没有匹配的日志</p>
                  </li>
                ) : (
                  filteredEvents.map((item) => (
                    <li key={`${item.at}-${item.message}`} className="event-item">
                      <div className="row" style={{ marginBottom: 6 }}>
                        <span className="event-meta">{formatTime(item.at)}</span>
                        <span className={item.level === "error" ? "badge badge-error" : item.level === "warn" ? "badge badge-idle" : "badge badge-running"}>
                          {item.level}
                        </span>
                      </div>
                      <p className="event-message">{item.message}</p>
                    </li>
                  ))
                )}
              </ul>
            </section>
          </div>
        )}

        {page === "settings" && (
          <div className="content-wrap">
            <section className="card">
              <h2 className="card-title">设置</h2>
              <p className="card-subtitle">已移除路径编辑与检测间隔，仅保留真实可用配置。</p>

              <div className="setting-row">
                <div>
                  <p className="setting-title">严格模式</p>
                  <p className="setting-desc">开启后对偏差值采用更严格修复策略。</p>
                </div>
                <button
                  className={`switch ${snapshot.strictMode ? "on" : ""}`}
                  onClick={async () => {
                    await setStrictMode(!snapshot.strictMode);
                    await reload();
                  }}
                >
                  {snapshot.strictMode ? "已开启" : "已关闭"}
                </button>
              </div>

              <div className="setting-row">
                <div>
                  <p className="setting-title">开机自启动</p>
                  <p className="setting-desc">系统登录后自动启动守护应用。</p>
                </div>
                <button
                  className={`switch ${snapshot.autostartEnabled ? "on" : ""}`}
                  onClick={async () => {
                    await setAutostart(!snapshot.autostartEnabled);
                    await reload();
                  }}
                >
                  {snapshot.autostartEnabled ? "已开启" : "已关闭"}
                </button>
              </div>
            </section>
          </div>
        )}
      </section>
    </div>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(<App />);
