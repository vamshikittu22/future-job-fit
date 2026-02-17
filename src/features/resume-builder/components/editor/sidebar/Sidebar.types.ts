import { Section } from '@/features/resume-builder/components/editor/types';

export interface SidebarProps {
  sections: Section[];
  activeTab: string;
  onTabChange: (value: string) => void;
  completionPercentage: number;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}
