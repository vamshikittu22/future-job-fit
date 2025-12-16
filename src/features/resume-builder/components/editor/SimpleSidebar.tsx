import { Button } from '@/shared/ui/button';
import { FileText, Briefcase, GraduationCap, Code2, FolderOpen, Award, Sparkles } from 'lucide-react';

interface SimpleSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const sections = [
  { id: 'personal', title: 'Personal Info', icon: <FileText className="h-4 w-4 mr-2" /> },
  { id: 'experience', title: 'Experience', icon: <Briefcase className="h-4 w-4 mr-2" /> },
  { id: 'education', title: 'Education', icon: <GraduationCap className="h-4 w-4 mr-2" /> },
  { id: 'skills', title: 'Skills', icon: <Code2 className="h-4 w-4 mr-2" /> },
  { id: 'projects', title: 'Projects', icon: <FolderOpen className="h-4 w-4 mr-2" /> },
  { id: 'certifications', title: 'Certifications', icon: <Award className="h-4 w-4 mr-2" /> },
  { id: 'ats', title: 'ATS Score', icon: <Sparkles className="h-4 w-4 mr-2" /> },
];

export const SimpleSidebar = ({ activeTab, onTabChange }: SimpleSidebarProps) => {
  return (
    <div className="w-64 bg-white border-r h-screen fixed left-0 top-0 pt-16 overflow-y-auto z-10">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Resume Sections</h2>
        <div className="space-y-1">
          {sections.map((section) => (
            <Button
              key={section.id}
              variant={activeTab === section.id ? 'secondary' : 'ghost'}
              className={`w-full justify-start ${activeTab === section.id ? 'bg-gray-100' : ''}`}
              onClick={() => onTabChange(section.id)}
            >
              {section.icon}
              {section.title}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SimpleSidebar;
