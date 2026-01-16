import React, { useState } from 'react';
import { useResume } from '@/shared/contexts/ResumeContext';
import { WizardStepContainer } from '@/features/resume-builder/components/layout/WizardStepContainer';
import { ProgressStepper } from '@/features/resume-builder/components/layout/ProgressStepper';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/shared/ui/card';
import { Trophy, Plus, Trash2, Edit, X, Save, Sparkles, CheckCircle2 } from 'lucide-react';
import { AnimatedAccordion } from '@/features/resume-builder/components/editor/AnimatedAccordion';
import AIEnhanceModal from '@/features/resume-builder/components/modals/AIEnhanceModal';
import { CharacterCounter } from '@/shared/ui/character-counter';
import { cn } from '@/shared/lib/utils';
import { useUndo } from '@/shared/hooks/useUndo';
import { AIEnhanceButton } from '@/shared/ui/ai-enhance-button';
import { AchievementTemplateSelector } from '@/features/resume-builder/components/editor/AchievementTemplateSelector';

export const AchievementsStep: React.FC = () => {
    const { resumeData, updateResumeData, setResumeData } = useResume();

    // Undo functionality
    const { registerDeletion } = useUndo({
        onUndo: (action) => {
            if (action.category === 'achievement') {
                const achievements = [...(resumeData.achievements || [])];
                achievements.splice(action.index, 0, action.data);
                updateResumeData('achievements', achievements);
            }
        },
    });
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isAIEnhanceModalOpen, setIsAIEnhanceModalOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        issuer: '',
        date: '',
        description: ''
    });

    const resetForm = () => {
        setFormData({
            id: '',
            title: '',
            issuer: '',
            date: '',
            description: ''
        });
        setEditingIndex(null);
        setIsAdding(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const achievementData = {
            ...formData,
            id: formData.id || Date.now().toString()
        };

        const achievements = [...(resumeData.achievements || [])];
        if (editingIndex !== null) {
            achievements[editingIndex] = achievementData;
        } else {
            achievements.push(achievementData);
        }

        updateResumeData('achievements', achievements);
        resetForm();
    };

    const handleEdit = (achievement: any, index: number) => {
        setFormData({
            id: achievement.id,
            title: achievement.title || '',
            issuer: achievement.issuer || '',
            date: achievement.date || '',
            description: achievement.description || ''
        });
        setEditingIndex(index);
        setIsAdding(true);
    };

    const handleRemove = (index: number) => {
        const achievementToDelete = resumeData.achievements[index];
        registerDeletion(
            'achievement',
            index,
            achievementToDelete,
            () => {
                const achievements = (resumeData.achievements || []).filter((_, i) => i !== index);
                updateResumeData('achievements', achievements);
            }
        );
    };

    return (
        <WizardStepContainer
            title="Achievements"
            description="Highlight your key accomplishments and awards"
        >
            <ProgressStepper />

            <div className="space-y-6">
                {!isAdding ? (
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsAIEnhanceModalOpen(true)}
                            className="gap-2"
                        >
                            <Sparkles className="h-4 w-4" />
                            Enhance with AI
                        </Button>
                        <Button onClick={() => setIsAdding(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Add Achievement
                        </Button>
                    </div>
                ) : (
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>{editingIndex !== null ? 'Edit Achievement' : 'Add New Achievement'}</CardTitle>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={resetForm}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Achievement Title *</label>
                                        <Input
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="e.g., Top Performer 2023"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Issuer</label>
                                        <Input
                                            value={formData.issuer}
                                            onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                                            placeholder="e.g., Company Name"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Date</label>
                                        <Input
                                            type="month"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium flex items-center gap-2">
                                            Description <span className="text-destructive">*</span>
                                            {formData.description.length >= 80 && formData.description.length <= 200 && (
                                                <CheckCircle2 className="h-4 w-4 text-green-500 animate-in fade-in zoom-in duration-200" />
                                            )}
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <AchievementTemplateSelector
                                                onSelect={(template, titleSuggestion) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        description: template,
                                                        title: prev.title || titleSuggestion || ''
                                                    }));
                                                }}
                                            />
                                            <AIEnhanceButton
                                                type="button"
                                                variant="ghost"
                                                onClick={() => setIsAIEnhanceModalOpen(true)}
                                                className="h-8 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                            />
                                        </div>
                                    </div>
                                    <Textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Describe the achievement and its impact"
                                        rows={4}
                                        required
                                        maxLength={300}
                                        className={cn(
                                            "transition-colors duration-200",
                                            formData.description.length >= 80 && formData.description.length <= 200 && "border-green-500 focus-visible:ring-green-500/30",
                                            formData.description.length > 0 && formData.description.length < 80 && "border-amber-500"
                                        )}
                                    />
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-muted-foreground">
                                            Describe the achievement and quantify the impact if possible.
                                        </p>
                                        <CharacterCounter
                                            current={formData.description.length}
                                            max={300}
                                            recommended={{ min: 80, max: 200 }}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    <Save className="mr-2 h-4 w-4" />
                                    {editingIndex !== null ? 'Update' : 'Save'} Achievement
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                )}

                {/* Achievements List */}
                {resumeData.achievements && resumeData.achievements.length > 0 ? (
                    <AnimatedAccordion
                        items={resumeData.achievements.map((achievement, index) => ({
                            id: achievement.id || `achievement-${index}`,
                            title: achievement.title,
                            badge: achievement.date || undefined,
                            icon: <Trophy className="h-4 w-4 text-muted-foreground" />,
                            content: (
                                <CardContent className="pt-0">
                                    <div className="space-y-4">
                                        {achievement.issuer && (
                                            <p className="text-sm text-muted-foreground">{achievement.issuer}</p>
                                        )}
                                        {achievement.description && (
                                            <p className="text-sm whitespace-pre-line bg-muted/50 p-4 rounded-md">{achievement.description}</p>
                                        )}
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(achievement, index)}
                                            >
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleRemove(index)}
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            ),
                        }))}
                        type="single"
                        defaultValue={resumeData.achievements[0]?.id || `achievement-0`}
                    />
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>No achievements added yet. Click "Add Achievement" to get started.</p>
                    </div>
                )}
            </div>

            <AIEnhanceModal
                open={isAIEnhanceModalOpen}
                onOpenChange={setIsAIEnhanceModalOpen}
                resumeData={resumeData}
                onEnhance={(enhancedData) => {
                    setResumeData(enhancedData);
                    if (editingIndex !== null) {
                        setFormData(prev => ({ ...prev, description: enhancedData.achievements[editingIndex].description }));
                    }
                }}
                step="achievements"
                targetItemIndex={editingIndex}
                targetField="description"
            />
        </WizardStepContainer>
    );
};
