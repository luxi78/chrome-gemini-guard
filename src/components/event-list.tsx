import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { EventItem } from "../lib/types";

type EventListProps = {
  events: EventItem[];
};

function toLocalTimeLabel (raw: string): string {
  const numeric = Number(raw);
  const date = Number.isFinite(numeric) ? new Date(numeric) : new Date(raw);
  if (Number.isNaN(date.getTime())) {
    return raw;
  }
  return date.toLocaleString("zh-CN", { hour12: false });
}

export function EventList ({ events }: EventListProps) {
  return (
    <Card className="flex-1 min-h-0 flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>最近事件</CardTitle>
            <CardDescription>系统监控日志与操作记录</CardDescription>
          </div>
          <Badge variant="outline" className="text-xs font-normal">
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-full px-6 pb-4">
          <div className="space-y-4">
            {events.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground py-8">
                暂无事件记录
              </div>
            ) : (
              events.map((item, i) => (
                <div key={`${item.at}-${i}`} className="flex flex-col space-y-1 pb-4 border-b last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium leading-none">
                      {item.message || "System Event"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {toLocalTimeLabel(item.at)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    Operation details logged by system.
                  </p>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
