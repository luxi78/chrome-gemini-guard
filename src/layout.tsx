import { LayoutDashboard, Settings, FileText, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export type NavPath = "dashboard" | "logs" | "settings";

interface LayoutProps {
	children: React.ReactNode;
	currentPath: NavPath;
	onNavigate: (path: NavPath) => void;
	strictMode: boolean;
}

export function Layout ({ children, currentPath, onNavigate, strictMode }: LayoutProps) {
	return (
		<div className="flex h-screen bg-background">
			{/* Sidebar */}
			<div className="w-64 border-r bg-card flex flex-col">
				<div className="p-6">
					<div className="flex items-center gap-2 mb-2">
						<div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
							<Shield className="h-5 w-5 text-primary-foreground" />
						</div>
						<h1 className="font-bold text-lg tracking-tight">Gemini Guard</h1>
					</div>
					<p className="text-xs text-muted-foreground pl-10">
						Chrome State Monitor
					</p>
				</div>

				<ScrollArea className="flex-1 px-4">
					<div className="space-y-1">
						<Button
							variant={currentPath === "dashboard" ? "secondary" : "ghost"}
							className="w-full justify-start"
							onClick={() => onNavigate("dashboard")}
						>
							<LayoutDashboard className="mr-2 h-4 w-4" />
							仪表盘
						</Button>
						<Button
							variant={currentPath === "settings" ? "secondary" : "ghost"}
							className="w-full justify-start"
							onClick={() => onNavigate("settings")}
						>
							<Settings className="mr-2 h-4 w-4" />
							设置
						</Button>
						<Button
							variant={currentPath === "logs" ? "secondary" : "ghost"}
							className="w-full justify-start"
							onClick={() => onNavigate("logs")}
						>
							<FileText className="mr-2 h-4 w-4" />
							日志
						</Button>
					</div>

					<Separator className="my-4" />

					{/* 生效规则 */}
					<div className="px-2 py-2">
						<h4 className="mb-3 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
							生效规则
						</h4>
						<div className="space-y-2 text-sm">
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Country</span>
								<span className="font-mono text-xs">US</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Eligibility</span>
								<span className="font-mono text-xs">true</span>
							</div>
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground">Strict Mode</span>
								{strictMode ? (
									<Badge className="bg-green-500/15 text-green-700 hover:bg-green-500/25 border-0 text-xs px-1.5 py-0">On</Badge>
								) : (
									<Badge variant="secondary" className="text-xs px-1.5 py-0">Off</Badge>
								)}
							</div>
						</div>
					</div>

			</ScrollArea>

				<div className="p-4 border-t text-xs text-muted-foreground text-center">
					v0.1.0-alpha
				</div>
			</div>

			{/* Main Content */}
			<main className="flex-1 flex flex-col overflow-hidden bg-muted/20">
				<div className="flex-1 overflow-auto p-8">
					<div className="mx-auto max-w-6xl h-full flex flex-col gap-8">
						{children}
					</div>
				</div>
			</main>
		</div>
	);
}
