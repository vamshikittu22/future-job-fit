import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Briefcase, Zap, Expand, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface QuickAddExperienceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAdd: (data: any) => void;
    onExpand: (data: any) => void;
}

export const QuickAddExperienceModal: React.FC<QuickAddExperienceModalProps> = ({
    open,
    onOpenChange,
    onAdd,
    onExpand,
}) => {
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        startDate: '',
        current: false,
    });

    // Reset form when opening
    useEffect(() => {
        if (open) {
            setFormData({
                title: '',
                company: '',
                startDate: '',
                current: true, // Default to current for quick add
            });
        }
    }, [open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.company) return;

        onAdd({
            id: uuidv4(),
            ...formData,
            endDate: formData.current ? '' : '',
            description: '',
            location: '',
        });
        onOpenChange(false);
    };

    const handleExpand = () => {
        onExpand({
            ...formData,
            description: '',
            location: '',
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="bg-primary/10 p-2 rounded-full">
                            <Zap className="w-5 h-5 text-primary" />
                        </div>
                        <DialogTitle>Quick Add Experience</DialogTitle>
                    </div>
                    <DialogDescription>
                        Lightning fast entry. You can add more details later.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="quick-title">Job Title</Label>
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="quick-title"
                                placeholder="Software Engineer"
                                className="pl-9"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                autoFocus
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="quick-company">Company</Label>
                        <Input
                            id="quick-company"
                            placeholder="Google / DeepMind"
                            value={formData.company}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="quick-start">Start Date (Optional)</Label>
                        <Input
                            id="quick-start"
                            type="month"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        />
                    </div>

                    <div className="bg-muted/50 p-3 rounded-md border border-dashed flex items-center justify-between text-xs text-muted-foreground">
                        <span>Press <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">Enter</kbd> to save immediately</span>
                    </div>

                    <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            className="flex-1 gap-2"
                            onClick={handleExpand}
                        >
                            <Expand className="w-4 h-4" />
                            Expand to Full Form
                        </Button>
                        <Button type="submit" className="flex-1 gap-2">
                            <Plus className="w-4 h-4" />
                            Add Experience
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
