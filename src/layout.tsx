import { LayoutDashboard, Settings, FileText, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export type NavPath = "dashboard" | "logs" | "settings";

interface LayoutProps {
	children: React.ReactNode;
	currentPath: NavPath;
	onNavigate: (path: NavPath) => void;
}

export function Layout ({ children, currentPath, onNavigate }: LayoutProps) {
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
					<div className="px-4 py-2">
						<h4 className="mb-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
							System
						</h4>
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
							Service Running
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
					<div className="mx-auto max-w-6xl space-y-8">
						{children}
					</div>
				</div>
			</main>
		</div>
	);
}
