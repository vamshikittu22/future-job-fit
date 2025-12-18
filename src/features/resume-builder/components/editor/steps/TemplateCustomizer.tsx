import React from 'react';
import { useResume } from '@/shared/contexts/ResumeContext';
import { useWizard } from '@/shared/contexts/WizardContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Label } from '@/shared/ui/label';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Palette, Type } from 'lucide-react';
import { ThemeSettings } from '@/shared/types/resume';

const FONT_OPTIONS = [
    { label: 'Sans Serif (Modern)', value: "'Inter', sans-serif" },
    { label: 'Serif (Classic)', value: "'Times New Roman', Times, serif" },
    { label: 'Georgia (Elegant)', value: "'Georgia', serif" },
    { label: 'Roboto (Clean)', value: "'Roboto', sans-serif" },
    { label: 'Outfit (Premium)', value: "'Outfit', sans-serif" },
];

export const TemplateCustomizer: React.FC = () => {
    const { resumeData, updateResumeData } = useResume();
    const { wizardState } = useWizard();
    const activeTemplate = wizardState.selectedTemplate;

    if (!activeTemplate) return null;

    const currentSettings = (resumeData.metadata?.themeConfig?.[activeTemplate] || {
        primaryColor:
            activeTemplate === 'modern' ? '#2563eb' :
                activeTemplate === 'creative' ? '#7c3aed' :
                    activeTemplate === 'executive' ? '#111827' :
                        activeTemplate === 'elegant' ? '#db2777' :
                            '#000000',
        fontFamily:
            activeTemplate === 'classic' || activeTemplate === 'executive' ? "'Playfair Display', serif" :
                activeTemplate === 'creative' || activeTemplate === 'elegant' ? "'EB Garamond', serif" :
                    "'Inter', sans-serif",
        titleColor:
            activeTemplate === 'modern' ? '#1e3a8a' :
                activeTemplate === 'creative' ? '#4c1d95' :
                    activeTemplate === 'executive' ? '#000000' :
                        activeTemplate === 'elegant' ? '#9d174d' :
                            '#000000',
        headingsColor:
            activeTemplate === 'modern' ? '#1e3a8a' :
                activeTemplate === 'creative' ? '#4c1d95' :
                    activeTemplate === 'executive' ? '#111827' :
                        activeTemplate === 'elegant' ? '#831843' :
                            '#000000',
        subheadingsColor:
            activeTemplate === 'modern' ? '#2563eb' :
                activeTemplate === 'creative' ? '#7c3aed' :
                    activeTemplate === 'executive' ? '#4b5563' :
                        activeTemplate === 'elegant' ? '#be185d' :
                            '#000000',
        linksColor:
            activeTemplate === 'modern' ? '#2563eb' :
                activeTemplate === 'creative' ? '#7c3aed' :
                    activeTemplate === 'elegant' ? '#db2777' :
                        '#2563eb',
    }) as ThemeSettings;

    const handleChange = (field: keyof ThemeSettings, value: string) => {
        const newConfig = {
            ...(resumeData.metadata?.themeConfig || {}),
            [activeTemplate]: {
                ...currentSettings,
                [field]: value,
            },
        };

        updateResumeData('metadata', {
            ...(resumeData.metadata || {}),
            themeConfig: newConfig,
        });
    };

    const ColorInput = ({ label, field, value }: { label: string, field: keyof ThemeSettings, value: string }) => (
        <div className="space-y-1">
            <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</Label>
            <div className="flex gap-2 items-center">
                <div className="relative h-7 w-7 shrink-0 rounded overflow-hidden border shadow-sm">
                    <input
                        type="color"
                        value={value}
                        onChange={(e) => handleChange(field, e.target.value)}
                        className="absolute inset-0 h-full w-full p-0 border-0 cursor-pointer scale-150"
                    />
                </div>
                <Input
                    type="text"
                    value={value}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="h-7 py-0.5 px-2 font-mono text-[9px]"
                    placeholder="#000000"
                />
            </div>
        </div>
    );

    return (
        <Card className="border-accent/20 bg-card shadow-lg overflow-hidden">
            <CardHeader className="bg-muted/30 py-2.5 px-4 border-b">
                <CardTitle className="text-[11px] font-bold flex items-center gap-2 uppercase tracking-widest text-foreground/80">
                    <Palette className="h-3.5 w-3.5 text-primary" />
                    Custom styling
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-5">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Type className="h-4 w-4 text-primary" />
                        <h4 className="text-xs font-bold uppercase tracking-tight">Typography</h4>
                    </div>
                    <div className="space-y-1.5">
                        <Select
                            value={currentSettings.fontFamily}
                            onValueChange={(val) => handleChange('fontFamily', val)}
                        >
                            <SelectTrigger className="w-full h-8 bg-white border-muted">
                                <SelectValue placeholder="Typeface" />
                            </SelectTrigger>
                            <SelectContent>
                                {FONT_OPTIONS.map((font) => (
                                    <SelectItem key={font.value} value={font.value}>
                                        <span style={{ fontFamily: font.value }} className="text-xs">{font.label}</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4 text-primary" />
                        <h4 className="text-xs font-bold uppercase tracking-tight">Colors</h4>
                    </div>
                    <div className="space-y-3">
                        <ColorInput label="Primary Accent" field="primaryColor" value={currentSettings.primaryColor} />
                        <div className="grid grid-cols-1 gap-2 border-t pt-3">
                            <ColorInput label="Name & Title" field="titleColor" value={currentSettings.titleColor || currentSettings.primaryColor} />
                            <ColorInput label="Headings" field="headingsColor" value={currentSettings.headingsColor || currentSettings.primaryColor} />
                            <ColorInput label="Sub-headings" field="subheadingsColor" value={currentSettings.subheadingsColor || currentSettings.primaryColor} />
                            <ColorInput label="Links & Accents" field="linksColor" value={currentSettings.linksColor || currentSettings.primaryColor} />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
