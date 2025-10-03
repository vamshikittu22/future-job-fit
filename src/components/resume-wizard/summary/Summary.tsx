import { Textarea } from "@/components/ui/textarea";

interface SummaryProps {
  value: string;
  onChange: (value: string) => void;
}

export const Summary = ({ value, onChange }: SummaryProps) => {
  return (
    <div>
      <Textarea
        className="min-h-[200px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Experienced professional with a passion for..."
      />
    </div>
  );
};

export default Summary;
