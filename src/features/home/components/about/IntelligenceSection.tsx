import React from 'react';
import { Badge } from '@/shared/ui/badge';
import { ArrowRight, Sparkles, Shield } from 'lucide-react';
import { SwissSection } from './BaseComponents';

export const IntelligenceSection: React.FC = () => {
    return (
        <SwissSection
            number="04"
            id="intelligence"
            title="INTELLIGENCE."
            subtitle="SECURE AI SERVICES"
            accentColor="bg-purple-600"
            titleClassName="text-purple-950 dark:text-purple-100"
            subtitleClassName="text-purple-600 dark:text-purple-400"
            className="relative bg-purple-50/50 dark:bg-purple-900/5 group/section"
            description="AI enhancement without exposing API keys. Supabase Edge Functions act as a secure proxy—your candidates' resumes never touch third-party servers directly."
        >
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-purple-500/5 to-transparent pointer-events-none" />

            <div className="space-y-8 relative z-10">
                {/* Architecture Flow */}
                <div className="p-6 bg-white/50 dark:bg-slate-900/50 border border-purple-200/50 dark:border-purple-800/50">
                    <div className="flex items-center gap-4 text-purple-600 dark:text-purple-400 font-mono text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                        // SYSTEM_DATA_FLOW
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-mono">
                        <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold">Browser</span>
                        <ArrowRight className="w-5 h-5 text-purple-400" />
                        <span className="px-4 py-2 bg-purple-600 text-white font-bold">Edge Function</span>
                        <ArrowRight className="w-5 h-5 text-purple-400" />
                        <span className="px-4 py-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold">Gemini API</span>
                        <ArrowRight className="w-5 h-5 text-purple-400" />
                        <span className="px-4 py-2 bg-purple-600 text-white font-bold">Edge Function</span>
                        <ArrowRight className="w-5 h-5 text-purple-400" />
                        <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold">Browser</span>
                    </div>
                    <p className="text-xs text-center text-muted-foreground mt-4">API keys never leave the server. The browser only sends/receives resume content.</p>
                </div>

                {/* Two Column */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* What It Does */}
                    <div className="p-8 bg-white/50 dark:bg-slate-900/50 border border-purple-200/50 dark:border-purple-800/50 space-y-4">
                        <div className="flex items-center gap-4 text-purple-600 dark:text-purple-400 font-mono text-[10px] font-black uppercase tracking-[0.3em]">
                            <Sparkles className="w-4 h-4" /> AI_INTEGRATIONS
                        </div>
                        <h4 className="text-lg font-bold text-foreground">What Gemini 1.5 Flash Does</h4>
                        <ul className="space-y-2 text-sm text-foreground/70">
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500 font-bold">→</span>
                                <span><strong>enhanceSection:</strong> Rewrites bullet points for impact and clarity</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500 font-bold">→</span>
                                <span><strong>analyzeSection:</strong> Identifies weak verbs and passive voice</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500 font-bold">→</span>
                                <span><strong>organizeSkills:</strong> Clusters skills into logical categories</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-purple-500 font-bold">→</span>
                                <span><strong>suggestImpact:</strong> Adds quantifiable metrics to achievements</span>
                            </li>
                        </ul>
                    </div>

                    {/* Security Card */}
                    <div className="p-8 bg-gradient-to-br from-purple-600 to-violet-700 text-white relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.2)_0%,transparent_50%)]" />

                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Shield className="w-5 h-5 text-purple-200" />
                                    <span className="text-[9px] font-mono uppercase tracking-widest text-purple-200">SECURITY</span>
                                </div>
                                <Badge className="bg-white/10 text-white border-white/20 rounded-none text-[9px] font-mono">DENO ISOLATE</Badge>
                            </div>

                            <div>
                                <h4 className="text-2xl font-black uppercase italic tracking-tight">HIGH_SECURITY</h4>
                                <p className="text-purple-100 text-sm mt-2 leading-relaxed">
                                    Your GEMINI_API_KEY lives in Supabase secrets, never in the browser bundle. Each request runs in an isolated Deno sandbox with 50ms cold start.
                                </p>
                            </div>

                            <div className="pt-4 border-t border-white/20 space-y-2">
                                <div className="flex justify-between text-[10px] font-mono text-purple-100">
                                    <span>API Key Location</span>
                                    <span className="text-purple-300 font-bold">Server-side only</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-mono text-purple-100">
                                    <span>Request Isolation</span>
                                    <span>Deno V8 Sandbox</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Why It Matters */}
                <div className="p-6 bg-white/30 dark:bg-slate-900/30 border border-purple-200/30 dark:border-purple-800/30">
                    <h4 className="text-sm font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wide mb-3">Why This Matters for Hiring</h4>
                    <p className="text-sm text-foreground/70 leading-relaxed">
                        <strong className="text-foreground">AI-powered resume enhancement is a competitive advantage.</strong> Better-written resumes mean clearer signal for your recruiters. But AI without security is a liability. By routing all AI calls through serverless Edge Functions, we ensure candidate data is never stored or logged by third parties. Your employer brand stays protected.
                    </p>
                </div>
            </div>
        </SwissSection>
    );
};
