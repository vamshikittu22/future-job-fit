import React from 'react';
import { Badge } from '@/shared/ui/badge';
import { Shield } from 'lucide-react';
import { SwissSection } from './BaseComponents';

export const FidelitySection: React.FC = () => {
    return (
        <SwissSection
            number="05"
            id="identity"
            title="ACCURACY."
            subtitle="HIGH-FIDELITY DATA"
            accentColor="bg-cyan-600"
            titleClassName="text-cyan-950 dark:text-cyan-100"
            subtitleClassName="text-cyan-600 dark:text-cyan-400"
            className="relative bg-cyan-50/50 dark:bg-cyan-900/5 group/section"
            description="Every resume is a high-fidelity data asset, not just a document. We ensure that every piece of candidate information is verified and structured for maximum clarity."
        >
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-cyan-500/5 to-transparent pointer-events-none" />

            <div className="space-y-8 relative z-10">
                {/* Schema Visualization */}
                <div className="grid md:grid-cols-3 gap-4">
                    {[
                        { entity: 'PersonalInfo', fields: ['name', 'email', 'phone', 'location', 'linkedin'], required: true },
                        { entity: 'Experience[]', fields: ['company', 'title', 'startDate', 'endDate', 'bullets[]'], required: true },
                        { entity: 'Education[]', fields: ['institution', 'degree', 'field', 'graduationDate'], required: false },
                        { entity: 'Skills[]', fields: ['name', 'category', 'proficiency'], required: true },
                        { entity: 'Projects[]', fields: ['title', 'description', 'technologies[]', 'link?'], required: false },
                        { entity: 'Certifications[]', fields: ['name', 'issuer', 'date', 'expiryDate?'], required: false }
                    ].map((item, i) => (
                        <div key={i} className="p-4 bg-white/50 dark:bg-slate-900/50 border border-cyan-200/50 dark:border-cyan-800/50 hover:border-cyan-500/50 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-mono text-sm font-bold text-cyan-700 dark:text-cyan-400">{item.entity}</span>
                                {item.required && <Badge className="bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300 text-[9px]">Required</Badge>}
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {item.fields.map(f => (
                                    <span key={f} className="text-[9px] font-mono text-muted-foreground bg-cyan-50 dark:bg-cyan-900/30 px-1.5 py-0.5">{f}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Two Column */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Validation */}
                    <div className="p-8 bg-white/50 dark:bg-slate-900/50 border border-cyan-200/50 dark:border-cyan-800/50 space-y-4">
                        <div className="flex items-center gap-4 text-cyan-600 dark:text-cyan-400 font-mono text-[10px] font-black uppercase tracking-[0.3em]">
                            <Shield className="w-4 h-4" /> DATA_INTEGRITY_CHECK
                        </div>
                        <h4 className="text-lg font-bold text-foreground">Zod: Parse, Don't Validate</h4>
                        <p className="text-sm text-foreground/70 leading-relaxed">
                            Every form submission passes through <code className="text-cyan-600">zod.safeParse()</code>. If validation fails, the user sees specific field errors—not a generic "something went wrong." This catches issues before they corrupt the saved resume.
                        </p>
                        <div className="p-3 bg-cyan-50 dark:bg-cyan-900/30 font-mono text-xs text-cyan-700 dark:text-cyan-300">
                            {`const result = resumeSchema.safeParse(data);`}<br />
                            {`if (!result.success) showErrors(result.error);`}
                        </div>
                    </div>

                    {/* Benefits Card */}
                    <div className="p-8 bg-gradient-to-br from-cyan-600 to-teal-700 text-white relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:24px_24px]" />

                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-mono uppercase tracking-widest text-cyan-200">BENEFITS</span>
                                <Badge className="bg-white/10 text-white border-white/20 rounded-none text-[9px] font-mono">UUID v4</Badge>
                            </div>

                            <div>
                                <h4 className="text-2xl font-black uppercase italic tracking-tight">STRUCTURED_DATA</h4>
                                <ul className="mt-4 space-y-2 text-sm text-cyan-100">
                                    <li className="flex items-center gap-2">
                                        <span className="text-cyan-300">✓</span> Consistent format across all exports
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-cyan-300">✓</span> Unique IDs for each resume entity
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-cyan-300">✓</span> Export to PDF, DOCX, JSON identically
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="text-cyan-300">✓</span> Future-proof for API integrations
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Why It Matters */}
                <div className="p-6 bg-white/30 dark:bg-slate-900/30 border border-cyan-200/30 dark:border-cyan-800/30">
                    <h4 className="text-sm font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wide mb-3">Why This Matters for Hiring</h4>
                    <p className="text-sm text-foreground/70 leading-relaxed">
                        <strong className="text-foreground">Structured resumes are easier to parse and compare.</strong> When candidates submit resumes through our builder, you get consistent data—not the chaos of free-form Word documents. This means your ATS can accurately extract experience, skills, and education. Better data in = better candidate matching out.
                    </p>
                </div>
            </div>
        </SwissSection>
    );
};
