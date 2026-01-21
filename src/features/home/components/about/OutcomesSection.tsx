import React from 'react';
import { SwissSection } from './BaseComponents';

export const OutcomesSection: React.FC = () => {
    return (
        <SwissSection
            number="11"
            id="meta"
            title="OUTCOMES."
            subtitle="BUSINESS IMPACT"
            accentColor="bg-red-600"
            titleClassName="text-red-950 dark:text-red-100"
            subtitleClassName="text-red-600 dark:text-red-400"
            className="relative bg-red-50/50 dark:bg-red-900/5 group/section"
            description="Technology is a means to an end. Here's how all of the above translates into real value for your hiring process."
        >
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-red-500/5 to-transparent pointer-events-none" />

            <div className="space-y-8 relative z-10">
                {/* Value Props Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        {
                            title: 'Better Resume Quality',
                            desc: 'AI-enhanced bullet points, organized skills, and structured data mean candidates submit cleaner, more parseable resumes.',
                            icon: '✨'
                        },
                        {
                            title: 'Faster Submissions',
                            desc: 'Sub-50ms saves and instant previews reduce friction. Candidates complete resumes faster, reducing drop-off.',
                            icon: '⚡'
                        },
                        {
                            title: 'ATS Compatibility',
                            desc: '7 export formats including plain text ensure resumes parse correctly in any applicant tracking system.',
                            icon: '🎯'
                        },
                        {
                            title: 'Zero Privacy Risk',
                            desc: 'All data stays in the browser. API keys are server-side. No candidate PII stored on third-party servers.',
                            icon: '🔒'
                        },
                        {
                            title: 'Infinite Scale',
                            desc: 'Static hosting + CDN means 10,000 concurrent users cost the same as 10. Launch campaigns without infrastructure fear.',
                            icon: '📈'
                        },
                        {
                            title: 'Works Offline',
                            desc: 'Candidates can draft resumes without internet. Auto-saves to localStorage. No lost work.',
                            icon: '📴'
                        }
                    ].map((item, i) => (
                        <div key={i} className="p-6 bg-white/50 dark:bg-slate-900/50 border border-red-200/50 dark:border-red-800/50 hover:border-red-500/50 transition-colors space-y-3 group">
                            <div className="text-3xl">{item.icon}</div>
                            <h4 className="text-lg font-bold text-foreground group-hover:text-red-600 transition-colors">{item.title}</h4>
                            <p className="text-sm text-foreground/70 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Performance Badges */}
                <div className="p-6 bg-gradient-to-br from-red-600 to-rose-700 text-white">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { label: 'Performance', value: '95+', detail: 'Production Target' },
                            { label: 'Accessibility', value: '94', detail: 'WCAG 2.1 Compliant' },
                            { label: 'Best Practices', value: '100', detail: 'System Health' },
                            { label: 'SEO Audit', value: '100', detail: 'Indexable Data' }
                        ].map((badge, i) => (
                            <div key={i} className="text-center px-4 py-4 bg-white/10 backdrop-blur border border-white/10 group/badge">
                                <div className="text-3xl font-black italic group-hover:scale-110 transition-transform">{badge.value}</div>
                                <div className="text-[10px] font-mono uppercase tracking-widest text-red-100 mt-1">{badge.label}</div>
                                <div className="text-[8px] font-mono text-red-200/60 uppercase">{badge.detail}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Core Web Vitals */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { label: 'TBT', value: '490ms', desc: 'Total Blocking Time' },
                        { label: 'CLS', value: '0.11', desc: 'Cumulative Layout Shift' },
                        { label: 'FID', value: '<50ms', desc: 'First Input Delay' }
                    ].map((stat, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-red-100/20 dark:bg-red-900/10 border border-red-200/20 dark:border-red-800/20">
                            <div>
                                <div className="text-xs font-mono text-red-600 dark:text-red-400">{stat.label}</div>
                                <div className="text-sm font-bold text-foreground/70">{stat.desc}</div>
                            </div>
                            <div className="text-xl font-black italic text-red-600 dark:text-red-400">{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* Final Call */}
                <div className="p-8 bg-white/30 dark:bg-slate-900/30 border border-red-200/30 dark:border-red-800/30 text-center">
                    <h4 className="text-xl font-bold text-foreground mb-4">Built for Hiring Teams</h4>
                    <p className="text-sm text-foreground/70 leading-relaxed max-w-2xl mx-auto">
                        This isn't a weekend project—it's production-grade software. We've made deliberate architectural choices (documented above) to create a resume builder that's fast, secure, accessible, and scales with your hiring needs. Every technical decision maps to a business outcome that helps you find better candidates, faster.
                    </p>
                </div>
            </div>
        </SwissSection>
    );
};
