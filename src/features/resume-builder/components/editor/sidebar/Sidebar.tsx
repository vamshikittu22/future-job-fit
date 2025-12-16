import { X, Menu } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Progress } from '@/shared/ui/progress';
import { SidebarProps } from '@/features/resume-builder/components/editor/sidebar/Sidebar.types';

export const Sidebar = ({
  sections,
  activeTab,
  onTabChange,
  completionPercentage,
  isMobileMenuOpen,
  onToggleMobileMenu,
}: SidebarProps) => {
  return (
    <div className="lg:col-span-1">
      <Card className="relative">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden absolute right-2 top-2 z-10"
          onClick={onToggleMobileMenu}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Sections</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Completion</span>
              <span className="text-muted-foreground">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>

          {/* Section list */}
          <div className="space-y-1">
            {sections.map((section) => {
              const IconComponent = typeof section.icon === 'function' ? section.icon : section.icon;
              return (
                <Button
                  key={section.id}
                  variant={activeTab === section.value ? 'secondary' : 'ghost'}
                  className={`w-full justify-start ${activeTab === section.value ? 'font-medium' : ''}`}
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
        </CardContent>
      </Card>
    </div>
  );
};
