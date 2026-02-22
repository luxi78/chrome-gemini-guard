import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { EventItem } from "../lib/types";
import { Search } from "lucide-react";

type LogsPageProps = {
	events: EventItem[];
};

export function LogsPage ({ events }: LogsPageProps) {
	const { t, i18n } = useTranslation();
	const [search, setSearch] = useState("");
	const [filterLevel, setFilterLevel] = useState<"all" | EventItem["level"]>("all");

	const filteredEvents = events.filter((item) => {
		if (filterLevel !== "all" && item.level !== filterLevel) return false;
		if (search && !item.message.toLowerCase().includes(search.toLowerCase())) return false;
		return true;
	});

	const formatTime = (iso: string) => {
		const numeric = Number(iso);
		const dt = Number.isFinite(numeric) ? new Date(numeric) : new Date(iso);
		const locale = i18n.language.startsWith("zh") ? "zh-CN" : "en-US";
		return Number.isNaN(dt.getTime()) ? iso : dt.toLocaleString(locale, { hour12: false });
	};

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h2 className="text-3xl font-bold tracking-tight">System Logs</h2>
				<p className="text-muted-foreground">{t("logs.subtitle")}</p>
			</div>

			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div className="relative w-full max-w-sm">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder={t("logs.searchPlaceholder")}
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="pl-8"
							/>
						</div>
						<div className="flex gap-2">
							{(["all", "info", "warn", "error"] as const).map(level => (
								<Badge
									key={level}
									variant={filterLevel === level ? "default" : "outline"}
									className="cursor-pointer capitalize"
									onClick={() => setFilterLevel(level)}
								>
									{level}
								</Badge>
							))}
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[180px]">{t("logs.timestamp")}</TableHead>
									<TableHead className="w-[100px]">{t("logs.level")}</TableHead>
									<TableHead>{t("logs.message")}</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredEvents.length > 0 ? filteredEvents.map((item, i) => (
									<TableRow key={i}>
										<TableCell className="font-mono text-xs text-muted-foreground">
											{formatTime(item.at)}
										</TableCell>
										<TableCell>
											<Badge variant="outline" className={
												item.level === 'error' ? 'text-destructive border-destructive/50' :
													item.level === 'warn' ? 'text-yellow-600 border-yellow-600/50' :
														'text-muted-foreground'
											}>
												{item.level}
											</Badge>
										</TableCell>
										<TableCell className="font-mono text-sm">{item.message}</TableCell>
									</TableRow>
								)) : (
									<TableRow>
										<TableCell colSpan={3} className="h-24 text-center">
											{t("logs.empty")}
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
