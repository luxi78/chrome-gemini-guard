import { Activity, Radio, ShieldCheck, ShieldAlert, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { GuardianSnapshot } from "../lib/types";

type StatusCardsProps = {
  snapshot: GuardianSnapshot;
};

export function StatusCards ({ snapshot }: StatusCardsProps) {
  const isRunning = snapshot.status === "running";
  const isError = snapshot.status === "error";

  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="min-w-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium truncate">守护进程状态</CardTitle>
          {isRunning ? (
            <ShieldCheck className="h-4 w-4 shrink-0 text-green-500" />
          ) : isError ? (
            <ShieldAlert className="h-4 w-4 shrink-0 text-destructive" />
          ) : (
            <Shield className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
        </CardHeader>
        <CardContent>
          <div className="font-bold capitalize flex items-center gap-1.5 min-w-0" style={{ fontSize: 'clamp(0.875rem, 2vw, 1.5rem)' }}>
            <span className="truncate">{snapshot.status}</span>
            <Badge
              variant={isRunning ? "success" : isError ? "destructive" : "secondary"}
              className="shrink-0"
            >
              {isRunning ? "Active" : "Idle"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {isRunning ? "正在持续监控 Local State" : "服务未运行"}
          </p>
        </CardContent>
      </Card>

      <Card className="min-w-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium truncate">网络环境</CardTitle>
          <Radio className="h-4 w-4 shrink-0 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold truncate" style={{ fontSize: 'clamp(0.875rem, 2vw, 1.5rem)' }}>
            {snapshot.networkHint ?? "未知"}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            当前的地理位置标识
          </p>
        </CardContent>
      </Card>

      <Card className="min-w-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium truncate">运行时间</CardTitle>
          <Activity className="h-4 w-4 shrink-0 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold truncate" style={{ fontSize: 'clamp(0.875rem, 2vw, 1.5rem)' }}>--</div>
          <p className="text-xs text-muted-foreground truncate">
            自上次启动以来
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
