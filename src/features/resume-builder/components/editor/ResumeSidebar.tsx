import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Share2 } from "lucide-react";
import { Section } from "@/lib/types";

interface ResumeSidebarProps {
  sections: Section[];
  activeTab: string;
  onTabChange: (value: string) => void;
  onExportPDF: () => void;
  onShare: () => void;
}

export const ResumeSidebar = ({
  sections,
  activeTab,
  onTabChange,
  onExportPDF,
  onShare,
}: ResumeSidebarProps) => {
  return (
    <div className="lg:col-span-1">
      <Card>
        <CardHeader>
          <CardTitle>Sections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sections.map((section) => {
              const IconComponent = typeof section.icon === 'function' ? section.icon : section.icon;
              return (
                <Button
                  key={section.id}
                  variant={activeTab === section.value ? 'secondary' : 'ghost'}
                  className={`w-full justify-start ${activeTab === section.value ? 'bg-accent' : ''}`}
                  onClick={() => onTabChange(section.value)}
                >
                  <span className="mr-2">
                    {typeof IconComponent === 'function' && IconComponent.prototype?.render ? (
                      <IconComponent className="h-4 w-4" />
                    ) : typeof IconComponent === 'function' ? (
                      <IconComponent />
                    ) : null}
                  </span>
                  {section.title}
                </Button>
              );
            })}
          </div>
          <div className="mt-6 pt-4 border-t">
            <Button variant="outline" className="w-full mb-2" onClick={onExportPDF}>
              <FileText className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline" className="w-full" onClick={onShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeSidebar;
