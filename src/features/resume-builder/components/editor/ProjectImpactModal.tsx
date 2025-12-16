import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Loader2, Lightbulb } from 'lucide-react';
import { useResumeAI } from '@/shared/hooks/useResumeAI';
import { useToast } from '@/shared/hooks/use-toast';

interface ProjectImpactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  description: string;
  technologies: string[];
  onSelect: (bullet: string) => void;
}

export const ProjectImpactModal = ({
  open,
  onOpenChange,
  projectName,
  description,
  technologies,
  onSelect,
}: ProjectImpactModalProps) => {
  const { suggestProjectImpact, isLoading } = useResumeAI();
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<any>(null);

  const handleGenerate = async () => {
    const result = await suggestProjectImpact({
      projectName,
      description,
      technologies,
    });
    if (result) {
      setSuggestions(result);
    }
  };

  const handleSelectBullet = (bulletText: string) => {
    onSelect(bulletText);
    toast({
      title: 'Bullet Added',
      description: 'Impact statement added to your project description',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI Project Impact Helper</DialogTitle>
        </DialogHeader>

        {!suggestions ? (
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Get AI-powered suggestions for impactful metrics and achievement-focused bullet points for your project.
            </p>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium">Project:</span>
                <span className="text-sm ml-2">{projectName}</span>
              </div>
              <div>
                <span className="text-sm font-medium">Technologies:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {technologies.map((tech, idx) => (
                    <Badge key={idx} variant="secondary">{tech}</Badge>
                  ))}
                </div>
              </div>
            </div>
            <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Suggestions...
                </>
              ) : (
                <>
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Generate Impact Suggestions
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium mb-2">Suggested Metrics</h4>
                <div className="space-y-2">
                  {suggestions.suggestedMetrics.map((metric: any, idx: number) => (
                    <div key={idx} className="p-3 bg-muted rounded-lg">
                      <div className="font-medium text-sm">{metric.type}</div>
                      <div className="text-sm text-muted-foreground">{metric.example}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Impact-Focused Bullets</h4>
                <div className="space-y-2">
                  {suggestions.bullets.map((bullet: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 bg-muted rounded-lg hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => handleSelectBullet(bullet.text)}
                    >
                      <div className="text-sm mb-1">{bullet.text}</div>
                      <Badge variant="outline" className="text-xs">
                        {bullet.focus}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Button variant="outline" onClick={() => setSuggestions(null)} className="w-full">
              Generate New Suggestions
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
