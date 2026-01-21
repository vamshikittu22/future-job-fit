import React from 'react';
import { Badge } from '@/shared/ui/badge';
import { ArrowRight } from 'lucide-react';
import { SwissSection } from './BaseComponents';

export const CapacitySection: React.FC = () => {
    return (
        <SwissSection
            number="10"
            id="scalability"
            title="SCALE."
            subtitle="GLOBAL DELIVERY MODEL"
            accentColor="bg-indigo-600"
            titleClassName="text-indigo-950 dark:text-indigo-100"
            subtitleClassName="text-indigo-600 dark:text-indigo-400"
            className="relative bg-indigo-50/50 dark:bg-indigo-900/5 group/section"
            description="Our infrastructure is built for massive candidate volume. Whether you're hiring for one role or one thousand, our globally distributed model ensures 100% uptime and zero slowdowns."
        >
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-indigo-500/5 to-transparent pointer-events-none" />

            <div className="space-y-8 relative z-10">
                {/* Architecture Diagram */}
                <div className="p-6 bg-white/50 dark:bg-slate-900/50 border border-indigo-200/50 dark:border-indigo-800/50">
                    <div className="flex items-center gap-4 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                        // DEPLOYMENT_MODEL
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-mono">
                        <span className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-bold">Static Build</span>
                        <ArrowRight className="w-5 h-5 text-indigo-400" />
                        <span className="px-4 py-2 bg-indigo-600 text-white font-bold">CDN Edge</span>
                        <ArrowRight className="w-5 h-5 text-indigo-400" />
                        <span className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-bold">Browser</span>
                        <ArrowRight className="w-5 h-5 text-indigo-400" />
                        <span className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-bold">localStorage</span>
                    </div>
                    <p className="text-xs text-center text-muted-foreground mt-4">No origin servers. No database queries. Just cached static files + client-side storage.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { metric: '$0', label: 'Server Cost', detail: 'Static hosting only' },
                        { metric: '∞', label: 'Concurrent Users', detail: 'CDN scales infinitely' },
                        { metric: '~50ms', label: 'Global Latency', detail: 'Edge-cached assets' },
                        { metric: '100%', label: 'Uptime', detail: 'No backend to fail' }
                    ].map((item, i) => (
                        <div key={i} className="p-6 bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-center group hover:scale-105 transition-transform duration-300">
                            <div className="text-3xl font-black italic">{item.metric}</div>
                            <div className="text-xs font-mono uppercase tracking-widest mt-1 text-indigo-100">{item.label}</div>
                            <div className="text-[9px] font-mono text-indigo-200/70 mt-2">{item.detail}</div>
                        </div>
                    ))}
                </div>

                {/* Two Column */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Client-Side Benefits */}
                    <div className="p-8 bg-white/50 dark:bg-slate-900/50 border border-indigo-200/50 dark:border-indigo-800/50 space-y-4">
                        <div className="flex items-center gap-4 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-black uppercase tracking-[0.3em]">
                            // EDGE_BENEFITS
                        </div>
                        <h4 className="text-lg font-bold text-foreground">Why This Scales</h4>
                        <ul className="space-y-2 text-sm text-foreground/70">
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-500 font-bold">→</span>
                                <span><strong>No server logic:</strong> All computation happens in the user's browser</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-500 font-bold">→</span>
                                <span><strong>CDN-cached:</strong> Assets served from 200+ global edge locations</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-indigo-500 font-bold">→</span>
                                <span><strong>Offline-first:</strong> Works without internet after initial load</span>
                            </li>
                        </ul>
                    </div>

                    {/* AI Scaling */}
                    <div className="p-8 bg-gradient-to-br from-indigo-600 to-violet-700 text-white relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_60%)]" />

                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-mono uppercase tracking-widest text-indigo-200">AI_SERVICE_LAYER</span>
                                <Badge className="bg-white/10 text-white border-white/20 rounded-none text-[9px] font-mono">SERVERLESS</Badge>
                            </div>

                            <div>
                                <h4 className="text-2xl font-black uppercase italic tracking-tight">PAY_PER_USE</h4>
                                <p className="text-indigo-100 text-sm mt-2 leading-relaxed">
                                    AI features run on Supabase Edge Functions—serverless, auto-scaling, billed only when invoked. Zero AI cost when candidates aren't actively enhancing content.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Why It Matters */}
                <div className="p-6 bg-white/30 dark:bg-slate-900/30 border border-indigo-200/30 dark:border-indigo-800/30">
                    <h4 className="text-sm font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide mb-3">Why This Matters for Hiring</h4>
                    <p className="text-sm text-foreground/70 leading-relaxed">
                        <strong className="text-foreground">Scalability without infrastructure headaches.</strong> When you launch a hiring campaign and 10,000 candidates hit the resume builder simultaneously, you don't call DevOps. The CDN handles it. There's no database bottleneck because there's no database. Costs stay flat whether you have 10 users or 10,000.
                    </p>
                </div>
            </div>
        </SwissSection>
    );
};
