import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { WizardStepContainer } from '@/components/wizard/WizardStepContainer';
import { Plus, Trash2 } from 'lucide-react';
import type { CustomField, CustomFieldType, CustomSectionEntry } from '@/lib/initialData';

const fieldTypes: { label: string; value: CustomFieldType }[] = [
  { label: 'Text', value: 'text' },
  { label: 'Textarea', value: 'textarea' },
  { label: 'Date', value: 'date' },
  { label: 'URL', value: 'url' },
  { label: 'Tag List', value: 'tag' },
];

export const CustomSectionStep: React.FC = () => {
  const { id } = useParams();
  const {
    resumeData,
    addCustomField,
    updateCustomField,
    removeCustomField,
    addCustomEntry,
    updateCustomEntry,
    removeCustomEntry,
    removeCustomSection,
  } = useResume();
  const navigate = useNavigate();

  const section = useMemo(
    () => resumeData.customSections.find((s) => s.id === id),
    [resumeData.customSections, id]
  );

  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<CustomFieldType>('text');

  const handleDeleteSection = () => {
    if (!section) return;
    const confirmed = window.confirm(
      'Are you sure you want to delete this custom section? This will remove all fields and entries in it.'
    );
    if (!confirmed) return;

    removeCustomSection(section.id);
    navigate('/resume-wizard');
  };

  if (!section) {
    return (
      <WizardStepContainer 
        title="Section Not Found"
        description="The requested custom section does not exist."
      >
        <div className="py-4">
          <p className="text-muted-foreground">Please go back and select a valid section.</p>
        </div>
      </WizardStepContainer>
    );
  }

  const handleAddField = () => {
    const name = newFieldName.trim();
    if (!name) return;
    const field: CustomField = { id: Date.now().toString(), name, type: newFieldType };
    addCustomField(section.id, field);
    setNewFieldName('');
    setNewFieldType('text');
  };

  const handleAddEntry = () => {
    const values: Record<string, string | string[]> = {};
    (section.fields || []).forEach((f) => {
      values[f.id] = f.type === 'tag' ? [] : '';
    });
    const entry: CustomSectionEntry = { id: Date.now().toString(), values };
    addCustomEntry(section.id, entry);
  };

  const renderInput = (
    field: CustomField,
    entry: CustomSectionEntry
  ) => {
    const value = entry.values[field.id];

    const updateValue = (v: string | string[]) => {
      updateCustomEntry(section.id, entry.id, {
        values: { ...entry.values, [field.id]: v },
      });
    };

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            value={(value as string) || ''}
            onChange={(e) => updateValue(e.target.value)}
            placeholder={field.name}
            className="resize-none"
          />
        );
      case 'date':
        return (
          <Input
            type="date"
            value={(value as string) || ''}
            onChange={(e) => updateValue(e.target.value)}
          />
        );
      case 'url':
        return (
          <Input
            type="url"
            value={(value as string) || ''}
            onChange={(e) => updateValue(e.target.value)}
            placeholder="https://example.com"
          />
        );
      case 'tag': {
        const str = Array.isArray(value) ? (value as string[]).join(', ') : '';
        return (
          <Input
            value={str}
            onChange={(e) => updateValue(
              e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            )}
            placeholder="tag1, tag2, tag3"
          />
        );
      }
      default:
        return (
          <Input
            value={(value as string) || ''}
            onChange={(e) => updateValue(e.target.value)}
            placeholder={field.name}
          />
        );
    }
  };

  return (
    <WizardStepContainer 
      title={section.title || 'Custom Section'}
      description="Add and manage custom fields for this section"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="flex-1 space-y-1">
            <h3 className="text-sm font-medium">Section Fields</h3>
            <p className="text-xs text-muted-foreground">
              Add custom fields to collect specific information
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex gap-2">
              <Input
                placeholder="Field name"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                className="w-36"
              />
              <select
                className="border bg-transparent rounded-md px-2 py-2 text-sm text-sm w-28"
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value as CustomFieldType)}
              >
                {fieldTypes.map((ft) => (
                  <option key={ft.value} value={ft.value}>
                    {ft.label}
                  </option>
                ))}
              </select>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleAddField}
                disabled={!newFieldName.trim()}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Field
              </Button>
            </div>
            <Button 
              size="sm" 
              onClick={handleAddEntry}
              disabled={(section.fields || []).length === 0}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Entry
            </Button>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteSection}
          >
            <Trash2 className="h-4 w-4 mr-2" /> Delete Section
          </Button>
        </div>

      {/* Fields Editor */}
      {(section.fields || []).length === 0 ? (
        <p className="text-muted-foreground">No fields yet. Add a field to get started.</p>
      ) : (
        <Card className="p-4 space-y-3">
          {(section.fields || []).map((f) => (
            <div key={f.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
              <div className="md:col-span-2">
                <Label className="text-xs text-muted-foreground">Field Name</Label>
                <Input
                  value={f.name}
                  onChange={(e) => updateCustomField(section.id, f.id, { name: e.target.value })}
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Type</Label>
                <select
                  className="border bg-transparent rounded-md px-2 py-2 text-sm w-full"
                  value={f.type}
                  onChange={(e) => updateCustomField(section.id, f.id, { type: e.target.value as CustomFieldType })}
                >
                  {fieldTypes.map((ft) => (
                    <option key={ft.value} value={ft.value}>
                      {ft.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end justify-end">
                <Button variant="ghost" onClick={() => removeCustomField(section.id, f.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* Entries */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Section Entries</h3>
        {(section.entries || []).length === 0 ? (
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              No entries added yet. Click 'Add Entry' to get started.
            </p>
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleAddEntry}
              disabled={(section.fields || []).length === 0}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Entry
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {(section.entries || []).map((entry) => (
              <Card key={entry.id} className="p-4 space-y-4">
                {(section.fields || []).map((f) => (
                  <div key={f.id} className="space-y-1">
                    <Label className="text-xs text-muted-foreground">{f.name}</Label>
                    {renderInput(f, entry)}
                  </div>
                ))}
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => removeCustomEntry(section.id, entry.id)}
                  >
                    Delete Entry
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  </WizardStepContainer>
  );
};

export default CustomSectionStep;
