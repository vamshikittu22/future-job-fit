import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/shared/ui/badge";

interface PanelHeaderProps {
  icon: LucideIcon;
  title: string;
  badge?: string;
  actions?: ReactNode;
}

export default function PanelHeader({
  icon: Icon,
  title,
  badge,
  actions,
}: PanelHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b p-4">
      <div className="flex min-w-0 items-center">
        <Icon className="mr-2 h-5 w-5 text-muted-foreground" />
        <h3 className="truncate text-lg font-semibold">{title}</h3>
        {badge && (
          <Badge variant="secondary" className="ml-2">
            {badge}
          </Badge>
        )}
      </div>

      {actions && <div className="ml-3 flex items-center gap-2">{actions}</div>}
    </div>
  );
}
