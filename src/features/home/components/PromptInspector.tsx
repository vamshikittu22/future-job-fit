import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, FileJson, Sparkles } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const PromptInspector: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'input' | 'prompt' | 'output'>('input');

    const content = {
        input: {
            label: 'INPUT.RAW',
            icon: <Terminal className="w-4 h-4" />,
            text: `> ROLE: Senior Frontend Dev
> COMPANY: TechCorp Inc.
> DESCRIPTION:
"i accepted this job in 2021. mostly worked on the dashboard using react. we improved loading times by a lot, maybe 50%. i also managed 2 juniors and did code reviews daily."`
        },
        prompt: {
            label: 'SYSTEM.MD',
            icon: <Sparkles className="w-4 h-4" />,
            text: `### CONFIG_V2.4
TASK: Transform raw input into high-impact bullets.

CONSTRAINTS:
- QUANTIFY_IMPACT: YES
- ACTIVE_VOICE: ENFORCED
- SKILL_MAPPING: REACT -> PERFORMANCE
- FORMAT: STAR_PROTOCOL

### LOGIC_BRANCH:
Transform "improved loading times"
TO -> "Engineered performance optimizations..."`
        },
        output: {
            label: 'RESULT.JSON',
            icon: <FileJson className="w-4 h-4" />,
            text: `{
  "role": "Senior Frontend Developer",
  "company": "TechCorp Inc.",
  "bullets": [
    {
      "content": "Engineered a high-performance React dashboard, achieving a 50% reduction in TTI.",
      "skills": ["Performance", "React"]
    },
    {
      "content": "Mentored 2 junior engineers through daily code reviews.",
      "skills": ["Mentorship", "TypeScript"]
    }
  ]
}`
        }
    };

    return (
        <div className="w-full border border-muted/20 bg-background transition-colors duration-500 overflow-hidden font-sans group shadow-2xl">
            {/* Swiss Header */}
            <div className="flex bg-muted/5 border-b border-muted/20">
                {(Object.keys(content) as Array<keyof typeof content>).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "group/tab flex items-center gap-3 px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative",
                            activeTab === tab
                                ? "text-foreground"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/5"
                        )}
                    >
                        {content[tab].icon}
                        <span className="relative z-10">{content[tab].label}</span>
                        {activeTab === tab && (
                            <motion.div
                                layoutId="activeTabUnderline"
                                className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary z-20"
                            />
                        )}
                        <div className="absolute inset-0 bg-primary/5 scale-x-0 group-hover/tab:scale-x-100 transition-transform origin-left" />
                    </button>
                ))}
            </div>

            {/* Code Body */}
            <div className="p-8 h-[350px] overflow-auto relative bg-background/50 font-mono">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.3, ease: "circOut" }}
                        className="whitespace-pre-wrap leading-relaxed text-xs"
                    >
                        {activeTab === 'input' && (
                            <span className="text-muted-foreground">{content.input.text}</span>
                        )}

                        {activeTab === 'prompt' && (
                            <div className="space-y-4">
                                {content.prompt.text.split('\n').map((line, i) => (
                                    <div key={i} className={cn(
                                        line.startsWith('###') ? "text-primary font-black text-sm pt-4" :
                                            line.startsWith('TASK:') || line.startsWith('CONSTRAINTS:') ? "text-foreground font-bold" :
                                                "text-muted-foreground"
                                    )}>
                                        {line}
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'output' && (
                            <span className="text-emerald-500 font-medium">
                                {content.output.text}
                            </span>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Swiss Grid Pattern overlay in body */}
                <div className="absolute inset-0 bg-[radial-gradient(#80808012_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-20" />
            </div>

            {/* Swiss Footer */}
            <div className="px-8 py-3 bg-muted/5 border-t border-muted/20 flex justify-between items-center text-[9px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em]">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-primary">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                        ENGINE_CONNECTED
                    </span>
                    <span>LNG_JS_CORE</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="bg-primary/10 text-primary px-2 py-0.5">UTF-8</span>
                    <span>{activeTab.toUpperCase()}</span>
                </div>
            </div>
        </div>
    );
};

export default PromptInspector;
