import React from 'react';
import { Badge } from '@/shared/ui/badge';
import { FileText } from 'lucide-react';
import { SwissSection } from './BaseComponents';

export const VersatilitySection: React.FC = () => {
    return (
        <SwissSection
            number="07"
            id="export-architecture"
            title="VERSATILITY."
            subtitle="UNIVERSAL EXPORTS"
            accentColor="bg-teal-600"
            titleClassName="text-teal-950 dark:text-teal-100"
            subtitleClassName="text-teal-600 dark:text-teal-400"
            className="relative bg-teal-50/50 dark:bg-teal-900/5 group/section"
            description="One resume, seven formats. All generated client-side—no server uploads, no privacy concerns. From PDF to LaTeX, every format is production-ready."
        >
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-teal-500/5 to-transparent pointer-events-none" />

            <div className="space-y-8 relative z-10">
                {/* Format Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {[
                        { format: 'PDF', lib: 'jsPDF', icon: '📄', desc: 'ATS-friendly layout' },
                        { format: 'DOCX', lib: 'docx', icon: '📝', desc: 'Editable Word file' },
                        { format: 'HTML', lib: 'Native', icon: '🌐', desc: 'Web-ready page' },
                        { format: 'LaTeX', lib: 'Template', icon: '📐', desc: 'Academic quality' },
                        { format: 'Markdown', lib: 'Native', icon: '📋', desc: 'Plain text markup' },
                        { format: 'TXT', lib: 'Native', icon: '📃', desc: 'Maximum ATS compat' },
                        { format: 'JSON', lib: 'Native', icon: '💾', desc: 'Machine-readable' }
                    ].map((item, i) => (
                        <div key={i} className="p-4 bg-white/50 dark:bg-slate-900/50 border border-teal-200/50 dark:border-teal-800/50 hover:border-teal-500/50 transition-colors text-center group hover:scale-105 duration-300">
                            <div className="text-2xl mb-2">{item.icon}</div>
                            <div className="font-mono text-sm font-bold text-teal-700 dark:text-teal-400">{item.format}</div>
                            <div className="text-[9px] text-muted-foreground mt-1">{item.lib}</div>
                            <div className="text-[9px] text-muted-foreground/70 mt-1">{item.desc}</div>
                        </div>
                    ))}
                </div>

                {/* Two Column */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Client-Side Generation */}
                    <div className="p-8 bg-white/50 dark:bg-slate-900/50 border border-teal-200/50 dark:border-teal-800/50 space-y-4">
                        <div className="flex items-center gap-4 text-teal-600 dark:text-teal-400 font-mono text-[10px] font-black uppercase tracking-[0.3em]">
                            // CLIENT_SIDE
                        </div>
                        <h4 className="text-lg font-bold text-foreground">Zero Server Dependencies</h4>
                        <p className="text-sm text-foreground/70 leading-relaxed">
                            PDF generation happens entirely in the browser using <code className="text-teal-600">jsPDF</code> and <code className="text-teal-600">html2canvas</code>. DOCX uses the <code className="text-teal-600">docx</code> library. No uploads, no waiting for server processing. Your resume data never leaves your device.
                        </p>
                        <div className="flex gap-2">
                            {['jsPDF', 'docx', 'html2canvas', 'file-saver'].map(t => (
                                <span key={t} className="px-2 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 text-[10px] font-mono">{t}</span>
                            ))}
                        </div>
                    </div>

                    {/* ATS Optimization */}
                    <div className="p-8 bg-gradient-to-br from-teal-600 to-cyan-700 text-white relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.03)_10px,rgba(255,255,255,0.03)_11px)]" />

                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center justify-between">
                                <FileText className="w-5 h-5 text-teal-200" />
                                <span className="text-[9px] font-mono uppercase tracking-widest text-teal-200">RECRUITER_OPTIMIZED</span>
                                <Badge className="bg-white/10 text-white border-white/20 rounded-none text-[9px] font-mono">PARSEABLE</Badge>
                            </div>

                            <div>
                                <h4 className="text-2xl font-black uppercase italic tracking-tight">MACHINE_READABLE</h4>
                                <p className="text-teal-100 text-sm mt-2 leading-relaxed">
                                    PDFs use selectable text (not images). Plain text export strips all formatting for maximum ATS compatibility. Structured headings ensure parsers identify sections correctly.
                                </p>
                            </div>

                            <div className="pt-4 border-t border-white/20 space-y-2">
                                <div className="flex justify-between text-[10px] font-mono text-teal-100">
                                    <span>Selectable Text</span>
                                    <span className="text-teal-300 font-bold">✓</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-mono text-teal-100">
                                    <span>Standard Sections</span>
                                    <span className="text-teal-300 font-bold">✓</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Why It Matters */}
                <div className="p-6 bg-white/30 dark:bg-slate-900/30 border border-teal-200/30 dark:border-teal-800/30">
                    <h4 className="text-sm font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wide mb-3">Why This Matters for Hiring</h4>
                    <p className="text-sm text-foreground/70 leading-relaxed">
                        <strong className="text-foreground">Format flexibility removes friction.</strong> Some ATS systems prefer plain text. Some recruiters want editable DOCX. Academics need LaTeX. By offering 7 formats from a single source of truth, candidates can submit exactly what each application requires—without reformatting or losing information.
                    </p>
                </div>
            </div>
        </SwissSection>
    );
};
