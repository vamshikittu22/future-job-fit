import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import { Loader2, Check } from 'lucide-react';
import { useResumeAI, SummaryVersion } from '@/shared/hooks/useResumeAI';

interface SummaryEnhanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (summary: string) => void;
  currentSummary?: string;
}

export const SummaryEnhanceModal = ({
  open,
  onOpenChange,
  onSelect,
  currentSummary,
}: SummaryEnhanceModalProps) => {
  const { enhanceSummary, isLoading } = useResumeAI();
  const [jobTitle, setJobTitle] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [industry, setIndustry] = useState('');
  const [summaries, setSummaries] = useState<SummaryVersion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
    
    const result = await enhanceSummary({
      jobTitle,
      yearsExperience,
      skills: skillsArray,
      industry,
    });

    if (result) {
      setSummaries(result);
    }
  };

  const handleSelect = () => {
    if (selectedIndex !== null) {
      onSelect(summaries[selectedIndex].text);
      onOpenChange(false);
      // Reset
      setSummaries([]);
      setSelectedIndex(null);
    }
  };

  const canGenerate = jobTitle && yearsExperience && skills;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI Summary Generator</DialogTitle>
          <DialogDescription>
            Generate professional summaries tailored to your experience and skills
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Input Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title *</Label>
              <Input
                id="jobTitle"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g., Senior Software Engineer"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience *</Label>
              <Input
                id="experience"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(e.target.value)}
                placeholder="e.g., 5+"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="skills">Key Skills (comma-separated) *</Label>
              <Input
                id="skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g., React, TypeScript, Node.js, AWS"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="industry">Industry (optional)</Label>
              <Input
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g., FinTech, Healthcare, E-commerce"
              />
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!canGenerate || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Summaries'
            )}
          </Button>

          {/* Generated Summaries */}
          {summaries.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Choose Your Summary</h3>
                <p className="text-sm text-muted-foreground">Click to select, then use</p>
              </div>

              <div className="grid gap-4">
                {summaries.map((summary, index) => (
                  <Card
                    key={index}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedIndex === index
                        ? 'border-primary bg-accent'
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedIndex(index)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="capitalize">
                            {summary.version}
                          </Badge>
                          <Badge variant="secondary">{summary.tone}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {summary.wordCount} words
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed">{summary.text}</p>
                      </div>
                      {selectedIndex === index && (
                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSelect} disabled={selectedIndex === null}>
                  Use Selected Summary
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
