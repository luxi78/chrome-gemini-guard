import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";
import type { GuardianSnapshot } from "../lib/types";

type SettingsPageProps = {
	snapshot: GuardianSnapshot;
	onToggleAutostart: () => void;
	onToggleStrictMode: () => void;
	onToggleGuardian: () => void;
	onReconcile: () => void;
};

export function SettingsPage ({
	snapshot,
	onToggleAutostart,
	onToggleStrictMode,
	onToggleGuardian,
	onReconcile
}: SettingsPageProps) {

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h2 className="text-3xl font-bold tracking-tight">Settings</h2>
				<p className="text-muted-foreground">配置守护进程的行为策略。</p>
			</div>

			{snapshot.status === "error" && (
				<Alert variant="destructive">
					<ShieldAlert className="h-4 w-4" />
					<AlertTitle>需要管理员权限</AlertTitle>
					<AlertDescription>
						检测到服务异常，可能需要以管理员身份运行此程序才能进行修复。
					</AlertDescription>
				</Alert>
			)}

			<Card>
				<CardHeader>
					<CardTitle>常规设置</CardTitle>
					<CardDescription>控制应用程序的基本功能</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex items-center justify-between space-x-2">
						<div className="space-y-0.5">
							<Label className="text-base">开机自启动</Label>
							<p className="text-sm text-muted-foreground">
								登录系统时自动启动 Chrome Gemini Guard
							</p>
						</div>
						<Switch checked={snapshot.autostartEnabled} onCheckedChange={onToggleAutostart} />
					</div>
					<Separator />
					<div className="flex items-center justify-between space-x-2">
						<div className="space-y-0.5">
							<Label className="text-base">严格模式</Label>
							<p className="text-sm text-muted-foreground">
								强制覆盖任何不符合预期的 Local State 修改
							</p>
						</div>
						<Switch checked={snapshot.strictMode} onCheckedChange={onToggleStrictMode} />
					</div>
				</CardContent>
			</Card>

			<Card className="border-destructive/50">
				<CardHeader>
					<CardTitle className="text-destructive">危险区域</CardTitle>
					<CardDescription>执行可能影响 Chrome 运行的高级操作</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<div className="font-medium">手动修复</div>
							<div className="text-sm text-muted-foreground">立即执行一次 Local State 根据规则的强制同步</div>
						</div>
						<Button variant="secondary" onClick={onReconcile}>立即修复</Button>
					</div>
					<Separator />
					<div className="flex items-center justify-between">
						<div>
							<div className="font-medium">守护进程开关</div>
							<div className="text-sm text-muted-foreground">完全停止或启动后台监控服务</div>
						</div>
						<Button
							variant={snapshot.status === "running" ? "destructive" : "default"}
							onClick={onToggleGuardian}
						>
							{snapshot.status === "running" ? "停止服务" : "启动服务"}
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
