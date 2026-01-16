import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useResume } from '@/shared/contexts/ResumeContext';
import { WizardStepContainer } from '@/features/resume-builder/components/layout/WizardStepContainer';
import { ProgressStepper } from '@/features/resume-builder/components/layout/ProgressStepper';
import { personalInfoSchema } from '@/shared/config/wizardSteps';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Card, CardContent } from '@/shared/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

export const PersonalInfoStep: React.FC = () => {
  const { resumeData, updateResumeData } = useResume();

  const form = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: resumeData.personal?.name || '',
      email: resumeData.personal?.email || '',
      phone: resumeData.personal?.phone || '',
      location: resumeData.personal?.location || '',
      website: resumeData.personal?.website || '',
      linkedin: resumeData.personal?.linkedin || '',
      github: resumeData.personal?.github || '',
      title: resumeData.personal?.title || '',
    },
  });

  // Auto-save on form changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      updateResumeData('personal', value);
    });
    return () => subscription.unsubscribe();
  }, [form, updateResumeData]);

  // Auto-format phone number
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  // Auto-add https:// to URLs
  const formatUrl = (value: string) => {
    if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
      return `https://${value}`;
    }
    return value;
  };

  return (
    <WizardStepContainer
      title="Personal Information"
      description="Provide your contact information and professional details"
    >
      <ProgressStepper />

      <div className="space-y-8">
        <Card className="border-border shadow-sm">
          <CardContent className="pt-6">
            <Form {...form}>
              <form className="space-y-8">
                {/* Basic Info Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field, fieldState }) => {
                        const isValid = !fieldState.error && field.value && field.value.length >= 2;
                        return (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              Full Name <span className="text-destructive">*</span>
                              {isValid && (
                                <CheckCircle2 className="h-4 w-4 text-green-500 animate-in fade-in zoom-in duration-200" />
                              )}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John Doe"
                                {...field}
                                className={cn(
                                  "h-11 transition-colors duration-200",
                                  fieldState.error && "border-destructive focus-visible:ring-destructive/30",
                                  isValid && "border-green-500 focus-visible:ring-green-500/30"
                                )}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />

                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Professional Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Senior Software Engineer" {...field} className="h-11" />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Your current or desired job title
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Contact Info Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide border-t pt-6">
                    Contact Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field, fieldState }) => {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        const isValid = !fieldState.error && field.value && emailRegex.test(field.value);
                        return (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              Email <span className="text-destructive">*</span>
                              {isValid && (
                                <CheckCircle2 className="h-4 w-4 text-green-500 animate-in fade-in zoom-in duration-200" />
                              )}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="john.doe@example.com"
                                {...field}
                                className={cn(
                                  "h-11 transition-colors duration-200",
                                  fieldState.error && "border-destructive focus-visible:ring-destructive/30",
                                  isValid && "border-green-500 focus-visible:ring-green-500/30"
                                )}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field, fieldState }) => {
                        const isValid = !fieldState.error && field.value && field.value.replace(/\D/g, '').length >= 10;
                        return (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              Phone <span className="text-destructive">*</span>
                              {isValid && (
                                <CheckCircle2 className="h-4 w-4 text-green-500 animate-in fade-in zoom-in duration-200" />
                              )}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="(555) 123-4567"
                                {...field}
                                className={cn(
                                  "h-11 transition-colors duration-200",
                                  fieldState.error && "border-destructive focus-visible:ring-destructive/30",
                                  isValid && "border-green-500 focus-visible:ring-green-500/30"
                                )}
                                onChange={(e) => {
                                  const formatted = formatPhoneNumber(e.target.value);
                                  field.onChange(formatted);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="San Francisco, CA" {...field} className="h-11" />
                        </FormControl>
                        <FormDescription className="text-xs">
                          City, State or City, Country
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Online Presence Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide border-t pt-6">
                    Online Presence
                  </h3>
                  <p className="text-sm text-muted-foreground -mt-2">
                    Add links to your professional profiles and portfolio
                  </p>

                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Portfolio / Website</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://johndoe.com"
                              {...field}
                              className="h-11"
                              onBlur={(e) => {
                                const formatted = formatUrl(e.target.value);
                                field.onChange(formatted);
                                field.onBlur();
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="linkedin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn Profile</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://linkedin.com/in/johndoe"
                              {...field}
                              className="h-11"
                              onBlur={(e) => {
                                const formatted = formatUrl(e.target.value);
                                field.onChange(formatted);
                                field.onBlur();
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="github"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GitHub Profile</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://github.com/johndoe"
                              {...field}
                              className="h-11"
                              onBlur={(e) => {
                                const formatted = formatUrl(e.target.value);
                                field.onChange(formatted);
                                field.onBlur();
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </WizardStepContainer>
  );
};
