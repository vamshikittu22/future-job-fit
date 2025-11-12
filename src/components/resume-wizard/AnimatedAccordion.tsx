import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface AnimatedAccordionProps {
  items: Array<{
    id: string;
    title: string;
    content: React.ReactNode;
    badge?: string;
    icon?: React.ReactNode;
  }>;
  defaultValue?: string;
  className?: string;
  type?: 'single' | 'multiple';
}

export const AnimatedAccordion: React.FC<AnimatedAccordionProps> = ({
  items,
  defaultValue,
  className,
  type = 'single',
}) => {
  const [expandedItems, setExpandedItems] = React.useState<string[]>(
    defaultValue ? [defaultValue] : []
  );
  const [lastNonEmptyItems, setLastNonEmptyItems] = React.useState(items && items.length > 0 ? items : []);
  React.useEffect(() => {
    if (items && Array.isArray(items) && items.length > 0) {
      setLastNonEmptyItems(items);
    }
  }, [items]);

  const showItems = items && Array.isArray(items) && items.length > 0 ? items : lastNonEmptyItems;

  const prefersReducedMotion = React.useMemo(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const handleValueChange = (value: string | string[]) => {
    if (Array.isArray(value)) {
      setExpandedItems(value);
    } else {
      setExpandedItems(value ? [value] : []);
    }
  };

  const itemVariants = {
    collapsed: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: prefersReducedMotion ? 0 : 0.2, ease: 'easeInOut' },
        opacity: { duration: prefersReducedMotion ? 0 : 0.15 },
      },
    },
    expanded: {
      height: 'auto',
      opacity: 1,
      transition: {
        height: { duration: prefersReducedMotion ? 0 : 0.2, ease: 'easeInOut' },
        opacity: { duration: prefersReducedMotion ? 0 : 0.2, delay: 0.05 },
      },
    },
  };

  // Render appropriate accordion based on type
  if (type === 'single') {
    if (!showItems || showItems.length === 0) {
      return <div className="text-muted-foreground text-center py-8">No sections to display.</div>;
    }
    return (
      <Accordion
        type="single"
        collapsible
        value={expandedItems[0] || ''}
        onValueChange={(v: string) => handleValueChange(v)}
        className={cn('w-full', className)}
      >
      {showItems.map((item) => {
        const isExpanded = expandedItems.includes(item.id);
        return (
          <AccordionItem key={item.id} value={item.id} className="border-b">
            <AccordionTrigger
              className={cn(
                'group relative py-4 px-4 hover:bg-accent/50 transition-colors rounded-t-lg',
                isExpanded && 'bg-accent/30'
              )}
            >
              <div className="flex items-center gap-3 flex-1">
                {item.icon && (
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                  >
                    {item.icon}
                  </motion.div>
                )}
                <span className="text-left font-medium">{item.title}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto mr-2">
                    {item.badge}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2">
              <AnimatePresence mode="wait">
                {isExpanded && (
                  <motion.div
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    variants={itemVariants}
                  >
                    {item.content}
                  </motion.div>
                )}
              </AnimatePresence>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
    );
  }

  // Multiple type accordion (not fully implemented, defaults to single for now)
  return (
    <Accordion
      type="single"
      collapsible
      value={expandedItems[0] || ''}
      onValueChange={(v: string) => handleValueChange(v)}
      className={cn('w-full', className)}
    >
      {showItems.map((item) => {
        const isExpanded = expandedItems.includes(item.id);
        return (
          <AccordionItem key={item.id} value={item.id} className="border-b">
            <AccordionTrigger
              className={cn(
                'group relative py-4 px-4 hover:bg-accent/50 transition-colors rounded-t-lg',
                isExpanded && 'bg-accent/30'
              )}
            >
              <div className="flex items-center gap-3 flex-1">
                {item.icon && (
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                  >
                    {item.icon}
                  </motion.div>
                )}
                <span className="text-left font-medium">{item.title}</span>
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto mr-2">
                    {item.badge}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2">
              <AnimatePresence mode="wait">
                {isExpanded && (
                  <motion.div
                    initial="collapsed"
                    animate="expanded"
                    exit="collapsed"
                    variants={itemVariants}
                  >
                    {item.content}
                  </motion.div>
                )}
              </AnimatePresence>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default AnimatedAccordion;
