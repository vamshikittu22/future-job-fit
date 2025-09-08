import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  User, 
  FileText, 
  Code, 
  Briefcase, 
  GraduationCap, 
  FolderOpen, 
  Trophy, 
  Award,
  ChevronRight
} from "lucide-react";

interface ResumeBuilderSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  sectionOrder: string[];
  resumeData: any;
}

const sectionConfig = {
  personal: {
    label: "Personal Info",
    icon: User,
    description: "Contact details"
  },
  summary: {
    label: "Professional Summary",
    icon: FileText,
    description: "Brief overview"
  },
  skills: {
    label: "Technical Skills",
    icon: Code,
    description: "Technologies & tools"
  },
  experience: {
    label: "Work Experience", 
    icon: Briefcase,
    description: "Job history"
  },
  education: {
    label: "Education",
    icon: GraduationCap,
    description: "Academic background"
  },
  projects: {
    label: "Projects",
    icon: FolderOpen,
    description: "Key projects"
  },
  achievements: {
    label: "Achievements",
    icon: Trophy,
    description: "Notable accomplishments"
  },
  certifications: {
    label: "Certifications",
    icon: Award,
    description: "Professional credentials"
  }
};

export default function ResumeBuilderSidebar({
  activeSection,
  onSectionChange,
  sectionOrder,
  resumeData
}: ResumeBuilderSidebarProps) {
  
  const getCompletionStatus = (sectionId: string) => {
    switch (sectionId) {
      case 'personal':
        const personal = resumeData.personalInfo;
        return personal.name && personal.email ? 'complete' : personal.name || personal.email ? 'partial' : 'empty';
      case 'summary':
        return resumeData.summary ? 'complete' : 'empty';
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
        return 'empty';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return <Badge variant="default" className="bg-green-100 text-green-800 text-xs">Complete</Badge>;
      case 'partial':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">Partial</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Empty</Badge>;
    }
  };

  return (
    <div className="w-80 border-r bg-card/50 backdrop-blur">
      <div className="sticky top-24 h-[calc(100vh-6rem)]">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold mb-2">Resume Sections</h2>
          <p className="text-sm text-muted-foreground">
            Click to edit • Drag to reorder
          </p>
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

        {/* Section Summary */}
        <div className="p-4 border-t bg-muted/30">
          <div className="text-xs text-muted-foreground mb-2">Progress</div>
          <div className="flex gap-2">
            {['complete', 'partial', 'empty'].map(status => {
              const count = sectionOrder.filter(id => getCompletionStatus(id) === status).length;
              return (
                <div key={status} className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${
                    status === 'complete' ? 'bg-green-500' :
                    status === 'partial' ? 'bg-yellow-500' : 'bg-muted-foreground'
                  }`} />
                  <span className="text-xs">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}