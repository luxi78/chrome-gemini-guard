import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
	const { t, i18n } = useTranslation();
	const currentLang = i18n.language.startsWith("zh") ? "zh" : "en";

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h2 className="text-3xl font-bold tracking-tight">Settings</h2>
				<p className="text-muted-foreground">{t("settings.subtitle")}</p>
			</div>

			{snapshot.status === "error" && (
				<Alert variant="destructive">
					<ShieldAlert className="h-4 w-4" />
					<AlertTitle>{t("settings.adminRequired")}</AlertTitle>
					<AlertDescription>
						{t("settings.adminRequiredDesc")}
					</AlertDescription>
				</Alert>
			)}

			<Card>
				<CardHeader>
					<CardTitle>{t("settings.general")}</CardTitle>
					<CardDescription>{t("settings.generalDesc")}</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex items-center justify-between space-x-2">
						<div className="space-y-0.5">
							<Label className="text-base">{t("settings.autostart")}</Label>
							<p className="text-sm text-muted-foreground">
								{t("settings.autostartDesc")}
							</p>
						</div>
						<Switch checked={snapshot.autostartEnabled} onCheckedChange={onToggleAutostart} />
					</div>
					<Separator />
					<div className="flex items-center justify-between space-x-2">
						<div className="space-y-0.5">
							<Label className="text-base">{t("settings.strictMode")}</Label>
							<p className="text-sm text-muted-foreground">
								{t("settings.strictModeDesc")}
							</p>
						</div>
						<Switch checked={snapshot.strictMode} onCheckedChange={onToggleStrictMode} />
					</div>
					<Separator />
					<div className="flex items-center justify-between space-x-2">
						<div className="space-y-0.5">
							<Label className="text-base">{t("settings.language")}</Label>
							<p className="text-sm text-muted-foreground">
								{t("settings.languageDesc")}
							</p>
						</div>
						<div className="flex gap-1 rounded-md border p-1">
							<Button
								variant={currentLang === "zh" ? "secondary" : "ghost"}
								size="sm"
								className="h-7 px-3 text-xs"
								onClick={() => i18n.changeLanguage("zh")}
							>
								中文
							</Button>
							<Button
								variant={currentLang === "en" ? "secondary" : "ghost"}
								size="sm"
								className="h-7 px-3 text-xs"
								onClick={() => i18n.changeLanguage("en")}
							>
								English
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card className="border-destructive/50">
				<CardHeader>
					<CardTitle className="text-destructive">{t("settings.dangerZone")}</CardTitle>
					<CardDescription>{t("settings.dangerZoneDesc")}</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<div className="font-medium">{t("settings.manualFix")}</div>
							<div className="text-sm text-muted-foreground">{t("settings.manualFixDesc")}</div>
						</div>
						<Button variant="secondary" onClick={onReconcile}>{t("settings.fixNow")}</Button>
					</div>
					<Separator />
					<div className="flex items-center justify-between">
						<div>
							<div className="font-medium">{t("settings.guardianToggle")}</div>
							<div className="text-sm text-muted-foreground">{t("settings.guardianToggleDesc")}</div>
						</div>
						<Button
							variant={snapshot.status === "running" ? "destructive" : "default"}
							onClick={onToggleGuardian}
						>
							{snapshot.status === "running" ? t("settings.stopService") : t("settings.startService")}
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
