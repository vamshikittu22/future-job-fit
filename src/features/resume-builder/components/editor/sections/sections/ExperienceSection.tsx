import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Card } from "@/shared/ui/card";
import { Plus, X } from "lucide-react";

interface ExperienceSectionProps {
    experience: any[];
    updateResumeData: (section: string, data: any) => void;
}

export const ExperienceSection = ({ experience, updateResumeData }: ExperienceSectionProps) => {
    const addExperience = () => {
        const newExp = {
            id: Date.now().toString(),
            title: "",
            company: "",
            location: "",
            startDate: "",
            endDate: "",
            bullets: [""]
        };
        updateResumeData('experience', [...(experience || []), newExp]);
    };

    const updateExperience = (id: string, field: string, value: any) => {
        const updated = (experience || []).map((exp: any) =>
            exp.id === id ? { ...exp, [field]: value } : exp
        );
        updateResumeData('experience', updated);
    };

    const removeExperience = (id: string) => {
        updateResumeData('experience', (experience || []).filter((exp: any) => exp.id !== id));
    };

    return (
        <div className="space-y-6">
            <Button
                type="button"
                variant="outline"
                onClick={addExperience}
                className="w-full"
            >
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
            </Button>

            {(experience || []).map((exp: any, index: number) => (
                <Card key={exp.id} className="p-4">
                    <div className="space-y-4">
                        <div className="flex justify-between items-start">
                            <h4 className="font-medium">Experience {index + 1}</h4>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeExperience(exp.id)}
                                className="text-destructive hover:text-destructive"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor={`exp-title-${exp.id}`}>Job Title *</Label>
                                <Input
                                    id={`exp-title-${exp.id}`}
                                    placeholder="Software Engineer"
                                    value={exp.title || ''}
                                    onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor={`exp-company-${exp.id}`}>Company *</Label>
                                <Input
                                    id={`exp-company-${exp.id}`}
                                    placeholder="Tech Corp"
                                    value={exp.company || ''}
                                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor={`exp-location-${exp.id}`}>Location</Label>
                                <Input
                                    id={`exp-location-${exp.id}`}
                                    placeholder="San Francisco, CA"
                                    value={exp.location || ''}
                                    onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label htmlFor={`exp-start-${exp.id}`}>Start</Label>
                                    <Input
                                        id={`exp-start-${exp.id}`}
                                        placeholder="Jan 2020"
                                        value={exp.startDate || ''}
                                        onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`exp-end-${exp.id}`}>End</Label>
                                    <Input
                                        id={`exp-end-${exp.id}`}
                                        placeholder="Present"
                                        value={exp.endDate || ''}
                                        onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <Label>Key Achievements</Label>
                            <div className="space-y-2 mt-2">
                                {(exp.bullets || []).map((bullet: string, bulletIndex: number) => (
                                    <div key={bulletIndex} className="flex gap-2">
                                        <Input
                                            placeholder="Describe your achievement..."
                                            value={bullet}
                                            onChange={(e) => updateExperience(exp.id, 'bullets', [...exp.bullets.slice(0, bulletIndex), e.target.value, ...exp.bullets.slice(bulletIndex + 1)])}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => updateExperience(exp.id, 'bullets', exp.bullets.filter((_: any, i: number) => i !== bulletIndex))}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateExperience(exp.id, 'bullets', [...(exp.bullets || []), ""])}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Achievement
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};
