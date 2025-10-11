import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X } from 'lucide-react';
import { CustomSection, CustomField, CustomSectionEntry } from '@/types/resume';

interface CustomSectionsProps {
  customSections: CustomSection[];
  onUpdate: (sections: CustomSection[]) => void;
}

export function CustomSections({ customSections, onUpdate }: CustomSectionsProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const addNewSection = () => {
    const newSection: CustomSection = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      fields: [
        { id: `field-${Date.now()}-1`, name: 'Field 1', type: 'text' },
        { id: `field-${Date.now()}-2`, name: 'Description', type: 'textarea' }
      ],
      entries: [
        {
          id: `entry-${Date.now()}`,
          values: {}
        }
      ]
    };
    
    const updatedSections = [...customSections, newSection];
    onUpdate(updatedSections);
    setActiveSection(newSection.id);
  };

  const updateSection = (sectionId: string, updates: Partial<CustomSection>) => {
    const updatedSections = customSections.map(section =>
      section.id === sectionId ? { ...section, ...updates } : section
    );
    onUpdate(updatedSections);
  };

  const removeSection = (sectionId: string) => {
    const updatedSections = customSections.filter(section => section.id !== sectionId);
    onUpdate(updatedSections);
    if (activeSection === sectionId) {
      setActiveSection(updatedSections[0]?.id || null);
    }
  };

  const addField = (sectionId: string) => {
    const fieldId = `field-${Date.now()}`;
    const newField: CustomField = {
      id: fieldId,
      name: 'New Field',
      type: 'text'
    };

    const updatedSections = customSections.map(section => {
      if (section.id === sectionId) {
        const updatedEntries = section.entries.map(entry => ({
          ...entry,
          values: {
            ...entry.values,
            [fieldId]: ''
          }
        }));

        return {
          ...section,
          fields: [...section.fields, newField],
          entries: updatedEntries
        };
      }
      return section;
    });

    onUpdate(updatedSections);
  };

  const updateFieldValue = (sectionId: string, fieldId: string, value: string) => {
    const updatedSections = customSections.map(section => {
      if (section.id === sectionId) {
        const updatedEntries = section.entries.map(entry => ({
          ...entry,
          values: {
            ...entry.values,
            [fieldId]: value
          }
        }));

        return {
          ...section,
          entries: updatedEntries
        };
      }
      return section;
    });

    onUpdate(updatedSections);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Custom Sections</h2>
        <Button onClick={addNewSection}>
          <Plus className="h-4 w-4 mr-2" /> Add Section
        </Button>
      </div>

      {customSections.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No custom sections added yet</p>
            <Button variant="outline" className="mt-4" onClick={addNewSection}>
              <Plus className="h-4 w-4 mr-2" /> Create your first section
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {customSections.map(section => (
            <Card key={section.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">
                    <Input
                      value={section.title}
                      onChange={(e) => updateSection(section.id, { title: e.target.value })}
                      className="text-xl font-bold border-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => removeSection(section.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                {section.description && (
                  <CardDescription>
                    <Textarea
                      value={section.description}
                      onChange={(e) => updateSection(section.id, { description: e.target.value })}
                      placeholder="Section description (optional)"
                      className="border-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
                      rows={1}
                    />
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {section.fields.map(field => (
                  <div key={field.id} className="space-y-2">
                    <Label>{field.name}</Label>
                    {field.type === 'textarea' ? (
                      <Textarea
                        value={section.entries[0]?.values[field.id] || ''}
                        onChange={(e) => updateFieldValue(section.id, field.id, e.target.value)}
                        placeholder={`Enter ${field.name.toLowerCase()}`}
                      />
                    ) : (
                      <Input
                        type={field.type}
                        value={section.entries[0]?.values[field.id] || ''}
                        onChange={(e) => updateFieldValue(section.id, field.id, e.target.value)}
                        placeholder={`Enter ${field.name.toLowerCase()}`}
                      />
                    )}
                  </div>
                ))}
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addField(section.id)}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Field
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
