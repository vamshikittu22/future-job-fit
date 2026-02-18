import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Briefcase, FileText, Target } from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import JDAnalyzerPanel from '@/features/job-optimizer/components/JDAnalyzerPanel';
import JDInputPanel from '@/features/job-optimizer/components/JDInputPanel';
import MatchComparisonPanel from '@/features/job-optimizer/components/MatchComparisonPanel';
import ResumePanelV2 from '@/features/job-optimizer/components/ResumePanelV2';
import { usePanelLayout } from '@/features/job-optimizer/hooks/usePanelLayout';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';

type MobilePanel = 'resume' | 'jd' | 'match';

const MOBILE_TAB_ITEMS: Array<{ value: MobilePanel; label: string; icon: typeof FileText }> = [
  { value: 'resume', label: 'Resume', icon: FileText },
  { value: 'jd', label: 'JD Analysis', icon: Briefcase },
  { value: 'match', label: 'Match', icon: Target },
];

function renderActiveMobilePanel(panel: MobilePanel) {
  if (panel === 'resume') {
    return <ResumePanelV2 />;
  }

  if (panel === 'jd') {
    return <JDAnalyzerPanel />;
  }

  return <MatchComparisonPanel />;
}

export default function JobOptimizerLayout() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [activePanel, setActivePanel] = useState<MobilePanel>('resume');
  const { layout, updateHorizontal, updateVertical } = usePanelLayout();

  const handleHorizontalLayoutChange = (sizes: number[]) => {
    if (isMobile) {
      return;
    }

    updateHorizontal(sizes);
  };

  const handleVerticalLayoutChange = (sizes: number[]) => {
    if (isMobile) {
      return;
    }

    updateVertical(sizes);
  };

  if (isMobile) {
    return (
      <div className="flex h-full min-h-0 flex-col">
        <Tabs value={activePanel} onValueChange={(value) => setActivePanel(value as MobilePanel)} className="flex h-full min-h-0 flex-col">
          <TabsList className="grid h-12 w-full grid-cols-3 rounded-none border-b bg-card p-1">
            {MOBILE_TAB_ITEMS.map((item) => {
              const Icon = item.icon;

              return (
                <TabsTrigger key={item.value} value={item.value} className="gap-1 text-xs">
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <div className="relative flex-1 overflow-hidden p-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePanel}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="h-full"
              >
                {renderActiveMobilePanel(activePanel)}
              </motion.div>
            </AnimatePresence>
          </div>
        </Tabs>
      </div>
    );
  }

  return (
    <PanelGroup direction="horizontal" onLayout={handleHorizontalLayoutChange} className="h-full min-h-0">
      <Panel defaultSize={layout.horizontal[0]} minSize={30} maxSize={55} id="input-panel" className="min-h-0">
        <div className="flex h-full min-h-0 flex-col gap-2 p-2">
          <div className="min-h-0 flex-1">
            <ResumePanelV2 />
          </div>
          <div className="min-h-0 flex-1">
            <JDInputPanel />
          </div>
        </div>
      </Panel>

      <PanelResizeHandle className="w-1 bg-border transition-colors hover:bg-accent data-[dragging=true]:bg-accent" />

      <Panel defaultSize={layout.horizontal[1]} minSize={45} id="analysis-panels" className="min-h-0">
        <PanelGroup direction="vertical" onLayout={handleVerticalLayoutChange} className="h-full min-h-0">
          <Panel defaultSize={layout.vertical[0]} minSize={30} id="jd-analyzer-panel" className="min-h-0 p-2">
            <JDAnalyzerPanel />
          </Panel>

          <PanelResizeHandle className="h-1 bg-border transition-colors hover:bg-accent data-[dragging=true]:bg-accent" />

          <Panel defaultSize={layout.vertical[1]} minSize={30} id="match-panel" className="min-h-0 p-2">
            <MatchComparisonPanel />
          </Panel>
        </PanelGroup>
      </Panel>
    </PanelGroup>
  );
}
