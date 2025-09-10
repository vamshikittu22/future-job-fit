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
        const personal = resumeData.personalInfo || {};
        return personal.name && personal.email ? 'complete' : 'incomplete';
      case 'summary':
        return resumeData.summary ? 'complete' : 'incomplete';
      case 'skills':
        return (resumeData.skills || []).length > 0 ? 'complete' : 'incomplete';
      case 'experience':
        return (resumeData.experience || []).length > 0 ? 'complete' : 'incomplete';
      case 'education':
        return (resumeData.education || []).length > 0 ? 'complete' : 'incomplete';
      case 'projects':
        return (resumeData.projects || []).length > 0 ? 'complete' : 'incomplete';
      case 'achievements':
        return (resumeData.achievements || []).length > 0 ? 'complete' : 'incomplete';
      case 'certifications':
        return (resumeData.certifications || []).length > 0 ? 'complete' : 'incomplete';
      default:
        return 'incomplete';
    }
  };

  const getSectionItemCount = (sectionId: string) => {
    switch (sectionId) {
      case 'skills':
        return (resumeData.skills || []).length;
      case 'experience':
        return (resumeData.experience || []).length;
      case 'education':
        return (resumeData.education || []).length;
      case 'projects':
        return (resumeData.projects || []).length;
      case 'achievements':
        return (resumeData.achievements || []).length;
      case 'certifications':
        return (resumeData.certifications || []).length;
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

      <div className="flex-1 overflow-hidden">
        {/* Resume Section */}
        <div className="border-b">
          <Button
            variant="ghost"
            className={`w-full justify-start p-4 h-auto ${expandedSection === 'resume' ? 'bg-accent' : ''}`}
            onClick={() => toggleSection('resume')}
          >
            <div className="flex items-center w-full">
              <FileText className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="ml-3 font-medium">Resume</span>
                  <div className="ml-auto">
                    {expandedSection === 'resume' ? 
                      <ChevronDown className="w-4 h-4" /> : 
                      <ChevronRight className="w-4 h-4" />
                    }
                  </div>
                </>
              )}
            </div>
          </Button>

          {/* Resume Sections - Only show when expanded and sidebar not collapsed */}
          {expandedSection === 'resume' && !isCollapsed && (
            <div className="max-h-[60vh] overflow-hidden hover:overflow-y-auto transition-all duration-200">
              <div className="p-2 space-y-1">
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="sidebarSections">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-1">
                        {localSectionOrder.map((sectionId, index) => {
                          const config = sectionConfig[sectionId as keyof typeof sectionConfig];
                          if (!config) return null;
                          
                          const status = getCompletionStatus(sectionId);
                          const isActive = activeSection === sectionId;
                          const Icon = config.icon;
                          const itemCount = getSectionItemCount(sectionId);

                          return (
                            <Draggable key={sectionId} draggableId={sectionId} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className="group relative"
                                >
                                  <Button
                                    variant={isActive ? 'secondary' : 'ghost'}
                                    size="sm"
                                    className={`w-full justify-start h-auto py-2 px-2 transition-colors ${
                                      isActive ? 'bg-accent' : 'hover:bg-accent/50'
                                    }`}
                                    onClick={() => onSectionChange(sectionId)}
                                  >
                                    <div className="flex items-center w-full">
                                      <div 
                                        className="p-1 rounded-md mr-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
                                        {...provided.dragHandleProps}
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <GripVertical className="w-3.5 h-3.5 text-muted-foreground" />
                                      </div>
                                      
                                      <div className={`flex items-center justify-center w-8 h-8 rounded-md mr-2 flex-shrink-0 ${
                                        isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                      }`}>
                                        <Icon className="w-4 h-4" />
                                      </div>
                                      
                                      <div className="flex-1 min-w-0 text-left">
                                        <div className="flex items-center justify-between">
                                          <span className="truncate text-sm font-medium">{config.label}</span>
                                          {isActive && <ChevronRight className="w-4 h-4 ml-2 flex-shrink-0" />}
                                        </div>
                                        <div className="flex items-center justify-between mt-0.5">
                                          <span className="text-xs text-muted-foreground truncate">
                                            {itemCount > 0 ? `${itemCount} ${itemCount === 1 ? 'item' : 'items'}` : config.description}
                                          </span>
                                          {getStatusBadge(status)}
                                        </div>
                                      </div>
                                    </div>
                                  </Button>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>

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
