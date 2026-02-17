import React from 'react';
import { Badge } from '@/shared/ui/badge';
import { SwissSection } from './BaseComponents';

export const ResilienceSection: React.FC = () => {
    return (
        <SwissSection
            number="02"
            id="state-logic"
            title="RELIABILITY."
            subtitle="DATA SECURITY LAYER"
            accentColor="bg-emerald-600"
            titleClassName="text-emerald-950 dark:text-emerald-50"
            subtitleClassName="text-emerald-600 dark:text-emerald-400"
            className="relative bg-emerald-50/50 dark:bg-emerald-900/5 group/section"
            description="Built-in data integrity ensures that candidate progress is never lost. We use browser-native storage to keep resumes secure and accessible, even during network drops."
        >
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-emerald-500/5 to-transparent pointer-events-none" />
            <div className="grid md:grid-cols-2 gap-6 relative z-10">

                {/* Context Architecture Card */}
                <div className="p-8 bg-white/50 dark:bg-slate-900/50 border border-emerald-200/50 dark:border-emerald-800/50 backdrop-blur-sm space-y-6 shadow-sm hover:shadow-emerald-200/50 transition-shadow">
                    <div className="flex items-center gap-4 text-emerald-700 dark:text-emerald-400 font-mono text-[10px] font-black uppercase tracking-[0.3em]">
                        // DATA_PROTECTION_LAYER
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                                <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">01</span>
                            </div>
                            <div>
                                <h5 className="font-bold text-foreground text-sm">WizardContext</h5>
                                <p className="text-xs text-muted-foreground mt-1">10-step form wizard state. Current step, navigation history, progress tracking.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                                <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">02</span>
                            </div>
                            <div>
                                <h5 className="font-bold text-foreground text-sm">ResumeContext</h5>
                                <p className="text-xs text-muted-foreground mt-1">Full resume data model. Personal info, experience, education, skills, projects.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                                <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">03</span>
                            </div>
                            <div>
                                <h5 className="font-bold text-foreground text-sm">Pyodide NLP Core</h5>
                                <p className="text-xs text-muted-foreground mt-1">Python engine cached via Service Worker. Enables offline resume parsing and ATS scoring.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Persistence Visual */}
                <div className="p-8 bg-gradient-to-br from-emerald-600 to-green-700 text-white relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                    <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(255,255,255,.05)_25%,rgba(255,255,255,.05)_26%,transparent_27%)] bg-[size:30px_30px]" />

                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />
                                <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-200">PERSISTENCE</span>
                            </div>
                            <Badge className="bg-white/10 text-white border-white/20 rounded-none text-[9px] font-mono">localStorage</Badge>
                        </div>

                        <div>
                            <h4 className="text-2xl font-black uppercase italic tracking-tight">ALWAYS_SAVED</h4>
                            <p className="text-emerald-100 text-sm mt-2 leading-relaxed">
                                Not just data, but the engine itself. Pyodide allows the full Python NLP suite to be cached locally. Analyze, parse, and score—all without an active connection.
                            </p>
                        </div>

                        <div className="pt-4 border-t border-white/20 space-y-2">
                            <div className="flex justify-between text-[10px] font-mono text-emerald-100">
                                <span>Offline Layer</span>
                                <span>Service Worker</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-mono text-emerald-100">
                                <span>Intelligence</span>
                                <span>Pyodide WASM</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-mono text-emerald-100">
                                <span>Data Loss Risk</span>
                                <span className="text-emerald-300 font-bold">ZERO</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Architecture Rationale */}
            <div className="mt-10 p-6 bg-white/30 dark:bg-slate-900/30 border border-emerald-200/30 dark:border-emerald-800/30 relative z-10">
                <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide mb-4">Why This Architecture?</h4>
                <div className="space-y-4 text-sm text-foreground/70 leading-relaxed">
                    <p>
                        <strong className="text-foreground">Why Context over Redux/Zustand?</strong> For a single-user SPA with 10 wizard steps, Redux's boilerplate (actions, reducers, selectors) adds complexity without proportional benefit. React Context provides sufficient isolation—WizardContext never re-renders components subscribed to ResumeContext. We split contexts by update frequency, not domain.
                    </p>
                    <p>
                        <strong className="text-foreground">Why localStorage over IndexedDB?</strong> Resume data is typically 2-5KB JSON. IndexedDB's async API and schema overhead solve a problem we don't have. localStorage is synchronous, universally supported, and debuggable via DevTools. The 5MB limit is irrelevant for our payload size.
                    </p>
                    <p>
                        <strong className="text-foreground">Why debounce at 500ms?</strong> Testing showed 300ms felt "sluggish" (users noticed save indicators), while 1000ms risked data loss on tab close. 500ms balances perceived responsiveness with battery efficiency on mobile.
                    </p>
                </div>
            </div>
        </SwissSection>
    );
};
