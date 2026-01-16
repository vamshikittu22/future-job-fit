import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { ScrollArea } from '@/shared/ui/scroll-area';
import {
    Linkedin,
    Copy,
    Check,
    User,
    Briefcase,
    Zap,
    Sparkles,
    Info
} from 'lucide-react';
import { useResume } from '@/shared/contexts/ResumeContext';
import { Badge } from '@/shared/ui/badge';
import { toast } from '@/shared/hooks/use-toast';

interface LinkedInExportModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const LinkedInExportModal: React.FC<LinkedInExportModalProps> = ({
    open,
    onOpenChange,
}) => {
    const { resumeData } = useResume();
    const [copiedSection, setCopiedSection] = useState<string | null>(null);

    const copyToClipboard = (text: string, sectionId: string) => {
        navigator.clipboard.writeText(text);
        setCopiedSection(sectionId);
        toast({
            title: "Copied to clipboard",
            description: "You can now paste this directly into LinkedIn.",
        });
        setTimeout(() => setCopiedSection(null), 2000);
    };

    const generateHeadline = () => {
        const title = resumeData.personal.title || (resumeData.experience[0]?.title) || "";
        const skills = typeof resumeData.skills === 'object' && !Array.isArray(resumeData.skills)
            ? [...(resumeData.skills.languages || []), ...(resumeData.skills.frameworks || [])].slice(0, 3).join(' | ')
            : "";

        return `${title} ${skills ? '• ' + skills : ''} • Helping businesses scale with innovative solutions`;
    };

    const generateAbout = () => {
        return resumeData.summary || "Professional passionate about delivering high-quality results and driving impact through expertise in my field.";
    };

    const getSkillsList = () => {
        if (Array.isArray(resumeData.skills)) return "";
        return [
            ...(resumeData.skills.languages || []),
            ...(resumeData.skills.frameworks || []),
            ...(resumeData.skills.tools || [])
        ].join(', ');
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-[#0077b5] p-2 rounded-md">
                            <Linkedin className="w-5 h-5 text-white" />
                        </div>
                        <DialogTitle className="text-2xl font-bold text-[#0077b5]">LinkedIn Profile Optimizer</DialogTitle>
                    </div>
                    <DialogDescription>
                        Optimized content from your resume, formatted for LinkedIn's specific sections.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 pt-2 flex-1 min-h-0">
                    <Tabs defaultValue="highlights" className="h-full flex flex-col">
                        <TabsList className="mb-4 bg-muted/50 p-1">
                            <TabsTrigger value="highlights" className="gap-2">
                                <Sparkles className="w-4 h-4" />
                                Key Highlights
                            </TabsTrigger>
                            <TabsTrigger value="experience" className="gap-2">
                                <Briefcase className="w-4 h-4" />
                                Experience
                            </TabsTrigger>
                            <TabsTrigger value="skills" className="gap-2">
                                <Zap className="w-4 h-4" />
                                Skills Sheet
                            </TabsTrigger>
                        </TabsList>

                        <ScrollArea className="flex-1 pr-4">
                            <TabsContent value="highlights" className="space-y-6 mt-0">
                                {/* Headline Section */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold flex items-center gap-2">
                                            <User className="w-4 h-4 text-[#0077b5]" />
                                            Profile Headline
                                        </h4>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 gap-2"
                                            onClick={() => copyToClipboard(generateHeadline(), 'headline')}
                                        >
                                            {copiedSection === 'headline' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                            {copiedSection === 'headline' ? 'Copied' : 'Copy'}
                                        </Button>
                                    </div>
                                    <div className="bg-muted/30 p-4 rounded-md border border-dashed border-border text-sm leading-relaxed italic">
                                        "{generateHeadline()}"
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">
                                        Tip: LinkedIn Headlines have a 220 character limit. Focus on keywords.
                                    </p>
                                </div>

                                {/* About Section */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold flex items-center gap-2 text-sm uppercase tracking-wider text-muted-foreground">
                                            About / Summary
                                        </h4>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 gap-2"
                                            onClick={() => copyToClipboard(generateAbout(), 'about')}
                                        >
                                            {copiedSection === 'about' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                            {copiedSection === 'about' ? 'Copied' : 'Copy'}
                                        </Button>
                                    </div>
                                    <div className="bg-[#f3f6f8] p-4 rounded-md border text-sm whitespace-pre-wrap leading-relaxed min-h-[100px]">
                                        {generateAbout()}
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="experience" className="space-y-6 mt-0">
                                <div className="bg-amber-50 border border-amber-100 p-3 rounded-md flex items-start gap-3 mb-4">
                                    <Info className="w-4 h-4 text-amber-600 mt-0.5" />
                                    <p className="text-xs text-amber-800">
                                        LinkedIn displays your role descriptions as bullet points. We've optimized your resume bullets for maximum readability.
                                    </p>
                                </div>

                                {resumeData.experience.slice(0, 5).map((exp, idx) => (
                                    <div key={exp.id || idx} className="space-y-3 border-b pb-6 last:border-0">
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-[#0077b5]">{exp.title}</span>
                                                <span className="text-sm font-medium">{exp.company}</span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 gap-2"
                                                onClick={() => copyToClipboard(exp.description, `exp-${idx}`)}
                                            >
                                                {copiedSection === `exp-${idx}` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                                Copy Description
                                            </Button>
                                        </div>
                                        <div className="bg-muted/20 p-3 rounded-md text-xs whitespace-pre-wrap font-mono">
                                            {exp.description}
                                        </div>
                                    </div>
                                ))}
                            </TabsContent>

                            <TabsContent value="skills" className="space-y-6 mt-0">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold">Your Skills Keywords</h3>
                                        <Button
                                            variant="default"
                                            size="sm"
                                            className="bg-[#0077b5] hover:bg-[#006097] gap-2"
                                            onClick={() => copyToClipboard(getSkillsList(), 'all-skills')}
                                        >
                                            {copiedSection === 'all-skills' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                            Copy Comma-Separated List
                                        </Button>
                                    </div>

                                    <div className="p-4 bg-muted/30 border rounded-lg">
                                        <div className="flex flex-wrap gap-2">
                                            {getSkillsList().split(',').map((skill, i) => (
                                                <Badge key={i} variant="outline" className="bg-white">
                                                    {skill.trim()}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2 mt-8">
                                        <h4 className="font-semibold text-sm">How to use this?</h4>
                                        <ol className="text-xs text-muted-foreground space-y-2 list-decimal pl-4">
                                            <li>Go to your LinkedIn Profile</li>
                                            <li>Scroll to the "Skills" section</li>
                                            <li>Click official "Add skill" button</li>
                                            <li>Paste the keywords into the search box one by one or as a list to find matches</li>
                                        </ol>
                                    </div>
                                </div>
                            </TabsContent>
                        </ScrollArea>
                    </Tabs>
                </div>

                <div className="p-4 bg-muted/40 border-t flex justify-end">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Close Optimizer</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
