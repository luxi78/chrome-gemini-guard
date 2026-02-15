import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type RulesPreviewProps = {
  strictMode: boolean;
};

export function RulesPreview ({ strictMode }: RulesPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>生效规则</CardTitle>
        <CardDescription>当前应用的 Chrome Local State 锁定规则</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Field</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Country</TableCell>
              <TableCell className="font-mono text-xs">US</TableCell>
              <TableCell className="text-right">
                <Badge variant="outline" className="text-xs text-muted-foreground font-normal">Locked</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Eligibility</TableCell>
              <TableCell className="font-mono text-xs">is_glic_eligible = true</TableCell>
              <TableCell className="text-right">
                <Badge variant="outline" className="text-xs text-muted-foreground font-normal">Locked</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Strict Mode</TableCell>
              <TableCell className="font-mono text-xs">{String(strictMode)}</TableCell>
              <TableCell className="text-right">
                {strictMode ? (
                  <Badge className="bg-green-500/15 text-green-700 hover:bg-green-500/25 border-0">On</Badge>
                ) : (
                  <Badge variant="secondary">Off</Badge>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
