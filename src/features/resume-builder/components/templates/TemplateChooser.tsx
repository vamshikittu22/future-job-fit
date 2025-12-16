import React, { useMemo, useState } from 'react';
import { TEMPLATE_REGISTRY, TemplateMeta } from '@/templates/registry';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface TemplateChooserProps {
  selected: string;
  onSelect: (templateId: string) => void;
}

const TemplateCard: React.FC<{ tpl: TemplateMeta; active: boolean; onClick: () => void }>
  = ({ tpl, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`rounded-md border ${active ? 'border-indigo-600 ring-2 ring-indigo-300' : 'border-gray-200'} bg-white shadow-sm hover:shadow-md transition p-3 w-40`}
      title={tpl.name}
    >
      <div className="h-24 w-full bg-gray-100 rounded mb-2 flex items-center justify-center text-xs text-gray-500">
        {tpl.name} preview
      </div>
      <div className="text-sm font-medium text-gray-900 truncate">{tpl.name}</div>
      <div className="text-xs text-gray-600 truncate">{tpl.tags.join(', ')}</div>
    </button>
  );
};

const TemplateChooser: React.FC<TemplateChooserProps> = ({ selected, onSelect }) => {
  const [open, setOpen] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  const tags = useMemo(() => {
    const set = new Set<string>();
    TEMPLATE_REGISTRY.forEach(t => t.tags.forEach(tag => set.add(tag)));
    return ['all', ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return TEMPLATE_REGISTRY;
    return TEMPLATE_REGISTRY.filter(t => t.tags.includes(filter));
  }, [filter]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="mx-auto max-w-6xl">
        <div className={`bg-white border-t shadow-lg rounded-t-xl transition-transform ${open ? 'translate-y-0' : 'translate-y-[85%]'} duration-300`}>
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              <span className="font-semibold">Templates</span>
              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="text-sm border rounded px-2 py-1"
              >
                {tags.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setOpen(v => !v)}
              className="text-gray-600 hover:text-gray-900"
              aria-label={open ? 'Collapse templates' : 'Expand templates'}
            >
              {open ? <ChevronDown className="w-5 h-5"/> : <ChevronUp className="w-5 h-5"/>}
            </button>
          </div>
          <div className="px-4 pb-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {filtered.map(tpl => (
                <TemplateCard
                  key={tpl.id}
                  tpl={tpl}
                  active={tpl.id === selected}
                  onClick={() => onSelect(tpl.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateChooser;
