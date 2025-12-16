import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Plus, X } from "lucide-react";

interface AchievementSectionProps {
    achievements: any[];
    updateResumeData: (section: string, data: any) => void;
}

export const AchievementSection = ({ achievements, updateResumeData }: AchievementSectionProps) => {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                {(achievements || []).map((achievement: any, index: number) => (
                    <div key={achievement.id || index} className="grid grid-cols-3 gap-2 items-center">
                        <Input
                            placeholder="Achievement title..."
                            value={typeof achievement === 'string' ? achievement : (achievement.title || '')}
                            onChange={(e) => {
                                const list = (achievements || []).map((a: any, i: number) => {
                                    if (i !== index) return a;
                                    if (typeof a === 'string') return { id: `ach-${Date.now()}`, title: e.target.value, date: '' };
                                    return { ...a, title: e.target.value };
                                });
                                updateResumeData('achievements', list);
                            }}
                        />
                        <Input
                            placeholder="Date (e.g., 2024)"
                            value={typeof achievement === 'string' ? '' : (achievement.date || '')}
                            onChange={(e) => {
                                const list = (achievements || []).map((a: any, i: number) => i === index ? (typeof a === 'string' ? { id: `ach-${Date.now()}`, title: a, date: e.target.value } : { ...a, date: e.target.value }) : a);
                                updateResumeData('achievements', list);
                            }}
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => updateResumeData('achievements', (achievements || []).filter((_: any, i: number) => i !== index))}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => updateResumeData('achievements', [...(achievements || []), { id: `ach-${Date.now()}`, title: '', date: '' }])}
                    className="w-full"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Achievement
                </Button>
            </div>
        </div>
    );
};
