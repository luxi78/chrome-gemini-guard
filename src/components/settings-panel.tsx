import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type SettingsPanelProps = {
  autostartEnabled: boolean;
};

export function SettingsPanel ({ autostartEnabled }: SettingsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>快速设置</CardTitle>
        <CardDescription>管理守护进程的基本行为</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-1">
            <Label htmlFor="autostart" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              开机自启动
            </Label>
            <p className="text-xs text-muted-foreground">
              跟随系统启动 Chrome Gemini Guard
            </p>
          </div>
          <Switch id="autostart" checked={autostartEnabled} disabled />
        </div>
      </CardContent>
    </Card>
  );
}
