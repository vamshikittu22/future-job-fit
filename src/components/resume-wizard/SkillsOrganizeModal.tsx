import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Check, X, AlertTriangle } from 'lucide-react';
import { useResumeAI } from '@/hooks/useResumeAI';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SkillsOrganizeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSkills: string[];
  onApply: (organized: { technical: string[]; tools: string[]; soft: string[]; languages: string[] }) => void;
}

export const SkillsOrganizeModal = ({
  open,
  onOpenChange,
  currentSkills,
  onApply,
}: SkillsOrganizeModalProps) => {
  const { organizeSkills, isLoading } = useResumeAI();
  const { toast } = useToast();
  const [organization, setOrganization] = useState<any>(null);

  const handleOrganize = async () => {
    const result = await organizeSkills({ skills: currentSkills });
    if (result) {
      setOrganization(result);
    }
  };

  const handleApply = () => {
    if (organization) {
      onApply({
        technical: organization.technical,
        tools: organization.tools,
        soft: organization.soft,
        languages: organization.languages,
      });
      toast({
        title: 'Skills Organized',
        description: 'Your skills have been categorized and cleaned up',
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI Skills Organizer</DialogTitle>
        </DialogHeader>

        {!organization ? (
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Let AI categorize your skills, identify duplicates, and suggest removing outdated technologies.
            </p>
            <div className="flex flex-wrap gap-2">
              {currentSkills.map((skill, idx) => (
                <Badge key={idx} variant="secondary">{skill}</Badge>
              ))}
            </div>
            <Button onClick={handleOrganize} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Organizing...
                </>
              ) : (
                'Organize with AI'
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <Tabs defaultValue="organized" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="organized">Organized</TabsTrigger>
                <TabsTrigger value="duplicates">Duplicates</TabsTrigger>
                <TabsTrigger value="outdated">Outdated</TabsTrigger>
              </TabsList>

              <TabsContent value="organized" className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Technical Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {organization.technical.map((skill: string, idx: number) => (
                        <Badge key={idx} variant="default">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Tools & Platforms</h4>
                    <div className="flex flex-wrap gap-2">
                      {organization.tools.map((skill: string, idx: number) => (
                        <Badge key={idx} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Soft Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {organization.soft.map((skill: string, idx: number) => (
                        <Badge key={idx} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-2">Languages</h4>
                    <div className="flex flex-wrap gap-2">
                      {organization.languages.map((skill: string, idx: number) => (
                        <Badge key={idx}>{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="duplicates">
                {organization.duplicates.length > 0 ? (
                  <div className="space-y-2">
                    {organization.duplicates.map((dup: string, idx: number) => (
                      <Alert key={idx}>
                        <X className="h-4 w-4" />
                        <AlertDescription>
                          Duplicate detected: <strong>{dup}</strong>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                ) : (
                  <Alert>
                    <Check className="h-4 w-4" />
                    <AlertDescription>No duplicates found!</AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              <TabsContent value="outdated">
                {organization.outdated.length > 0 ? (
                  <div className="space-y-2">
                    {organization.outdated.map((item: any, idx: number) => (
                      <Alert key={idx}>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>{item.skill}</strong>: {item.suggestion}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                ) : (
                  <Alert>
                    <Check className="h-4 w-4" />
                    <AlertDescription>All skills are current!</AlertDescription>
                  </Alert>
                )}
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setOrganization(null)} className="flex-1">
                Re-organize
              </Button>
              <Button onClick={handleApply} className="flex-1">
                Apply Organization
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
