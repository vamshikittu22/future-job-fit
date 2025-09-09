import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Minus, GripVertical, Trash2 } from "lucide-react";
import { Draggable } from "@hello-pangea/dnd";

interface DynamicSectionProps {
  sectionId: string;
  index: number;
  title: string;
  data: any;
  onUpdate: (data: any) => void;
  onDelete: () => void;
  isActive: boolean;
  onActivate: () => void;
}

export default function DynamicSection({
  sectionId,
  index,
  title,
  data,
  onUpdate,
  onDelete,
  isActive,
  onActivate
}: DynamicSectionProps) {
  const [isExpanded, setIsExpanded] = useState(isActive);

  const handleUpdate = (field: string, value: any) => {
    onUpdate({
      ...data,
      [field]: value
    });
  };

  const addArrayItem = (field: string, defaultItem: any) => {
    const currentArray = data[field] || [];
    handleUpdate(field, [...currentArray, { ...defaultItem, id: Date.now().toString() }]);
  };

  const updateArrayItem = (field: string, itemId: string, updates: any) => {
    const currentArray = data[field] || [];
    handleUpdate(field, currentArray.map((item: any) => 
      item.id === itemId ? { ...item, ...updates } : item
    ));
  };

  const removeArrayItem = (field: string, itemId: string) => {
    const currentArray = data[field] || [];
    handleUpdate(field, currentArray.filter((item: any) => item.id !== itemId));
  };

  const renderPersonalInfo = () => (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor={`${sectionId}-name`}>Full Name</Label>
        <Input
          id={`${sectionId}-name`}
          value={data.name || ''}
          onChange={(e) => handleUpdate('name', e.target.value)}
          placeholder="John Doe"
        />
      </div>
      <div>
        <Label htmlFor={`${sectionId}-title`}>Professional Title</Label>
        <Input
          id={`${sectionId}-title`}
          value={data.title || ''}
          onChange={(e) => handleUpdate('title', e.target.value)}
          placeholder="Software Developer"
        />
      </div>
      <div>
        <Label htmlFor={`${sectionId}-email`}>Email</Label>
        <Input
          id={`${sectionId}-email`}
          type="email"
          value={data.email || ''}
          onChange={(e) => handleUpdate('email', e.target.value)}
          placeholder="john@example.com"
        />
      </div>
      <div>
        <Label htmlFor={`${sectionId}-phone`}>Phone</Label>
        <Input
          id={`${sectionId}-phone`}
          value={data.phone || ''}
          onChange={(e) => handleUpdate('phone', e.target.value)}
          placeholder="+1 (555) 123-4567"
        />
      </div>
      <div>
        <Label htmlFor={`${sectionId}-location`}>Location</Label>
        <Input
          id={`${sectionId}-location`}
          value={data.location || ''}
          onChange={(e) => handleUpdate('location', e.target.value)}
          placeholder="San Francisco, CA"
        />
      </div>
      <div>
        <Label htmlFor={`${sectionId}-linkedin`}>LinkedIn</Label>
        <Input
          id={`${sectionId}-linkedin`}
          value={data.linkedin || ''}
          onChange={(e) => handleUpdate('linkedin', e.target.value)}
          placeholder="linkedin.com/in/johndoe"
        />
      </div>
    </div>
  );

  const renderSummary = () => (
    <div>
      <Label htmlFor={`${sectionId}-summary`}>Professional Summary</Label>
      <Textarea
        id={`${sectionId}-summary`}
        value={data.summary || ''}
        onChange={(e) => handleUpdate('summary', e.target.value)}
        placeholder="Brief professional summary highlighting your key skills and achievements..."
        className="min-h-[100px] resize-none"
      />
      <div className="text-xs text-muted-foreground mt-1">
        {(data.summary || '').length}/500 characters
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-4">
      {(data.categories || []).map((category: any) => (
        <Card key={category.id} className="p-4">
          <div className="flex items-center justify-between mb-3">
            <Input
              value={category.name || ''}
              onChange={(e) => updateArrayItem('categories', category.id, { name: e.target.value })}
              placeholder="Skill Category"
              className="font-medium"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeArrayItem('categories', category.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <Textarea
            value={category.skills?.join(', ') || ''}
            onChange={(e) => updateArrayItem('categories', category.id, { 
              skills: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean)
            })}
            placeholder="React, TypeScript, Node.js..."
            className="resize-none"
          />
        </Card>
      ))}
      <Button
        variant="outline"
        onClick={() => addArrayItem('categories', { name: '', skills: [] })}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Skill Category
      </Button>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-4">
      {(data.experiences || []).map((exp: any) => (
        <Card key={exp.id} className="p-4">
          <div className="flex items-start justify-between mb-4">
            <div className="grid grid-cols-2 gap-4 flex-1">
              <Input
                value={exp.title || ''}
                onChange={(e) => updateArrayItem('experiences', exp.id, { title: e.target.value })}
                placeholder="Job Title"
              />
              <Input
                value={exp.company || ''}
                onChange={(e) => updateArrayItem('experiences', exp.id, { company: e.target.value })}
                placeholder="Company Name"
              />
              <Input
                value={exp.duration || ''}
                onChange={(e) => updateArrayItem('experiences', exp.id, { duration: e.target.value })}
                placeholder="Jan 2020 - Present"
              />
              <Input
                value={exp.location || ''}
                onChange={(e) => updateArrayItem('experiences', exp.id, { location: e.target.value })}
                placeholder="City, State"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeArrayItem('experiences', exp.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <Textarea
            value={exp.description || ''}
            onChange={(e) => updateArrayItem('experiences', exp.id, { description: e.target.value })}
            placeholder="• Developed and maintained web applications using React and TypeScript&#10;• Collaborated with cross-functional teams to deliver high-quality features&#10;• Improved application performance by 40% through optimization techniques"
            className="min-h-[100px] resize-none"
          />
        </Card>
      ))}
      <Button
        variant="outline"
        onClick={() => addArrayItem('experiences', { title: '', company: '', duration: '', location: '', description: '' })}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Experience
      </Button>
    </div>
  );

  const renderContent = () => {
    switch (sectionId) {
      case 'personal':
        return renderPersonalInfo();
      case 'summary':
        return renderSummary();
      case 'skills':
        return renderSkills();
      case 'experience':
        return renderExperience();
      default:
        return <div className="text-muted-foreground text-center py-8">Section content will be implemented here</div>;
    }
  };

  return (
    <Draggable draggableId={sectionId} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`transition-all duration-200 ${
            snapshot.isDragging ? 'rotate-1 shadow-accent' : ''
          } ${isActive ? 'ring-2 ring-primary' : ''}`}
        >
          <div
            className="flex items-center justify-between p-4 cursor-pointer border-b"
            onClick={() => {
              setIsExpanded(!isExpanded);
              onActivate();
            }}
          >
            <div className="flex items-center gap-3">
              <div {...provided.dragHandleProps}>
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
              <h3 className="font-semibold">{title}</h3>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {isExpanded && (
            <div className="p-6">
              {renderContent()}
            </div>
          )}
        </Card>
      )}
    </Draggable>
  );
}