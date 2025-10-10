import { X, Menu } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SidebarProps } from './Sidebar.types';

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
            {sections.map((section) => (
              <Button
                key={section.id}
                variant={activeTab === section.value ? 'secondary' : 'ghost'}
                className={`w-full justify-start ${activeTab === section.value ? 'font-medium' : ''}`}
                onClick={() => onTabChange(section.value)}
              >
                <span className="mr-2">{section.icon}</span>
                {section.title}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
