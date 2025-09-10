import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  FileText, 
  Code, 
  Briefcase, 
  GraduationCap, 
  FolderOpen, 
  Trophy, 
  Award, 
  Plus, 
  Target,
  ChevronRight,
  ChevronDown,
  GripVertical,
  PanelLeftOpen,
  PanelLeftClose
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ATSScorePanel from "./ATSScorePanel";

const sectionConfig = {
  personal: { icon: User, label: "Personal Information", description: "Basic details" },
  summary: { icon: FileText, label: "Professional Summary", description: "Career overview" },
  skills: { icon: Code, label: "Technical Skills", description: "Your expertise" },
  experience: { icon: Briefcase, label: "Work Experience", description: "Employment history" },
  education: { icon: GraduationCap, label: "Education", description: "Academic background" },
  projects: { icon: FolderOpen, label: "Projects", description: "Portfolio items" },
  achievements: { icon: Trophy, label: "Achievements", description: "Notable accomplishments" },
  certifications: { icon: Award, label: "Certifications", description: "Professional credentials" }
};

interface ResumeBuilderSidebarProps {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  sectionOrder: string[];
  resumeData: any;
  onAddCustomSection: () => void;
  onReorderSections: (newOrder: string[]) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function ResumeBuilderSidebar({
  activeSection,
  onSectionChange,
  sectionOrder,
  resumeData,
  onAddCustomSection,
  onReorderSections,
  isCollapsed,
  onToggleCollapse
}: ResumeBuilderSidebarProps) {
  const [localSectionOrder, setLocalSectionOrder] = useState(sectionOrder);
  const [expandedSection, setExpandedSection] = useState<'resume' | 'ats' | null>('resume');

  useEffect(() => {
    setLocalSectionOrder(sectionOrder);
  }, [sectionOrder]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const newOrder = Array.from(localSectionOrder);
    const [reorderedItem] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, reorderedItem);

    setLocalSectionOrder(newOrder);
    onReorderSections(newOrder);
  };

  const getCompletionStatus = (sectionId: string) => {
    switch (sectionId) {
      case 'personal':
        const personal = resumeData.personalInfo;
        return personal.name && personal.email ? 'complete' : personal.name || personal.email ? 'partial' : 'empty';
      case 'summary':
        let summaryText = '';
        if (typeof resumeData.summary === 'string') {
          summaryText = resumeData.summary;
        } else if (resumeData.summary && typeof resumeData.summary === 'object') {
          summaryText = resumeData.summary.summary || '';
        }
        return summaryText ? 'complete' : 'empty';
      case 'skills':
        return resumeData.skills?.length > 0 ? 'complete' : 'empty';
      case 'experience':
        return resumeData.experience?.length > 0 ? 'complete' : 'empty';
      case 'education':
        return resumeData.education?.length > 0 ? 'complete' : 'empty';
      case 'projects':
        return resumeData.projects?.length > 0 ? 'complete' : 'empty';
      case 'achievements':
        return resumeData.achievements?.length > 0 ? 'complete' : 'empty';
      case 'certifications':
        return resumeData.certifications?.length > 0 ? 'complete' : 'empty';
      default:
        return 0;
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'complete') {
      return <Badge variant="default" className="text-xs bg-green-500">✓</Badge>;
    }
    return <Badge variant="secondary" className="text-xs">○</Badge>;
  };

  const toggleSection = (section: 'resume' | 'ats') => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getItemCount = (sectionId: string) => {
    switch (sectionId) {
      case 'experience':
        return resumeData.experience?.experiences?.length || 0;
      case 'education':
        return resumeData.education?.items?.length || 0;
      case 'projects':
        return resumeData.projects?.items?.length || 0;
      case 'skills':
        return resumeData.skills?.categories?.reduce((total: number, cat: any) => 
          total + (cat.skills?.length || 0), 0) || 0;
      case 'achievements':
        return resumeData.achievements?.items?.length || 0;
      case 'certifications':
        return resumeData.certifications?.items?.length || 0;
      default:
        return 0;
    }
  };

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-80'} fixed left-0 top-0 h-screen bg-card/50 backdrop-blur border-r transition-all duration-300 flex flex-col z-30`}>
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between min-h-[73px]">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold">Navigation</h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="h-8 w-8"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </Button>
      </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2">
            {sectionOrder.map((sectionId) => {
              const config = sectionConfig[sectionId as keyof typeof sectionConfig];
              const status = getCompletionStatus(sectionId);
              const isActive = activeSection === sectionId;
              const Icon = config.icon;

              return (
                <Card
                  key={sectionId}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-swiss ${
                    isActive 
                      ? 'border-primary shadow-accent bg-primary/5' 
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => onSectionChange(sectionId)}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          isActive 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{config.label}</h3>
                          <p className="text-xs text-muted-foreground">
                            {config.description}
                          </p>
                        </div>
                      </div>
                      {isActive && (
                        <ChevronRight className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      {getStatusBadge(status)}
                      <div className="text-xs text-muted-foreground">
                        {sectionId === 'experience' && `${resumeData.experience?.length || 0} items`}
                        {sectionId === 'education' && `${resumeData.education?.length || 0} items`}
                        {sectionId === 'projects' && `${resumeData.projects?.length || 0} items`}
                        {sectionId === 'skills' && `${resumeData.skills?.length || 0} skills`}
                        {sectionId === 'achievements' && `${resumeData.achievements?.length || 0} items`}
                        {sectionId === 'certifications' && `${resumeData.certifications?.length || 0} items`}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </ScrollArea>

              {/* Add Section Button */}
              <div className="p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center gap-2"
                  onClick={onAddCustomSection}
                >
                  <Plus className="w-4 h-4" />
                  Add Section
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* ATS Score Section */}
        <div>
          <Button
            variant="ghost"
            className={`w-full justify-start p-4 h-auto ${expandedSection === 'ats' ? 'bg-accent' : ''}`}
            onClick={() => toggleSection('ats')}
          >
            <div className="flex items-center w-full">
              <Target className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="ml-3 font-medium">ATS Score</span>
                  <div className="ml-auto flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">85%</Badge>
                    {expandedSection === 'ats' ? 
                      <ChevronDown className="w-4 h-4" /> : 
                      <ChevronRight className="w-4 h-4" />
                    }
                  </div>
                </>
              )}
            </div>
          </Button>

          {/* ATS Score Details - Only show when expanded and sidebar not collapsed */}
          {expandedSection === 'ats' && !isCollapsed && (
            <div className="max-h-[60vh] overflow-hidden hover:overflow-y-auto transition-all duration-200">
              <div className="p-2">
                <ATSScorePanel resumeData={resumeData} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}