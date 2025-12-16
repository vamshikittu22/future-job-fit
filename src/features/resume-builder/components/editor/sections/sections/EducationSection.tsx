import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Card } from "@/shared/ui/card";
import { Plus, X } from "lucide-react";

interface EducationSectionProps {
    education: any[];
    updateResumeData: (section: string, data: any) => void;
}

export const EducationSection = ({ education, updateResumeData }: EducationSectionProps) => {
    const addEducation = () => {
        const newEdu = {
            id: Date.now().toString(),
            degree: "",
            school: "",
            startDate: "",
            endDate: "",
            gpa: ""
        };
        updateResumeData('education', [...(education || []), newEdu]);
    };

    const updateEducation = (id: string, field: string, value: string) => {
        const updated = (education || []).map((edu: any) =>
            edu.id === id ? { ...edu, [field]: value } : edu
        );
        updateResumeData('education', updated);
    };

    const removeEducation = (id: string) => {
        updateResumeData('education', (education || []).filter((edu: any) => edu.id !== id));
    };

    return (
        <div className="space-y-6">
            <Button
                type="button"
                variant="outline"
                onClick={addEducation}
                className="w-full"
            >
                <Plus className="w-4 h-4 mr-2" />
                Add Education
            </Button>

            {(education || []).map((edu: any, index: number) => (
                <Card key={edu.id} className="p-4">
                    <div className="space-y-4">
                        <div className="flex justify-between items-start">
                            <h4 className="font-medium">Education {index + 1}</h4>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeEducation(edu.id)}
                                className="text-destructive hover:text-destructive"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor={`edu-degree-${edu.id}`}>Degree *</Label>
                                <Input
                                    id={`edu-degree-${edu.id}`}
                                    placeholder="Bachelor of Science"
                                    value={edu.degree || ''}
                                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor={`edu-school-${edu.id}`}>School *</Label>
                                <Input
                                    id={`edu-school-${edu.id}`}
                                    placeholder="University Name"
                                    value={edu.school || ''}
                                    onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label htmlFor={`edu-start-${edu.id}`}>Start</Label>
                                    <Input
                                        id={`edu-start-${edu.id}`}
                                        placeholder="2018"
                                        value={edu.startDate || ''}
                                        onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor={`edu-end-${edu.id}`}>End</Label>
                                    <Input
                                        id={`edu-end-${edu.id}`}
                                        placeholder="2022"
                                        value={edu.endDate || ''}
                                        onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor={`edu-year-${edu.id}`}>Year</Label>
                                <Input
                                    id={`edu-year-${edu.id}`}
                                    placeholder="2020"
                                    value={edu.year || ''}
                                    onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor={`edu-gpa-${edu.id}`}>GPA (Optional)</Label>
                                <Input
                                    id={`edu-gpa-${edu.id}`}
                                    placeholder="3.8"
                                    value={edu.gpa || ''}
                                    onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};
