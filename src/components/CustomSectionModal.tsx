import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  List, 
  Calendar, 
  MapPin, 
  Tag, 
  Plus,
  Trash2 
} from "lucide-react";

interface CustomSectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (section: any) => void;
}

const sectionTypes = [
  {
    id: 'textarea',
    name: 'Text Area',
    description: 'Free-form text content',
    icon: FileText,
    fields: ['content']
  },
  {
    id: 'bullets',
    name: 'Bullet List',
    description: 'List of bullet points',
    icon: List,
    fields: ['items']
  },
  {
    id: 'structured',
    name: 'Structured',
    description: 'Custom fields with dates, places, etc.',
    icon: Calendar,
    fields: ['title', 'subtitle', 'date', 'location', 'description']
  }
];

const fieldTypes = [
  { id: 'text', name: 'Text', icon: FileText },
  { id: 'textarea', name: 'Text Area', icon: FileText },
  { id: 'date', name: 'Date', icon: Calendar },
  { id: 'location', name: 'Location', icon: MapPin },
  { id: 'tags', name: 'Tags', icon: Tag },
];

export default function CustomSectionModal({ 
  open, 
  onOpenChange, 
  onAdd 
}: CustomSectionModalProps) {
  const [sectionTitle, setSectionTitle] = useState('');
  const [selectedType, setSelectedType] = useState('textarea');
  const [customFields, setCustomFields] = useState<Array<{
    id: string;
    name: string;
    type: string;
    required: boolean;
  }>>([]);
  const [textContent, setTextContent] = useState('');
  const [bulletItems, setBulletItems] = useState(['']);

  const resetForm = () => {
    setSectionTitle('');
    setSelectedType('textarea');
    setCustomFields([]);
    setTextContent('');
    setBulletItems(['']);
  };

  const addCustomField = () => {
    setCustomFields(prev => [...prev, {
      id: Date.now().toString(),
      name: '',
      type: 'text',
      required: false
    }]);
  };

  const updateCustomField = (id: string, field: string, value: any) => {
    setCustomFields(prev => prev.map(f => 
      f.id === id ? { ...f, [field]: value } : f
    ));
  };

  const removeCustomField = (id: string) => {
    setCustomFields(prev => prev.filter(f => f.id !== id));
  };

  const addBulletItem = () => {
    setBulletItems(prev => [...prev, '']);
  };

  const updateBulletItem = (index: number, value: string) => {
    setBulletItems(prev => prev.map((item, i) => i === index ? value : item));
  };

  const removeBulletItem = (index: number) => {
    setBulletItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleAdd = () => {
    if (!sectionTitle.trim()) return;

    let content: any = {};

    switch (selectedType) {
      case 'textarea':
        content = { text: textContent };
        break;
      case 'bullets':
        content = { items: bulletItems.filter(item => item.trim()) };
        break;
      case 'structured':
        content = {
          fields: customFields,
          entries: []
        };
        break;
    }

    const newSection = {
      title: sectionTitle,
      type: selectedType,
      content
    };

    onAdd(newSection);
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Add Custom Section</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Section Title */}
          <div>
            <Label htmlFor="section-title">Section Title</Label>
            <Input
              id="section-title"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              placeholder="e.g., Volunteer Experience, Publications, Awards"
              className="mt-1"
            />
          </div>

          {/* Section Type */}
          <div>
            <Label className="text-base font-medium mb-3 block">Section Type</Label>
            <RadioGroup value={selectedType} onValueChange={setSelectedType}>
              <div className="grid gap-3">
                {sectionTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Card 
                      key={type.id}
                      className={`p-4 cursor-pointer transition-all ${
                        selectedType === type.id 
                          ? 'border-primary shadow-accent' 
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedType(type.id)}
                    >
                      <div className="flex items-start gap-3">
                        <RadioGroupItem 
                          value={type.id} 
                          id={type.id}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className="w-4 h-4" />
                            <Label htmlFor={type.id} className="font-medium cursor-pointer">
                              {type.name}
                            </Label>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </RadioGroup>
          </div>

          {/* Content Configuration */}
          {selectedType === 'textarea' && (
            <div>
              <Label htmlFor="text-content">Content Preview</Label>
              <Textarea
                id="text-content"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Enter sample content for this section..."
                className="mt-1 min-h-[100px]"
              />
            </div>
          )}

          {selectedType === 'bullets' && (
            <div>
              <Label className="text-base font-medium mb-3 block">Bullet Items</Label>
              <div className="space-y-2">
                {bulletItems.map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={item}
                      onChange={(e) => updateBulletItem(index, e.target.value)}
                      placeholder={`Bullet point ${index + 1}...`}
                    />
                    {bulletItems.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBulletItem(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addBulletItem}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </Button>
              </div>
            </div>
          )}

          {selectedType === 'structured' && (
            <div>
              <Label className="text-base font-medium mb-3 block">Custom Fields</Label>
              <div className="space-y-3">
                {customFields.map((field) => (
                  <Card key={field.id} className="p-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm">Field Name</Label>
                        <Input
                          value={field.name}
                          onChange={(e) => updateCustomField(field.id, 'name', e.target.value)}
                          placeholder="Field name..."
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm">Field Type</Label>
                        <select
                          value={field.type}
                          onChange={(e) => updateCustomField(field.id, 'type', e.target.value)}
                          className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                        >
                          {fieldTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`required-${field.id}`}
                          checked={field.required}
                          onChange={(e) => updateCustomField(field.id, 'required', e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor={`required-${field.id}`} className="text-sm">
                          Required field
                        </Label>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomField(field.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
                
                <Button
                  variant="outline"
                  onClick={addCustomField}
                  className="w-full flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Field
                </Button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAdd}
              disabled={!sectionTitle.trim()}
            >
              Add Section
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}