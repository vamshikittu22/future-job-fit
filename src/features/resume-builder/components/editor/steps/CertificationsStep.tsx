import React, { useState } from 'react';
import { useResume } from '@/shared/contexts/ResumeContext';
import { WizardStepContainer } from '@/features/resume-builder/components/layout/WizardStepContainer';
import { ProgressStepper } from '@/features/resume-builder/components/layout/ProgressStepper';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/shared/ui/card';
import { Award, Plus, Trash2, Edit, X, Save, Sparkles, ExternalLink } from 'lucide-react';
import { AnimatedAccordion } from '@/features/resume-builder/components/editor/AnimatedAccordion';
import AIEnhanceModal from '@/features/resume-builder/components/modals/AIEnhanceModal';
import { useUndo } from '@/shared/hooks/useUndo';
import { AIEnhanceButton } from '@/shared/ui/ai-enhance-button';

export const CertificationsStep: React.FC = () => {
    const { resumeData, updateResumeData, setResumeData } = useResume();

    // Undo functionality
    const { registerDeletion } = useUndo({
        onUndo: (action) => {
            if (action.category === 'certification') {
                const certifications = [...(resumeData.certifications || [])];
                certifications.splice(action.index, 0, action.data);
                updateResumeData('certifications', certifications);
            }
        },
    });
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isAIEnhanceModalOpen, setIsAIEnhanceModalOpen] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        issuer: '',
        date: '',
        credentialUrl: '',
        description: ''
    });

    const resetForm = () => {
        setFormData({
            id: '',
            name: '',
            issuer: '',
            date: '',
            credentialUrl: '',
            description: ''
        });
        setEditingIndex(null);
        setIsAdding(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const certificationData = {
            ...formData,
            id: formData.id || Date.now().toString()
        };

        const certifications = [...(resumeData.certifications || [])];
        if (editingIndex !== null) {
            certifications[editingIndex] = certificationData;
        } else {
            certifications.push(certificationData);
        }

        updateResumeData('certifications', certifications);
        resetForm();
    };

    const handleEdit = (cert: any, index: number) => {
        setFormData({
            id: cert.id,
            name: cert.name || '',
            issuer: cert.issuer || '',
            date: cert.date || '',
            credentialUrl: cert.credentialUrl || '',
            description: cert.description || ''
        });
        setEditingIndex(index);
        setIsAdding(true);
    };

    const handleRemove = (index: number) => {
        const certToDelete = resumeData.certifications?.[index];
        registerDeletion(
            'certification',
            index,
            certToDelete,
            () => {
                const certifications = (resumeData.certifications || []).filter((_, i) => i !== index);
                updateResumeData('certifications', certifications);
            }
        );
    };

    return (
        <WizardStepContainer
            title="Certifications"
            description="List your professional certifications and licenses"
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
                            <Plus className="mr-2 h-4 w-4" /> Add Certification
                        </Button>
                    </div>
                ) : (
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>{editingIndex !== null ? 'Edit Certification' : 'Add New Certification'}</CardTitle>
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
                                        <label className="text-sm font-medium">Certification Name *</label>
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g., AWS Certified Solutions Architect"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Issuer *</label>
                                        <Input
                                            value={formData.issuer}
                                            onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                                            placeholder="e.g., Amazon Web Services"
                                            required
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
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Credential URL</label>
                                        <Input
                                            type="url"
                                            value={formData.credentialUrl}
                                            onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                                            placeholder="https://example.com/verify/..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium">Description</label>
                                        <AIEnhanceButton
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setIsAIEnhanceModalOpen(true)}
                                            className="h-8 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                                        />
                                    </div>
                                    <Textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Brief description of the certification"
                                        rows={3}
                                    />
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
                                    {editingIndex !== null ? 'Update' : 'Save'} Certification
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                )}

                {/* Certifications List */}
                {resumeData.certifications && resumeData.certifications.length > 0 ? (
                    <AnimatedAccordion
                        items={resumeData.certifications.map((cert, index) => ({
                            id: cert.id || `cert-${index}`,
                            title: cert.name,
                            badge: cert.issuer || undefined,
                            icon: <Award className="h-4 w-4 text-muted-foreground" />,
                            content: (
                                <CardContent className="pt-0">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <span>{cert.date}</span>
                                            {cert.credentialUrl && (
                                                <>
                                                    <span>•</span>
                                                    <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                                                        Verify <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                </>
                                            )}
                                        </div>
                                        {cert.description && (
                                            <p className="text-sm whitespace-pre-line bg-muted/50 p-4 rounded-md">{cert.description}</p>
                                        )}
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(cert, index)}
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
                        defaultValue={resumeData.certifications[0]?.id || `cert-0`}
                    />
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>No certifications added yet. Click "Add Certification" to get started.</p>
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
                        setFormData(prev => ({ ...prev, description: enhancedData.certifications[editingIndex].description }));
                    }
                }}
                step="certifications"
                targetItemIndex={editingIndex}
                targetField="description"
            />
        </WizardStepContainer>
    );
};
