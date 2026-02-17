import React from 'react';
import { Badge } from '@/shared/ui/badge';
import { SwissSection } from './BaseComponents';

export const StrategySection: React.FC = () => {
    return (
        <SwissSection
            number="09"
            id="dev-logs"
            title="INSIGHT."
            subtitle="TRANSPARENT BLUEPRINT"
            accentColor="bg-amber-600"
            titleClassName="text-amber-950 dark:text-amber-100"
            subtitleClassName="text-amber-600 dark:text-amber-400"
            className="relative bg-amber-50/50 dark:bg-amber-900/5 group/section"
            description="Our architecture is an open book. We provide full transparency into our decision-making process, ensuring you understand exactly how our platform protects candidate data and drives efficiency."
        >
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-amber-500/5 to-transparent pointer-events-none" />

            <div className="space-y-8 relative z-10">
                {/* Decision Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[
                        {
                            title: 'AI ARCHITECTURE',
                            problem: 'LLM calls are slow (~800ms) and expensive per-request.',
                            solution: 'Edge Functions as AI gateway—secure API keys, serverless scaling.',
                            rejected: 'Direct client API calls',
                            outcome: 'API keys never exposed, pay-per-use pricing'
                        },
                        {
                            title: 'STATE MANAGEMENT',
                            problem: 'Redux/Zustand add complexity for a form-heavy app.',
                            solution: 'React Context + localStorage with 500ms debounce.',
                            rejected: 'Redux, Zustand',
                            outcome: 'Simple, zero npm dependencies for state'
                        },
                        {
                            title: 'EXPORT PIPELINE',
                            problem: 'Server-side PDF generation requires uploads.',
                            solution: 'Client-side jsPDF/docx—no data leaves the browser.',
                            rejected: 'Server PDF APIs',
                            outcome: '100% offline-capable exports'
                        },
                        {
                            title: 'SKILL CATEGORIZATION',
                            problem: 'AI-only is slow; regex-only misses edge cases.',
                            solution: 'Local pattern matching first, AI fallback for ambiguous skills.',
                            rejected: 'Pure cloud AI',
                            outcome: '80% instant, 20% AI-assisted'
                        }
                    ].map((item, i) => (
                        <div key={i} className="p-6 bg-white/50 dark:bg-slate-900/50 border border-amber-200/50 dark:border-amber-800/50 hover:border-amber-500/50 transition-colors space-y-4">
                            <h4 className="text-sm font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">{item.title}</h4>

                            <div className="space-y-3">
                                <div>
                                    <span className="text-[9px] text-red-500 font-bold uppercase">Problem</span>
                                    <p className="text-xs text-foreground/70">{item.problem}</p>
                                </div>
                                <div>
                                    <span className="text-[9px] text-green-500 font-bold uppercase">Solution</span>
                                    <p className="text-xs text-foreground font-medium">{item.solution}</p>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-amber-200/30 dark:border-amber-800/30 flex justify-between items-center">
                                <span className="text-[9px] text-muted-foreground line-through">❌ {item.rejected}</span>
                                <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-[9px]">✓</Badge>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Why It Matters */}
                <div className="p-6 bg-white/30 dark:bg-slate-900/30 border border-amber-200/30 dark:border-amber-800/30">
                    <h4 className="text-sm font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-3">Why Transparency Matters for Business</h4>
                    <p className="text-sm text-foreground/70 leading-relaxed">
                        <strong className="text-foreground">Transparency builds institutional trust.</strong> When evaluating career platforms, you need to know how they work "under the hood." These decision records prove that we made deliberate, outcomes-focused choices—optimizing for speed, security, and the ultimate candidate experience.
                    </p>
                </div>
            </div>
        </SwissSection>
    );
};
