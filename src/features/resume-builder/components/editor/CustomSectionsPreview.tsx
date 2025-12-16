import { CustomSection } from '@/shared/types/resume';

interface CustomSectionsPreviewProps {
  customSections: CustomSection[];
}

export function CustomSectionsPreview({ customSections }: CustomSectionsPreviewProps) {
  if (!customSections || customSections.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {customSections.map((section) => (
        <div key={section.id} className="mb-6">
          <h3 className="text-lg font-semibold border-b pb-1 mb-3">{section.title}</h3>
          {section.entries?.map((entry, entryIndex) => (
            <div key={entry.id || entryIndex} className="mb-4">
              {section.fields.map((field) => {
                const value = entry.values?.[field.id];
                if (!value) return null;
                
                return (
                  <div key={field.id} className="mb-2">
                    <div className="font-medium">{field.name}</div>
                    <div className="text-gray-700">
                      {Array.isArray(value) ? value.join(', ') : value}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
