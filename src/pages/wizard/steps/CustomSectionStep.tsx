import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useResume } from '@/contexts/ResumeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
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
  } = useResume();

  const section = useMemo(
    () => resumeData.customSections.find((s) => s.id === id),
    [resumeData.customSections, id]
  );

  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState<CustomFieldType>('text');

  if (!section) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Section not found</h2>
        <p className="text-muted-foreground">The requested custom section does not exist.</p>
      </div>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{section.title || 'Custom Section'}</h2>
        <div className="flex items-center gap-2">
          <Input
            placeholder="New field name"
            value={newFieldName}
            onChange={(e) => setNewFieldName(e.target.value)}
            className="w-44"
          />
          <select
            className="border bg-transparent rounded-md px-2 py-2 text-sm"
            value={newFieldType}
            onChange={(e) => setNewFieldType(e.target.value as CustomFieldType)}
          >
            {fieldTypes.map((ft) => (
              <option key={ft.value} value={ft.value}>
                {ft.label}
              </option>
            ))}
          </select>
          <Button variant="outline" onClick={handleAddField}>Add Field</Button>
          <Button onClick={handleAddEntry}>Add Entry</Button>
        </div>
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
        {(section.entries || []).map((entry) => (
          <Card key={entry.id} className="p-4 space-y-4">
            {(section.fields || []).map((f) => (
              <div key={f.id} className="space-y-1">
                <Label className="text-xs text-muted-foreground">{f.name}</Label>
                {renderInput(f, entry)}
              </div>
            ))}
            <div className="flex justify-end">
              <Button variant="ghost" onClick={() => removeCustomEntry(section.id, entry.id)}>Delete Entry</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CustomSectionStep;
