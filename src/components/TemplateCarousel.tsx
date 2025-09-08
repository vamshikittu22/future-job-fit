import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, Palette, Type } from "lucide-react";

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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const categories = ['all', 'minimal', 'student', 'experienced', 'colorful', 'creative'];
  
  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t shadow-nav z-30">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Choose Template</h3>
            <p className="text-sm text-muted-foreground">
              Select a design that matches your style
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  className="capitalize"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
            
            {/* Customization Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCustomization(!showCustomization)}
              className="flex items-center gap-2"
            >
              <Palette className="w-4 h-4" />
              Customize
            </Button>
          </div>
        </div>
      </div>

      {/* Template Grid */}
      <div className="p-6">
        <ScrollArea className="w-full">
          <div className="flex gap-4 pb-4">
            {filteredTemplates.map((template) => (
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
      </div>

      {/* Customization Panel */}
      {showCustomization && selectedTemplateData && (
        <div className="border-t bg-muted/30 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-3 gap-6">
              {/* Font Selection */}
              <div>
                <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Font Family
                </Label>
                <div className="space-y-2">
                  {['Inter', 'Roboto', 'Open Sans', 'Lato'].map(font => (
                    <Button
                      key={font}
                      variant={selectedTemplateData.font === font ? "default" : "outline"}
                      size="sm"
                      className="w-full justify-start"
                      style={{ fontFamily: font }}
                    >
                      {font}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Primary Color */}
              <div>
                <Label className="text-sm font-medium mb-2">Primary Color</Label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    '#2563eb', '#7c3aed', '#059669', '#dc2626',
                    '#ea580c', '#0891b2', '#7c2d12', '#1e293b'
                  ].map(color => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${
                        selectedTemplateData.colors.primary === color 
                          ? 'border-foreground scale-110' 
                          : 'border-transparent hover:border-muted-foreground'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        // Handle color change
                      }}
                    />
                  ))}
                </div>
              </div>
              
              {/* Accent Color */}
              <div>
                <Label className="text-sm font-medium mb-2">Accent Color</Label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    '#60a5fa', '#a78bfa', '#34d399', '#f87171',
                    '#fb923c', '#38bdf8', '#f59e0b', '#64748b'
                  ].map(color => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${
                        selectedTemplateData.colors.accent === color 
                          ? 'border-foreground scale-110' 
                          : 'border-transparent hover:border-muted-foreground'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        // Handle color change
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}