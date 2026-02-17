import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import { Plus, Minus, GripVertical, Trash2, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
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
  
  // Ensure data is always defined
  const safeData = data || {};

  const handleUpdate = (field: string, value: any) => {
    onUpdate({
      ...safeData,
      [field]: value
    });
  };

  const addArrayItem = (field: string, defaultItem: any) => {
    const currentArray = safeData[field] || [];
    handleUpdate(field, [...currentArray, { ...defaultItem, id: Date.now().toString() }]);
  };

  const updateArrayItem = (field: string, itemId: string, updates: any) => {
    const currentArray = safeData[field] || [];
    handleUpdate(field, currentArray.map((item: any) => 
      item.id === itemId ? { ...item, ...updates } : item
    ));
  };

  const removeArrayItem = (field: string, itemId: string) => {
    const currentArray = safeData[field] || [];
    handleUpdate(field, currentArray.filter((item: any) => item.id !== itemId));
  };

  const renderPersonalInfo = () => (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor={`${sectionId}-name`}>Full Name</Label>
        <Input
          id={`${sectionId}-name`}
          value={safeData.name || ''}
          onChange={(e) => handleUpdate('name', e.target.value)}
          placeholder="John Doe"
        />
      </div>
      <div>
        <Label htmlFor={`${sectionId}-title`}>Professional Title</Label>
        <Input
          id={`${sectionId}-title`}
          value={safeData.title || ''}
          onChange={(e) => handleUpdate('title', e.target.value)}
          placeholder="Software Developer"
        />
      </div>
      <div>
        <Label htmlFor={`${sectionId}-email`}>Email</Label>
        <Input
          id={`${sectionId}-email`}
          type="email"
          value={safeData.email || ''}
          onChange={(e) => handleUpdate('email', e.target.value)}
          placeholder="john@example.com"
        />
      </div>
      <div>
        <Label htmlFor={`${sectionId}-phone`}>Phone</Label>
        <Input
          id={`${sectionId}-phone`}
          value={safeData.phone || ''}
          onChange={(e) => handleUpdate('phone', e.target.value)}
          placeholder="+1 (555) 123-4567"
        />
      </div>
      <div>
        <Label htmlFor={`${sectionId}-location`}>Location</Label>
        <Input
          id={`${sectionId}-location`}
          value={safeData.location || ''}
          onChange={(e) => handleUpdate('location', e.target.value)}
          placeholder="San Francisco, CA"
        />
      </div>
      <div>
        <Label htmlFor={`${sectionId}-linkedin`}>LinkedIn</Label>
        <Input
          id={`${sectionId}-linkedin`}
          value={safeData.linkedin || ''}
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
        value={safeData.summary || ''}
        onChange={(e) => handleUpdate('summary', e.target.value)}
        placeholder="Brief professional summary highlighting your key skills and achievements..."
        className="min-h-[100px] resize-none"
      />
      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-muted-foreground">
          {(safeData.summary || '').length}/500 characters
        </div>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          AI Polish
        </Button>
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-4">
      {(safeData.categories || []).map((category: any) => (
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
      {(safeData.experiences || []).map((exp: any) => (
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
          <div className="flex justify-end mt-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              AI Enhance
            </Button>
          </div>
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

  const renderEducation = () => (
    <div className="space-y-4">
      {(safeData.items || []).map((edu: any) => (
        <Card key={edu.id} className="p-4">
          <div className="flex items-start justify-between mb-4">
            <div className="grid grid-cols-2 gap-4 flex-1">
              <Input
                value={edu.degree || ''}
                onChange={(e) => updateArrayItem('items', edu.id, { degree: e.target.value })}
                placeholder="Bachelor of Science in Computer Science"
              />
              <Input
                value={edu.school || ''}
                onChange={(e) => updateArrayItem('items', edu.id, { school: e.target.value })}
                placeholder="University Name"
              />
              <Input
                value={edu.year || ''}
                onChange={(e) => updateArrayItem('items', edu.id, { year: e.target.value })}
                placeholder="2018-2022"
              />
              <Input
                value={edu.gpa || ''}
                onChange={(e) => updateArrayItem('items', edu.id, { gpa: e.target.value })}
                placeholder="3.8 (optional)"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeArrayItem('items', edu.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
      <Button
        variant="outline"
        onClick={() => addArrayItem('items', { degree: '', school: '', year: '', gpa: '' })}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Education
      </Button>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-4">
      {(safeData.items || []).map((project: any) => (
        <Card key={project.id} className="p-4">
          <div className="flex items-start justify-between mb-4">
            <div className="grid grid-cols-2 gap-4 flex-1">
              <Input
                value={project.name || ''}
                onChange={(e) => updateArrayItem('items', project.id, { name: e.target.value })}
                placeholder="Project Name"
              />
              <Input
                value={project.tech || ''}
                onChange={(e) => updateArrayItem('items', project.id, { tech: e.target.value })}
                placeholder="React, Node.js, PostgreSQL"
              />
              <Input
                value={project.duration || ''}
                onChange={(e) => updateArrayItem('items', project.id, { duration: e.target.value })}
                placeholder="2023"
              />
              <Input
                value={project.link || ''}
                onChange={(e) => updateArrayItem('items', project.id, { link: e.target.value })}
                placeholder="github.com/user/project (optional)"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeArrayItem('items', project.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <Textarea
            value={project.description || ''}
            onChange={(e) => updateArrayItem('items', project.id, { description: e.target.value })}
            placeholder="• Built full-stack e-commerce platform with payment integration&#10;• Implemented real-time inventory management system&#10;• Deployed using Docker and AWS ECS"
            className="min-h-[80px] resize-none"
          />
        </Card>
      ))}
      <Button
        variant="outline"
        onClick={() => addArrayItem('items', { name: '', tech: '', duration: '', description: '', link: '' })}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Project
      </Button>
    </div>
  );

  const renderAchievements = () => {
    const [newAchievement, setNewAchievement] = useState("");
    
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={newAchievement}
            onChange={(e) => setNewAchievement(e.target.value)}
            placeholder="Add an achievement..."
            onKeyPress={(e) => {
              if (e.key === 'Enter' && newAchievement.trim()) {
                handleUpdate('items', [...(safeData.items || []), newAchievement.trim()]);
                setNewAchievement("");
              }
            }}
          />
          <Button
            variant="outline"
            onClick={() => {
              if (newAchievement.trim()) {
                handleUpdate('items', [...(safeData.items || []), newAchievement.trim()]);
                setNewAchievement("");
              }
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          {(safeData.items || []).map((achievement: string, index: number) => (
            <div key={index} className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
              <span className="flex-1 text-sm">{achievement}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const newItems = (safeData.items || []).filter((_: string, i: number) => i !== index);
                  handleUpdate('items', newItems);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCertifications = () => (
    <div className="space-y-4">
      {(safeData.items || []).map((cert: any) => (
        <Card key={cert.id} className="p-4">
          <div className="flex items-start justify-between mb-4">
            <div className="grid grid-cols-2 gap-4 flex-1">
              <Input
                value={cert.name || ''}
                onChange={(e) => updateArrayItem('items', cert.id, { name: e.target.value })}
                placeholder="Certification Name"
              />
              <Input
                value={cert.issuer || ''}
                onChange={(e) => updateArrayItem('items', cert.id, { issuer: e.target.value })}
                placeholder="Issuing Organization"
              />
              <Input
                value={cert.date || ''}
                onChange={(e) => updateArrayItem('items', cert.id, { date: e.target.value })}
                placeholder="2023"
              />
              <Input
                value={cert.link || ''}
                onChange={(e) => updateArrayItem('items', cert.id, { link: e.target.value })}
                placeholder="Verification link (optional)"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeArrayItem('items', cert.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
      <Button
        variant="outline"
        onClick={() => addArrayItem('items', { name: '', issuer: '', date: '', link: '' })}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Certification
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
      case 'education':
        return renderEducation();
      case 'projects':
        return renderProjects();
      case 'achievements':
        return renderAchievements();
      case 'certifications':
        return renderCertifications();
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
          className={`transition-all duration-200 shadow-swiss ${
            snapshot.isDragging ? 'rotate-1 shadow-accent' : ''
          } ${isActive ? 'ring-2 ring-primary' : ''}`}
        >
          <div
            className="flex items-center justify-between p-4 cursor-pointer border-b hover:bg-muted/30 transition-colors"
            onClick={() => {
              setIsExpanded(!isExpanded);
              onActivate();
            }}
          >
            <div className="flex items-center gap-3">
              <div {...provided.dragHandleProps} className="cursor-grab hover:cursor-grabbing">
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
                  // AI enhance functionality
                }}
                className="flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                AI
              </Button>
              
              {!['personal', 'summary'].includes(sectionId) && (
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
              )}
              
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>
          
          {isExpanded && (
            <>
              <Separator />
              <div className="p-6">
                {renderContent()}
              </div>
            </>
          )}
        </Card>
      )}
    </Draggable>
  );
}