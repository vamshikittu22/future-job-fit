import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { Plus, X } from "lucide-react";

export const CustomSectionEditor = ({ section, onUpdate }: { section: any; onUpdate: (section: any) => void }) => {
    const updateItem = (itemId: string, field: string, value: string) => {
        onUpdate({
            ...section,
            items: section.items.map((item: any) =>
                item.id === itemId ? { ...item, [field]: value } : item
            )
        });
    };

    const addItem = () => {
        onUpdate({
            ...section,
            items: [
                ...section.items,
                { id: Date.now().toString(), title: '', description: '' }
            ]
        });
    };

    const removeItem = (itemId: string) => {
        if (section.items.length > 1) {
            onUpdate({
                ...section,
                items: section.items.filter((item: any) => item.id !== itemId)
            });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{section.title}</h3>
            </div>

            {section.description && (
                <p className="text-sm text-muted-foreground">{section.description}</p>
            )}

            <div className="space-y-4">
                {section.items.map((item: any) => (
                    <div key={item.id} className="space-y-2 border rounded-lg p-4 relative">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label>Title</Label>
                                <Input
                                    value={item.title}
                                    onChange={(e) => updateItem(item.id, 'title', e.target.value)}
                                    placeholder="Item title"
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Description</Label>
                                <Textarea
                                    value={item.description || ''}
                                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                    placeholder="Item description"
                                    rows={2}
                                />
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 h-6 w-6 p-0"
                            onClick={() => removeItem(item.id)}
                            disabled={section.items.length <= 1}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ))}

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={addItem}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                </Button>
            </div>
        </div>
    );
};
