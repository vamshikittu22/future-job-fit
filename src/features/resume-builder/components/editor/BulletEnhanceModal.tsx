import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Label } from '@/shared/ui/label';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import { Loader2, Check, TrendingUp } from 'lucide-react';
import { useResumeAI, BulletEnhancement } from '@/shared/hooks/useResumeAI';

interface BulletEnhanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (bullet: string) => void;
  currentBullet?: string;
  jobTitle?: string;
}

export const BulletEnhanceModal = ({
  open,
  onOpenChange,
  onSelect,
  currentBullet = '',
  jobTitle = '',
}: BulletEnhanceModalProps) => {
  const { enhanceBullet, isLoading } = useResumeAI();
  const [bullet, setBullet] = useState(currentBullet);
  const [title, setTitle] = useState(jobTitle);
  const [companyType, setCompanyType] = useState('');
  const [enhancements, setEnhancements] = useState<BulletEnhancement[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    const result = await enhanceBullet({
      currentBullet: bullet,
      jobTitle: title,
      companyType,
    });

    if (result) {
      setEnhancements(result);
    }
  };

  const handleSelect = () => {
    if (selectedIndex !== null) {
      onSelect(enhancements[selectedIndex].text);
      onOpenChange(false);
      setEnhancements([]);
      setSelectedIndex(null);
    }
  };

  const canGenerate = bullet && title;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI Bullet Enhancer</DialogTitle>
          <DialogDescription>
            Transform your experience bullets using the XYZ formula: "Accomplished [X] measured by [Y] by doing [Z]"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Input Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bullet">Current Bullet *</Label>
              <Textarea
                id="bullet"
                value={bullet}
                onChange={(e) => setBullet(e.target.value)}
                placeholder="e.g., Managed projects for the team"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input
                  id="jobTitle"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Senior Product Manager"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyType">Company Type (optional)</Label>
                <Input
                  id="companyType"
                  value={companyType}
                  onChange={(e) => setCompanyType(e.target.value)}
                  placeholder="e.g., Startup, Enterprise, Corporate"
                />
              </div>
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
                Enhancing...
              </>
            ) : (
              <>
                <TrendingUp className="mr-2 h-4 w-4" />
                Enhance Bullet
              </>
            )}
          </Button>

          {/* Enhanced Bullets */}
          {enhancements.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Enhanced Versions</h3>
                <p className="text-sm text-muted-foreground">Click to select</p>
              </div>

              <div className="grid gap-4">
                {enhancements.map((enhancement, index) => (
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
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary">Version {index + 1}</Badge>
                          {enhancement.metrics.map((metric, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {metric}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm leading-relaxed">{enhancement.text}</p>
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
                  Use Selected Bullet
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
