import { Radio, ShieldCheck, ShieldAlert, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import type { GuardianSnapshot } from "../lib/types";

type StatusCardsProps = {
  snapshot: GuardianSnapshot;
};

function useCountryDisplay (code: string | null): { label: string; color: string } {
  const { t } = useTranslation();
  if (!code) return { label: t("statusCards.detecting"), color: "text-muted-foreground" };
  const name = t(`countries.${code}`, { defaultValue: code });
  if (code === "US") return { label: name, color: "text-green-500" };
  if (code === "CN") return { label: name, color: "text-red-500" };
  return { label: name, color: "text-yellow-500" };
}

export function StatusCards ({ snapshot }: StatusCardsProps) {
  const { t } = useTranslation();
  const isRunning = snapshot.status === "running";
  const isError = snapshot.status === "error";
  const country = useCountryDisplay(snapshot.networkHint);

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="min-w-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium truncate">{t("statusCards.guardianStatus")}</CardTitle>
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
            {isRunning ? t("statusCards.monitoring") : t("statusCards.notRunning")}
          </p>
        </CardContent>
      </Card>

      <Card className="min-w-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium truncate">{t("statusCards.network")}</CardTitle>
          <Radio className={`h-4 w-4 shrink-0 ${country.color}`} />
        </CardHeader>
        <CardContent>
          <div className={`font-bold truncate ${country.color}`} style={{ fontSize: 'clamp(0.875rem, 2vw, 1.5rem)' }}>
            {country.label}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {t("statusCards.networkDesc")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
