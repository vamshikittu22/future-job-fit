import React from 'react';
import { SwissSection } from './BaseComponents';

export const PerformanceSection: React.FC = () => {
    return (
        <SwissSection
            number="03"
            id="performance"
            title="PERFORMANCE."
            subtitle="PRECISION & SPEED"
            accentColor="bg-orange-600"
            titleClassName="text-orange-950 dark:text-orange-100"
            subtitleClassName="text-orange-600 dark:text-orange-400"
            className="relative bg-orange-50/50 dark:bg-orange-900/5 group/section"
            description="Every interaction feels instant. We optimize for perceived performance—what users feel matters more than raw benchmarks."
        >
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-orange-500/5 to-transparent pointer-events-none" />

            <div className="space-y-8 relative z-10">
                {/* Hero Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { metric: '<50ms', label: 'Hot Reload', detail: 'Vite HMR' },
                        { metric: '60fps', label: 'Animations', detail: 'Framer Motion' },
                        { metric: '~2KB', label: 'State Size', detail: 'Minimal payloads' },
                        { metric: '0ms', label: 'Offline Save', detail: 'localStorage' }
                    ].map((item, i) => (
                        <div key={i} className="p-6 bg-gradient-to-br from-orange-500 to-amber-600 text-white text-center group hover:scale-105 transition-transform duration-300">
                            <div className="text-3xl font-black italic">{item.metric}</div>
                            <div className="text-xs font-mono uppercase tracking-widest mt-1 text-orange-100">{item.label}</div>
                            <div className="text-[9px] font-mono text-orange-200/70 mt-2">{item.detail}</div>
                        </div>
                    ))}
                </div>

                {/* Two Column Explanation */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Development Speed */}
                    <div className="p-8 bg-white/50 dark:bg-slate-900/50 border border-orange-200/50 dark:border-orange-800/50 space-y-4">
                        <div className="flex items-center gap-4 text-orange-600 dark:text-orange-400 font-mono text-[10px] font-black uppercase tracking-[0.3em]">
                            // DEV_EXPERIENCE
                        </div>
                        <h4 className="text-lg font-bold text-foreground">Build Fast, Ship Faster</h4>
                        <p className="text-sm text-foreground/70 leading-relaxed">
                            Vite's ESBuild-powered bundler means changes appear in under 50 milliseconds. No waiting for webpack to churn through dependencies. This isn't just developer convenience—it translates to faster feature delivery and shorter feedback loops with stakeholders.
                        </p>
                        <div className="flex gap-2">
                            {['ESBuild', 'Vite', 'TypeScript'].map(t => (
                                <span key={t} className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-[10px] font-mono">{t}</span>
                            ))}
                        </div>
                    </div>

                    {/* User Experience */}
                    <div className="p-8 bg-white/50 dark:bg-slate-900/50 border border-orange-200/50 dark:border-orange-800/50 space-y-4">
                        <div className="flex items-center gap-4 text-orange-600 dark:text-orange-400 font-mono text-[10px] font-black uppercase tracking-[0.3em]">
                            // USER_EXPERIENCE
                        </div>
                        <h4 className="text-lg font-bold text-foreground">Buttery Smooth Interactions</h4>
                        <p className="text-sm text-foreground/70 leading-relaxed">
                            React 18's concurrent rendering prioritizes visible updates. Framer Motion uses spring physics (not CSS timings) for natural-feeling animations. Users never see spinners for local operations—saves happen silently in the background via debounced writes.
                        </p>
                        <div className="flex gap-2">
                            {['React 18', 'Framer Motion', 'Debounce'].map(t => (
                                <span key={t} className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-[10px] font-mono">{t}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Why It Matters (for recruiters) */}
                <div className="p-6 bg-white/30 dark:bg-slate-900/30 border border-orange-200/30 dark:border-orange-800/30">
                    <h4 className="text-sm font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wide mb-3">Why This Matters for Hiring</h4>
                    <p className="text-sm text-foreground/70 leading-relaxed">
                        <strong className="text-foreground">Performance is a feature, not an afterthought.</strong> Candidates using a sluggish resume builder will abandon it. By investing in instant feedback (sub-50ms saves, 60fps animations), we reduce friction in the user journey. The result: higher completion rates for resume submissions and a polished experience that reflects well on your employer brand.
                    </p>
                </div>
            </div>
        </SwissSection>
    );
};
