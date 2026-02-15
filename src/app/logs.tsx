import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { EventItem } from "../lib/types";
import { Search } from "lucide-react";

type LogsPageProps = {
	events: EventItem[];
};

export function LogsPage ({ events }: LogsPageProps) {
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
		return Number.isNaN(dt.getTime()) ? iso : dt.toLocaleString("zh-CN", { hour12: false });
	};

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h2 className="text-3xl font-bold tracking-tight">System Logs</h2>
				<p className="text-muted-foreground">查看详细的系统运行日志与事件。</p>
			</div>

			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div className="relative w-full max-w-sm">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="搜索日志..."
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
									<TableHead className="w-[180px]">Timestamp</TableHead>
									<TableHead className="w-[100px]">Level</TableHead>
									<TableHead>Message</TableHead>
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
											暂无日志数据
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
