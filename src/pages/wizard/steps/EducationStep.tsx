import React from 'react';
import { WizardStepContainer } from '@/components/wizard/WizardStepContainer';
import { ProgressStepper } from '@/components/wizard/ProgressStepper';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';

export const EducationStep: React.FC = () => {
  return (
    <WizardStepContainer
      title="Education"
      description="Add your educational background"
    >
      <ProgressStepper />
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Education step - Coming soon</p>
        </CardContent>
      </Card>
    </WizardStepContainer>
  );
};
