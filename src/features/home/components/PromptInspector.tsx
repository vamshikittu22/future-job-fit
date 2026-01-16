import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Terminal, FileJson, Sparkles } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

const PromptInspector: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'input' | 'prompt' | 'output'>('input');

    const content = {
        input: {
            label: 'RAW_USER_INPUT.txt',
            icon: <Terminal className="w-4 h-4" />,
            text: `> ROLE: Senior Frontend Dev
> COMPANY: TechCorp Inc.
> DESCRIPTION:
"i accepted this job in 2021. mostly worked on the dashboard using react. we improved loading times by a lot, maybe 50%. i also managed 2 juniors and did code reviews daily. the team used jira for tracking."`
        },
        prompt: {
            label: 'SYSTEM_INSTRUCTION.md',
            icon: <Sparkles className="w-4 h-4 text-accent" />,
            text: `### INSTRUCTION_SET: v2.4
You are an expert ATS Optimization Engine. 
TASK: Rewrite user input into high-impact, measurable bullets.
CONSTRAINTS:
- Use active voice (e.g., "Architected", "Spearheaded").
- Quantify impact where possible (extract numbers).
- Map "React" to specific technical competencies.
- Enforce "Star Format" (Situation, Task, Action, Result).

### ACTION:
Transform "improved loading times by a lot, maybe 50%" 
INTO -> "Optimized dashboard rendering performance by 50%..."`
        },
        output: {
            label: 'PARSED_RESULT.json',
            icon: <FileJson className="w-4 h-4 text-green-400" />,
            text: `{
  "role": "Senior Frontend Developer",
  "company": "TechCorp Inc.",
  "bullets": [
    {
      "content": "Engineered a high-performance React dashboard, achieving a 50% reduction in Time-to-Interactive (TTI) through code splitting and memoization.",
      "metrics": ["50% reduction", "Time-to-Interactive"],
      "skills_detected": ["React", "Performance Optimization", "Code Splitting"]
    },
    {
      "content": "Mentored 2 junior engineers through daily code reviews, enforcing strict TypeScript standards and reducing bug regression by 25%.",
      "metrics": ["2 junior engineers", "25% reduction"],
      "skills_detected": ["Mentorship", "Code Review", "TypeScript"]
    }
  ],
  "ats_score_prediction": 94
}`
        }
    };

    return (
        <div className="w-full border border-white/10 bg-black/50 backdrop-blur-sm overflow-hidden font-mono text-sm relative group">
            {/* Decorative Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                    </div>
                    <span className="text-xs text-muted-foreground ml-2">~/engine/logic_inspector</span>
                </div>
                <div className="text-[10px] text-accent opacity-50 uppercase tracking-widest">
                    READ_ONLY
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10">
                {(Object.keys(content) as Array<keyof typeof content>).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-wider transition-all relative overflow-hidden",
                            activeTab === tab
                                ? "bg-accent/10 text-accent font-bold"
                                : "text-muted-foreground hover:bg-white/5 hover:text-white"
                        )}
                    >
                        {content[tab].icon}
                        {content[tab].label}
                        {activeTab === tab && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Code Display */}
            <div className="p-6 h-[400px] overflow-auto relative bg-[#0a0a0a]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="whitespace-pre-wrap leading-relaxed text-xs md:text-sm"
                    >
                        {activeTab === 'input' && (
                            <span className="text-gray-300">{content.input.text}</span>
                        )}

                        {activeTab === 'prompt' && (
                            <div>
                                {content.prompt.text.split('\n').map((line, i) => (
                                    <div key={i}>
                                        {line.startsWith('#') ? (
                                            <span className="text-accent font-bold">{line}</span>
                                        ) : line.includes('task:') || line.includes('constraints:') ? (
                                            <span className="text-blue-400 font-bold uppercase">{line}</span>
                                        ) : (
                                            <span className="text-gray-400">{line}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'output' && (
                            <span className="text-green-400/90 font-medium">
                                {content.output.text}
                            </span>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer Info */}
            <div className="px-4 py-2 bg-white/5 border-t border-white/10 flex justify-between items-center text-[10px] text-muted-foreground">
                <span>Ln 1, Col 1</span>
                <span className="uppercase">{activeTab === 'output' ? 'JSON' : activeTab === 'prompt' ? 'MARKDOWN' : 'PLAINTEXT'}</span>
            </div>
        </div>
    );
};

export default PromptInspector;
