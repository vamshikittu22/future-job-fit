import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AIEnhanceButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  children?: React.ReactNode;
}

export const AIEnhanceButton = ({
  onClick,
  isLoading = false,
  size = 'sm',
  variant = 'outline',
  children = 'AI Enhance',
}: AIEnhanceButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      size={size}
      variant={variant}
      className="gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4" />
      )}
      {children}
    </Button>
  );
};
