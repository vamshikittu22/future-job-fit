import React from 'react';
import { WizardStepContainer } from '@/components/wizard/WizardStepContainer';
import { ProgressStepper } from '@/components/wizard/ProgressStepper';
import { Card, CardContent } from '@/components/ui/card';
import { Folder } from 'lucide-react';

export const ProjectsStep: React.FC = () => {
  return (
    <WizardStepContainer
      title="Projects"
      description="Showcase your notable projects"
    >
      <ProgressStepper />
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Folder className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Projects step - Coming soon</p>
        </CardContent>
      </Card>
    </WizardStepContainer>
  );
};
