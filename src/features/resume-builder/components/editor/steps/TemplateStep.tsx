import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWizard } from '@/shared/contexts/WizardContext';
import { WizardStepContainer } from '@/features/resume-builder/components/layout/WizardStepContainer';
import { TEMPLATE_OPTIONS } from '@/shared/config/wizardSteps';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export const TemplateStep: React.FC = () => {
  const { wizardState, setSelectedTemplate } = useWizard();
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  return (
    <WizardStepContainer
      title="Choose Your Template"
      description="Select a template that best fits your industry and personal style"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TEMPLATE_OPTIONS.map((template, index) => {
          const isSelected = wizardState.selectedTemplate === template.id;
          const isHovered = hoveredTemplate === template.id;

          return (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={cn(
                  'cursor-pointer transition-all duration-300 hover:shadow-accent',
                  isSelected && 'ring-4 ring-accent shadow-accent scale-105'
                )}
                onClick={() => handleTemplateSelect(template.id)}
                onMouseEnter={() => setHoveredTemplate(template.id)}
                onMouseLeave={() => setHoveredTemplate(null)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {template.name}
                        {isSelected && (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {template.description}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={template.atsScore >= 90 ? 'default' : 'secondary'}
                      className="ml-2"
                    >
                      ATS {template.atsScore}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Template Preview Placeholder */}
                  <div
                    className={cn(
                      'aspect-[210/297] bg-muted rounded overflow-hidden mb-4 transition-all',
                      isHovered && 'scale-105'
                    )}
                  >
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                      <div className="text-center p-8">
                        <div className="text-6xl font-bold mb-2">{template.name[0]}</div>
                        <div className="text-sm">Preview</div>
                      </div>
                    </div>
                  </div>

                  {/* Best For */}
                  <div className="mb-3">
                    <p className="text-sm font-medium mb-2">Best for:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.bestFor.map((industry) => (
                        <Badge key={industry} variant="outline" className="text-xs">
                          {industry}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <p className="text-sm font-medium mb-2">Features:</p>
                    <ul className="space-y-1">
                      {template.features.map((feature) => (
                        <li key={feature} className="text-sm text-muted-foreground flex items-start">
                          <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Selection Info */}
      {wizardState.selectedTemplate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-4 bg-accent/10 border border-accent rounded-lg"
        >
          <p className="text-sm text-center">
            <strong>
              {TEMPLATE_OPTIONS.find((t) => t.id === wizardState.selectedTemplate)?.name}
            </strong>{' '}
            template selected. Click "Next" to continue.
          </p>
        </motion.div>
      )}
    </WizardStepContainer>
  );
};
