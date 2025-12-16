import { useState, useEffect, useRef } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Badge } from "@/shared/ui/badge";
import { Pencil, Trash2, X } from "lucide-react";
import { SkillCategoryType } from "@/shared/types/resume";

interface SkillCategoryProps {
    category: SkillCategoryType;
    onUpdate: (id: string, updates: { name?: string; items?: string[] }) => void;
    onRemove: (id: string) => void;
    onAddSkill: (categoryId: string, skill: string) => void;
    onRemoveSkill: (categoryId: string, skillIndex: number) => void;
}

export const SkillCategory = ({
    category,
    onUpdate,
    onRemove,
    onAddSkill,
    onRemoveSkill
}: SkillCategoryProps) => {
    const [newSkill, setNewSkill] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);
    const [categoryName, setCategoryName] = useState(category.name);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditingName && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditingName]);

    const handleAdd = () => {
        if (newSkill.trim()) {
            onAddSkill(category.id, newSkill);
            setNewSkill('');
        }
    };

    const handleUpdateName = () => {
        if (categoryName.trim()) {
            onUpdate(category.id, { name: categoryName });
        } else {
            setCategoryName(category.name);
        }
        setIsEditingName(false);
    };

    return (
        <div className="mb-6 p-4 border rounded-lg bg-card">
            <div className="flex items-center justify-between mb-3">
                {isEditingName ? (
                    <div className="flex items-center gap-2">
                        <Input
                            ref={inputRef}
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            onBlur={handleUpdateName}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleUpdateName();
                                if (e.key === 'Escape') {
                                    setCategoryName(category.name);
                                    setIsEditingName(false);
                                }
                            }}
                            className="h-8 w-48"
                        />
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <h3 className="font-medium text-foreground">{category.name}</h3>
                        <button
                            onClick={() => {
                                setCategoryName(category.name);
                                setIsEditingName(true);
                            }}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            type="button"
                            aria-label="Edit category name"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => onRemove(category.id)}
                    aria-label={`Remove ${category.name} category`}
                >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Remove
                </Button>
            </div>

            <div className="flex flex-wrap gap-2 mb-3 min-h-8">
                {category.items.length > 0 ? (
                    category.items.map((skill, index) => (
                        <Badge
                            key={`${category.id}-${index}`}
                            variant="secondary"
                            className="flex items-center gap-1.5 px-2.5 py-1 text-foreground/90 bg-muted hover:bg-muted/80"
                        >
                            {skill}
                            <button
                                onClick={() => onRemoveSkill(category.id, index)}
                                className="text-muted-foreground hover:text-destructive transition-colors rounded-full p-0.5 -mr-1.5"
                                type="button"
                                aria-label={`Remove ${skill} from ${category.name}`}
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </Badge>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground italic">
                        No skills added yet. Start typing below to add skills.
                    </p>
                )}
            </div>

            <div className="flex gap-2 mt-3">
                <Input
                    placeholder={`Add ${category.name} skill...`}
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAdd();
                        } else if (e.key === 'Escape') {
                            setNewSkill('');
                            (e.target as HTMLInputElement).blur();
                        }
                    }}
                    className="flex-1"
                    aria-label={`Add skill to ${category.name}`}
                />
                <Button
                    type="button"
                    onClick={handleAdd}
                    disabled={!newSkill.trim()}
                    variant="outline"
                    className="shrink-0"
                >
                    Add
                </Button>
            </div>
        </div>
    );
};
