Briefcase,
  GraduationCap,
  FolderOpen,
  Award,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Target,
  Layout,
  Palette,
  Minimize2,
  RefreshCw,
  Sparkles,
  Plus,
  Pencil,
  Trash2,
  X
} from 'lucide-react';
import { useATS } from '@/shared/hooks/use-ats';
import { ResumeData } from '@/shared/lib/initialData';
import { SECTION_NAMES, SECTION_ORDER, type SectionKey } from '@/shared/constants/sectionNames';

interface CustomSectionData {
  id: string;
  title: string;
  description?: string;
  items: Array<{
    id: string;
    title: string;
    subtitle?: string;
    date?: string;
    description?: string;
  }>;
}

// Props definition for the component
interface ResumeBuilderSidebarProps {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  sectionOrder: string[];
  resumeData: any;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onToggleTemplateCarousel?: () => void;
  onSelectTemplate?: (templateId: string) => void;
  selectedTemplate?: string;
  // Controlled accordion support
  expandedSection?: string | null;
  onExpandedChange?: (key: string | null) => void;
  customSections: CustomSectionData[];
  onAddCustomSection?: (section: CustomSectionData) => void;
  onEditCustomSection?: (section: CustomSectionData) => void;
  onRemoveCustomSection?: (sectionId: string) => void;
  updateResumeData: (section: string, data: any) => void;
}

// Icon mappings for resume sections
const sectionIcons = {
  personal: User,
  summary: FileText,
  skills: Code,
  experience: Briefcase,
  education: GraduationCap,
  projects: FolderOpen,
  achievements: Award,
  certifications: Award,
};

// The main sidebar component
export default function ResumeBuilderSidebar({
  activeSection,
  onSectionChange,
  sectionOrder = SECTION_ORDER,
  resumeData,
  isCollapsed,
  onToggleCollapse,
  onToggleTemplateCarousel,
  onSelectTemplate,
  selectedTemplate,
  expandedSection: expandedControlled,
  onExpandedChange,
  customSections,
  onAddCustomSection,
  onEditCustomSection,
  onRemoveCustomSection,
  updateResumeData,
}: ResumeBuilderSidebarProps) {
  const [expandedUncontrolled, setExpandedUncontrolled] = useState<string | null>('resume');
  const expandedSection = expandedControlled !== undefined ? expandedControlled : expandedUncontrolled;
  const setExpanded = (val: string | null) => {
    if (onExpandedChange) onExpandedChange(val);
    setExpandedUncontrolled(val);
  };

  // Use the new ATS hook with live resume data
  const { atsScore, analysis } = useATS(resumeData);

  // Determines the completion status of a section to show a colored dot
  const getCompletionStatus = (sectionId: string): 'complete' | 'partial' | 'empty' => {
    switch (sectionId) {
      case 'personal':
        const personal = resumeData.personal;
        return personal?.name && personal?.email ? 'complete' : personal?.name || personal?.email ? 'partial' : 'empty';
      case 'summary':
        const summaryText = resumeData.summary || '';
        return summaryText.length > 50 ? 'complete' : summaryText.length > 0 ? 'partial' : 'empty';
      case 'skills':
        const skills = resumeData.skills || [];
        // Handle both old and new skills format
        let hasSkills = false;
        if (Array.isArray(skills)) {
          // New format: Array of categories with items
          hasSkills = skills.some(category =>
            category?.items && Array.isArray(category.items) && category.items.length > 0
          );
        } else if (typeof skills === 'object' && skills !== null) {
          // Old format: { languages: [], frameworks: [], tools: [] }
          hasSkills = Object.values(skills).some((s: any) => Array.isArray(s) && s.length > 0);
        }
        return hasSkills ? 'complete' : 'empty';
      case 'experience':
        return (resumeData.experience || []).length > 0 ? 'complete' : 'empty';
      case 'education':
        return (resumeData.education || []).length > 0 ? 'complete' : 'empty';
      default:
        return (resumeData[sectionId] || []).length > 0 ? 'complete' : 'empty';
    }
  };

  const getStatusColor = (status: string) => {
    if (status === 'complete') return 'bg-green-500';
    if (status === 'partial') return 'bg-yellow-500';
    return 'bg-gray-300';
  };

  // Toggles which section is currently expanded (accordion behavior)
  const handleSectionToggle = (section: string) => {
    setExpanded(expandedSection === section ? null : section);
  };

  // Determines the color of the ATS score based on its value
  const getATSScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Handle adding a new custom section from the button click
  const handleAddCustomSection = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const newSection: CustomSectionData = {
      id: `custom-${Date.now()}`,
      title: 'Custom Section',
      description: '',
      items: [
        {
          id: `item-${Date.now()}`,
          title: '',
          subtitle: '',
          date: '',
          description: ''
        }
      ]
    };

    // Call the parent's onAddCustomSection with the new section
    onAddCustomSection?.(newSection);

    // Set the new section as active
    onSectionChange(newSection.id);

    // Ensure the resume section is expanded when adding a new section
    if (onExpandedChange) {
      onExpandedChange('resume');
    } else {
      setExpanded('resume');
    }
  };

  const removeCustomSection = (id: string) => {
    const section = customSections.find(s => s.id === id);
    if (section && window.confirm(`Are you sure you want to delete the "${section.title}" section?`)) {
      // Use the provided callback to remove the section
      onRemoveCustomSection?.(id);

      // If the removed section was active, switch to the first available section
      if (activeSection === id) {
        onSectionChange(sectionOrder[0]);
      }
    }
  };

  return (
    <aside className={`fixed top-16 left-0 bottom-0 w-80 bg-background border-r flex flex-col transition-all duration-300 ${isCollapsed ? '-translate-x-full' : 'translate-x-0'
      }`}>
      {/* Sidebar Header - Resume Builder Title */}
      <div className="p-4 border-b bg-primary/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">Resume Builder</h2>
            <p className="text-xs text-muted-foreground">Create your perfect resume</p>
          </div>
        </div>
      </div>

      {/* Main scrollable area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* --- Resume Sections --- */}
        <div className="border-b">
          <div
            className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => !isCollapsed && handleSectionToggle('resume')}
          >
            <div className={`flex items-center gap-4 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
              <div className="flex items-center gap-4">
                <FileText className={`h-6 w-6 text-primary`} />
                {!isCollapsed && <span className="font-medium">Resume Sections</span>}
              </div>
              {!isCollapsed && (expandedSection === 'resume' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
            </div>
          </div>

          {!isCollapsed && expandedSection === 'resume' && (
            <div className="p-2">
              {/* Built-in sections */}
              {sectionOrder
                .filter(id => id !== 'custom' && !id.startsWith('custom'))
                .map((sectionId) => {
                  const Icon = sectionIcons[sectionId as keyof typeof sectionIcons];
                  const status = getCompletionStatus(sectionId);
                  return (
                    <div
                      key={sectionId}
                      className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-muted/80 ${activeSection === sectionId ? 'bg-primary/10' : ''
                        }`}
                      onClick={() => onSectionChange(sectionId)}
                    >
                      {Icon ? (
                        <Icon className={`h-5 w-5 ${activeSection === sectionId ? 'text-primary' : 'text-muted-foreground'
                          }`} />
                      ) : (
                        <FileText className={`h-5 w-5 ${activeSection === sectionId ? 'text-primary' : 'text-muted-foreground'
                          }`} />
                      )}
                      <span className={`flex-1 text-sm ${activeSection === sectionId ? 'text-primary font-medium' : ''
                        }`}>
                        {SECTION_NAMES[sectionId as SectionKey] || sectionId}
                      </span>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
                    </div>
                  );
                })}

              {/* Custom sections */}
              <div className="space-y-1">
                {Array.isArray(customSections) && customSections.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-xs font-medium text-muted-foreground px-3 mb-1">Custom Sections</h4>
                    <div className="space-y-1">
                      {customSections.map((section) => {
                        if (!section?.id) return null;
                        const status = section.items?.length > 0 ? 'complete' : 'empty';
                        return (
                          <div
                            key={section.id}
                            className={`group flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-muted/80 ${activeSection === section.id ? 'bg-primary/10' : ''
                              }`}
                            onClick={() => onSectionChange(section.id)}
                          >
                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                              <Plus className="w-3 h-3 text-primary" />
                            </div>
                            <span className={`flex-1 text-sm truncate ${activeSection === section.id ? 'text-primary font-medium' : ''
                              }`}>
                              {section.title || 'Custom Section'}
                            </span>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeCustomSection(section.id);
                                }}
                              >
                                <X className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                                <span className="sr-only">Delete section</span>
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <Button
                  variant="outline"
                  className="w-full justify-start mt-4"
                  onClick={handleAddCustomSection}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Custom Section
                </Button>
                <Separator className="my-2" />
              </div>
            </div>
          )}
        </div>

        {/* --- ATS Score Section (Live Data) --- */}
        <div className="border-b">
          <div
            className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => !isCollapsed && handleSectionToggle('ats')}
          >
            <div className={`flex items-center gap-4 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
              <div className="flex items-center gap-4">
                <Target className={`h-6 w-6 text-primary`} />
                {!isCollapsed && <span className="font-medium">ATS Score</span>}
              </div>
              {!isCollapsed && <span className={`font-bold text-sm ${getATSScoreColor(atsScore)}`}>{atsScore} / 100</span>}
            </div>
          </div>

          {!isCollapsed && expandedSection === 'ats' && (
            <div className="p-4 text-left space-y-4 bg-muted/30">
              {/* Score Meter */}
              <div className="relative w-28 h-28 mx-auto mb-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-gray-200" stroke="currentColor" strokeWidth="2" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className={getATSScoreColor(atsScore)} stroke="currentColor" strokeWidth="2" strokeDasharray={`${atsScore}, 100`} strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-3xl font-bold ${getATSScoreColor(atsScore)}`}>{atsScore}%</span>
                </div>
              </div>

              {/* Section Strength */}
              {analysis.sections && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Section Strength</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    {Object.entries(analysis.sections).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">{key}</span>
                        <span className={`font-medium ${getATSScoreColor(value as number)}`}>{Math.round(value as number)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Keywords Matched */}
              {analysis.keywords && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Keywords Matched ({analysis.keywords.matched.length} / {analysis.keywords.total})</h4>
                  <div className="flex flex-wrap gap-1">
                    {analysis.keywords.matched.slice(0, 10).map((k: string) => (
                      <span key={k} className="px-2 py-1 text-xs rounded-full bg-muted text-foreground">{k}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actionable Suggestions */}
              {analysis.suggestions && analysis.suggestions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">Actionable Suggestions</h4>
                  <ul className="text-xs text-muted-foreground space-y-2">
                    {analysis.suggestions.map((s: { text: string; priority: string }, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className={`mt-1 h-2 w-2 rounded-full ${s.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                        <span>{s.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* --- Templates Section --- */}
        <div className="border-b">
          <div
            className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => !isCollapsed && handleSectionToggle('templates')}
          >
            <div className={`flex items-center gap-4 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
              <div className="flex items-center gap-4">
                <Layout className={`h-6 w-6 text-primary`} />
                {!isCollapsed && <span className="font-medium">Templates</span>}
              </div>
              {!isCollapsed && (expandedSection === 'templates' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
            </div>
          </div>

          {!isCollapsed && expandedSection === 'templates' && (
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {['modern', 'classic', 'creative', 'minimal'].map((template) => (
                  <Button
                    key={template}
                    variant={selectedTemplate === template ? 'default' : 'outline'}
                    size="sm"
                    className="h-16 flex flex-col gap-1 capitalize"
                    onClick={() => onSelectTemplate?.(template)}
                  >
                    <div className={`w-full h-8 rounded bg-gray-200`}></div>
                    {template}
                  </Button>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                <Palette className="w-4 h-4" />
                Customize Your Resume
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={onToggleTemplateCarousel}>
                <Minimize2 className="w-4 h-4" />
                Minimize Carousel
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* CSS for hiding the scrollbar */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </aside>
  );
}