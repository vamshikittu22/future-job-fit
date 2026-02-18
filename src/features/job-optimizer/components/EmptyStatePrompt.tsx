import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/shared/ui/button";

interface EmptyStateAction {
  icon?: LucideIcon;
  label: string;
  onClick: () => void;
}

interface EmptyStatePromptProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: EmptyStateAction;
}

export default function EmptyStatePrompt({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStatePromptProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-full flex-col items-center justify-center p-8 text-center"
    >
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <Icon className="h-10 w-10 text-muted-foreground" />
      </div>

      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="mb-6 max-w-md text-sm text-muted-foreground">{description}</p>

      {action && (
        <Button onClick={action.onClick} size="lg">
          {action.icon && <action.icon className="mr-2 h-4 w-4" />}
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}
