import { Radio, ShieldCheck, ShieldAlert, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { GuardianSnapshot } from "../lib/types";

type StatusCardsProps = {
  snapshot: GuardianSnapshot;
};

const COUNTRY_NAMES: Record<string, string> = {
  US: "美国",
  CN: "中国",
  JP: "日本",
  KR: "韩国",
  GB: "英国",
  DE: "德国",
  SG: "新加坡",
  HK: "中国香港",
  TW: "中国台湾",
};

function getCountryDisplay (code: string | null): { label: string; color: string } {
  if (!code) return { label: "检测中…", color: "text-muted-foreground" };
  const name = COUNTRY_NAMES[code] ?? code;
  if (code === "US") return { label: name, color: "text-green-500" };
  if (code === "CN") return { label: name, color: "text-red-500" };
  return { label: name, color: "text-yellow-500" };
}

export function StatusCards ({ snapshot }: StatusCardsProps) {
  const isRunning = snapshot.status === "running";
  const isError = snapshot.status === "error";
  const country = getCountryDisplay(snapshot.networkHint);

  return (
    <div className="grid grid-cols-2 gap-4">
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
          <Radio className={`h-4 w-4 shrink-0 ${country.color}`} />
        </CardHeader>
        <CardContent>
          <div className={`font-bold truncate ${country.color}`} style={{ fontSize: 'clamp(0.875rem, 2vw, 1.5rem)' }}>
            {country.label}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            当前互联网出口国家
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
