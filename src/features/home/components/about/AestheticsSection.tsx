import React from 'react';
import { Badge } from '@/shared/ui/badge';
import { Palette } from 'lucide-react';
import { SwissSection } from './BaseComponents';

export const AestheticsSection: React.FC = () => {
    return (
        <SwissSection
            number="08"
            id="design-system"
            title="IMPACT."
            subtitle="PROFESSIONAL INTERFACE"
            accentColor="bg-slate-700"
            titleClassName="text-slate-900 dark:text-slate-100"
            subtitleClassName="text-slate-500 dark:text-slate-400"
            className="relative bg-slate-50/50 dark:bg-slate-900/5 group/section"
            description="Our design system is built for clarity and impact. Every element is refined to project a premium, professional image, ensuring candidates feel confident in the quality of their submission."
        >
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49%,rgba(100,116,139,0.03)_50%,transparent_51%)] bg-[size:100%_100%] pointer-events-none" />

            <div className="space-y-8 relative z-10">
                {/* Stack Overview */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                        { name: 'Tailwind CSS', type: 'Styling', desc: 'Utility-first CSS' },
                        { name: 'Shadcn/ui', type: 'Components', desc: 'Pre-styled Radix' },
                        { name: 'Radix UI', type: 'Primitives', desc: 'Accessible base' },
                        { name: 'Framer Motion', type: 'Animation', desc: 'Spring physics' },
                        { name: 'next-themes', type: 'Dark Mode', desc: 'System preference' }
                    ].map((item, i) => (
                        <div key={i} className="p-4 bg-white/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 hover:border-slate-400/50 transition-colors group hover:scale-105 duration-300">
                            <div className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest">{item.type}</div>
                            <div className="text-sm font-bold text-foreground mt-1">{item.name}</div>
                            <div className="text-[10px] text-muted-foreground/70 mt-1">{item.desc}</div>
                        </div>
                    ))}
                </div>

                {/* Two Column */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Accessibility */}
                    <div className="p-8 bg-white/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 space-y-4">
                        <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 font-mono text-[10px] font-black uppercase tracking-[0.3em]">
                            // INCLUSIVE_DESIGN
                        </div>
                        <h4 className="text-lg font-bold text-foreground">Built-In A11y</h4>
                        <p className="text-sm text-foreground/70 leading-relaxed">
                            Every interactive component from Radix UI ships with keyboard navigation, focus management, and ARIA attributes. Modals trap focus. Dropdowns support arrow keys. Screen readers announce state changes.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {['Keyboard Nav', 'Focus Trap', 'ARIA Labels', 'Screen Reader'].map(t => (
                                <span key={t} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-mono">{t}</span>
                            ))}
                        </div>
                    </div>

                    {/* Dark Mode Card */}
                    <div className="p-8 bg-gradient-to-br from-slate-800 to-slate-900 text-white relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.02)_50%,transparent_52%)] bg-[size:20px_20px]" />

                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Palette className="w-5 h-5 text-slate-400" />
                                    <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400">THEMING</span>
                                </div>
                                <Badge className="bg-white/10 text-white border-white/20 rounded-none text-[9px] font-mono">AUTO</Badge>
                            </div>

                            <div>
                                <h4 className="text-2xl font-black uppercase italic tracking-tight">INTERFACE_MODES</h4>
                                <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                                    Respects system preference via <code className="text-slate-400">next-themes</code>. All colors use CSS variables for instant switching. No flash of wrong theme on page load.
                                </p>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-white/10">
                                <div className="w-8 h-8 rounded bg-background border border-border" />
                                <div className="w-8 h-8 rounded bg-primary" />
                                <div className="w-8 h-8 rounded bg-secondary" />
                                <div className="w-8 h-8 rounded bg-accent" />
                                <div className="w-8 h-8 rounded bg-muted" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Why It Matters */}
                <div className="p-6 bg-white/30 dark:bg-slate-900/30 border border-slate-200/30 dark:border-slate-700/30">
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wide mb-3">Why This Matters for Hiring</h4>
                    <p className="text-sm text-foreground/70 leading-relaxed">
                        <strong className="text-foreground">Professional design signals professional candidates.</strong> A polished, accessible resume builder sets the right expectations. When candidates use a tool that respects dark mode preferences and works with screen readers, they associate that quality with your employer brand. First impressions matter—even in SaaS.
                    </p>
                </div>
            </div>
        </SwissSection>
    );
};
