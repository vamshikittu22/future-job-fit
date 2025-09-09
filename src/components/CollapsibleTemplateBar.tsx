import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChevronUp, ChevronDown, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

interface Template {
  id: string;
  name: string;
  category: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const templates: Template[] = [
  {
    id: 'minimal-1',
    name: 'Swiss Minimal',
    category: 'minimal',
    colors: { primary: '#2563eb', secondary: '#64748b', accent: '#0ea5e9' }
  },
  {
    id: 'attractive-1',
    name: 'Modern Professional',
    category: 'attractive',
    colors: { primary: '#7c3aed', secondary: '#a855f7', accent: '#c084fc' }
  },
  {
    id: 'colorful-1',
    name: 'Creative Blue',
    category: 'colorful',
    colors: { primary: '#059669', secondary: '#10b981', accent: '#34d399' }
  },
  {
    id: 'content-1',
    name: 'Content Rich',
    category: 'content-driven',
    colors: { primary: '#1f2937', secondary: '#4b5563', accent: '#6b7280' }
  },
  {
    id: 'student-1',
    name: 'Fresh Graduate',
    category: 'student',
    colors: { primary: '#dc2626', secondary: '#ef4444', accent: '#f87171' }
  }
];

interface CollapsibleTemplateBarProps {
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
}

export default function CollapsibleTemplateBar({
  selectedTemplate,
  onTemplateChange
}: CollapsibleTemplateBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t shadow-nav">
      {/* Minimized State */}
      {!isExpanded && (
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Palette className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">Templates</span>
            <Badge variant="secondary" className="text-xs">
              {templates.find(t => t.id === selectedTemplate)?.name || 'Swiss Minimal'}
            </Badge>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-2"
          >
            <ChevronUp className="h-4 w-4" />
            Choose Template
          </Button>
        </div>
      )}

      {/* Expanded State */}
      {isExpanded && (
        <div>
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div>
              <h3 className="font-semibold">Choose Template</h3>
              <p className="text-sm text-muted-foreground">
                Select a design that matches your style
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="flex items-center gap-2"
            >
              <ChevronDown className="h-4 w-4" />
              Minimize
            </Button>
          </div>

          {/* Template Grid */}
          <div className="p-6">
            <ScrollArea className="w-full">
              <div className="flex gap-4 pb-4">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className={cn(
                      "relative cursor-pointer transition-all duration-200 hover:shadow-swiss flex-shrink-0",
                      selectedTemplate === template.id 
                        ? "ring-2 ring-primary shadow-accent" 
                        : "hover:ring-1 hover:ring-primary/50"
                    )}
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
                            <div className="w-2 h-2 bg-primary-foreground rounded-full" />
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
          </div>
        </div>
      )}
    </div>
  );
}