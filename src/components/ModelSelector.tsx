import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";

interface ModelSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const models = [
  { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", badge: "Fast" },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", badge: "Pro" },
];

export default function ModelSelector({ value, onValueChange }: ModelSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <label htmlFor="model-select" className="text-sm font-medium text-muted-foreground">
        AI Model:
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select model" />
        </SelectTrigger>
        <SelectContent>
          {models.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              <div className="flex items-center gap-2">
                <span>{model.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {model.badge}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}