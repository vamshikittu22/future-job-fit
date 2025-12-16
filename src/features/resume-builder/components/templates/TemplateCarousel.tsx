import { useState } from "react";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Label } from "@/shared/ui/label";
import { ScrollArea, ScrollBar } from "@/shared/ui/scroll-area";
import { ChevronLeft, ChevronRight, Palette, Type, ChevronDown, ChevronUp } from "lucide-react";

interface Template {
  id: string;
  name: string;
  category: 'minimal' | 'student' | 'experienced' | 'colorful' | 'creative';
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  font: string;
}

const templates: Template[] = [
  {
    id: 'minimal-1',
    name: 'Swiss Minimal',
    category: 'minimal',
    preview: '/api/placeholder/200/280',
    colors: { primary: '#2563eb', secondary: '#64748b', accent: '#0ea5e9' },
    font: 'Inter'
  },
  {
    id: 'minimal-2',
    name: 'Clean Lines',
    category: 'minimal',
    preview: '/api/placeholder/200/280',
    colors: { primary: '#1e293b', secondary: '#64748b', accent: '#0ea5e9' },
    font: 'Inter'
  },
  {
    id: 'student-1',
    name: 'Student Fresh',
    category: 'student',
    preview: '/api/placeholder/200/280',
    colors: { primary: '#7c3aed', secondary: '#a855f7', accent: '#c084fc' },
    font: 'Inter'
  },
  {
    id: 'experienced-1',
    name: 'Executive',
    category: 'experienced',
    preview: '/api/placeholder/200/280',
    colors: { primary: '#1f2937', secondary: '#4b5563', accent: '#6b7280' },
    font: 'Inter'
  },
  {
    id: 'colorful-1',
    name: 'Creative Blue',
    category: 'colorful',
    preview: '/api/placeholder/200/280',
    colors: { primary: '#2563eb', secondary: '#3b82f6', accent: '#60a5fa' },
    font: 'Inter'
  },
  {
    id: 'colorful-2',
    name: 'Modern Green',
    category: 'colorful',
    preview: '/api/placeholder/200/280',
    colors: { primary: '#059669', secondary: '#10b981', accent: '#34d399' },
    font: 'Inter'
  },
  {
    id: 'creative-1',
    name: 'Designer',
    category: 'creative',
    preview: '/api/placeholder/200/280',
    colors: { primary: '#dc2626', secondary: '#ef4444', accent: '#f87171' },
    font: 'Inter'
  },
  {
    id: 'creative-2',
    name: 'Artistic',
    category: 'creative',
    preview: '/api/placeholder/200/280',
    colors: { primary: '#7c2d12', secondary: '#ea580c', accent: '#fb923c' },
    font: 'Inter'
  }
];

interface TemplateCarouselProps {
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
  resumeData: any;
}

export default function TemplateCarousel({
  selectedTemplate,
  onTemplateChange,
  resumeData
}: TemplateCarouselProps) {
  const [showCustomization, setShowCustomization] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`bg-card/50 backdrop-blur border-t ${isCollapsed ? 'h-12' : 'h-64'} transition-all duration-300 overflow-hidden`}>
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-sm">Templates</h3>
          <Badge variant="outline" className="text-xs">
            {templates.find(t => t.id === selectedTemplate)?.name || 'Custom'}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCustomization(!showCustomization)}
            className="h-8 w-8 p-0"
            title={showCustomization ? 'Hide customization' : 'Show customization'}
          >
            {showCustomization ? <Type className="w-4 h-4" /> : <Palette className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0"
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </div>
      
      {!isCollapsed && (
        <div className="p-4">
          <ScrollArea className="w-full">
            <div className="flex gap-4 pb-4">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className={`relative cursor-pointer transition-all duration-200 hover:shadow-swiss flex-shrink-0 ${
                    selectedTemplate === template.id 
                      ? 'ring-2 ring-primary shadow-accent' 
                      : 'hover:ring-1 hover:ring-primary/50'
                  }`}
                  onClick={() => onTemplateChange(template.id)}
                >
                  <div className="p-4 w-48">
                    {/* Template Preview */}
                    <div className="relative mb-3">
                      <div 
                        className="w-full h-32 rounded-lg bg-gradient-to-br border"
                        style={{
                          backgroundImage: `linear-gradient(135deg, ${template.colors.primary}20, ${template.colors.accent}10)`
                        }}
                      >
                        {/* Mock Resume Content */}
                        <div className="p-3 text-xs">
                          <div 
                            className="h-2 rounded mb-2"
                            style={{ backgroundColor: template.colors.primary, width: '60%' }}
                          />
                          <div 
                            className="h-1 rounded mb-1"
                            style={{ backgroundColor: template.colors.secondary, width: '80%' }}
                          />
                          <div 
                            className="h-1 rounded mb-2"
                            style={{ backgroundColor: template.colors.secondary, width: '40%' }}
                          />
                          <div 
                            className="h-1 rounded mb-1"
                            style={{ backgroundColor: template.colors.accent, width: '70%' }}
                          />
                          <div 
                            className="h-1 rounded"
                            style={{ backgroundColor: template.colors.accent, width: '50%' }}
                          />
                        </div>
                      </div>
                      
                      {selectedTemplate === template.id && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                    
                    {/* Template Info */}
                    <div className="text-center">
                      <h4 className="font-medium text-sm mb-1">{template.name}</h4>
                      <Badge variant="secondary" className="text-xs capitalize">
                        {template.category}
                      </Badge>
                    </div>
                    
                    {/* Color Palette */}
                    <div className="flex justify-center gap-1 mt-2">
                      <div 
                        className="w-3 h-3 rounded-full border"
                        style={{ backgroundColor: template.colors.primary }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full border"
                        style={{ backgroundColor: template.colors.secondary }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full border"
                        style={{ backgroundColor: template.colors.accent }}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {showCustomization && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-sm font-medium mb-3">Customize Template</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Primary Color</Label>
                  <div className="flex gap-2">
                    {['#2563eb', '#7c3aed', '#dc2626', '#059669', '#7c2d12'].map((color) => (
                      <button
                        key={color}
                        className="w-6 h-6 rounded-full border-2 border-transparent hover:border-primary"
                        style={{ backgroundColor: color }}
                        onClick={() => {}}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Font</Label>
                  <select className="w-full text-sm border rounded-md p-2 bg-background">
                    <option>Inter</option>
                    <option>Roboto</option>
                    <option>Open Sans</option>
                    <option>Lato</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}