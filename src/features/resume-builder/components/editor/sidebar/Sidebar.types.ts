import { Section } from '../types';

export interface SidebarProps {
  sections: Section[];
  activeTab: string;
  onTabChange: (value: string) => void;
  completionPercentage: number;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}
