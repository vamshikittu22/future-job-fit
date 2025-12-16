import { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { AIEnhanceButton } from '../AIEnhanceButton';
import { SummaryEnhanceModal } from '../SummaryEnhanceModal';

interface SummaryProps {
  value: string;
  onChange: (value: string) => void;
}

export const Summary = ({ value, onChange }: SummaryProps) => {
  const [showAIModal, setShowAIModal] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Write a compelling professional summary that highlights your key strengths
        </p>
        <AIEnhanceButton onClick={() => setShowAIModal(true)} />
      </div>

      <Textarea
        className="min-h-[200px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Experienced professional with a passion for..."
      />

      <SummaryEnhanceModal
        open={showAIModal}
        onOpenChange={setShowAIModal}
        onSelect={onChange}
        currentSummary={value}
      />
    </div>
  );
};

export default Summary;
