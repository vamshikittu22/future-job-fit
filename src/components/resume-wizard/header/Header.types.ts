import { ButtonHTMLAttributes } from 'react';

export interface HeaderProps {
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onToggleTheme: () => void;
  onTogglePreview: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isSaving: boolean;
  isDarkMode: boolean;
  isPreviewOpen: boolean;
}

export interface HeaderButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  showLabel?: boolean;
}
