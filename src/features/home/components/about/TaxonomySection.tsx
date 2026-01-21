import React from 'react';
import { Badge } from '@/shared/ui/badge';
import { Sparkles } from 'lucide-react';
import { SwissSection } from './BaseComponents';

export const TaxonomySection: React.FC = () => {
    return (
        <SwissSection
            number="06"
            id="skill-mapping"
            title="TAXONOMY."
            subtitle="SKILL CLASSIFICATION"
            accentColor="bg-pink-600"
            titleClassName="text-pink-950 dark:text-pink-100"
            subtitleClassName="text-pink-600 dark:text-pink-400"
            className="relative bg-pink-50/50 dark:bg-pink-900/5 group/section"
            description="Skills aren't just keywords—they belong to categories. Our dual-layer system uses pattern matching locally and AI for intelligent grouping, so 'React, Next.js, Vue' automatically becomes 'Frontend Frameworks'."
        >
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-pink-500/5 to-transparent pointer-events-none" />

            <div className="space-y-8 relative z-10">
                {/* Category Examples */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { category: 'Languages', skills: ['Python', 'TypeScript', 'Java', 'Go'], color: 'from-pink-500 to-rose-600' },
                        { category: 'Frameworks', skills: ['React', 'Next.js', 'FastAPI', 'Express'], color: 'from-pink-600 to-fuchsia-600' },
                        { category: 'Tools', skills: ['Docker', 'Git', 'AWS', 'Figma'], color: 'from-fuchsia-500 to-purple-600' },
                        { category: 'Soft Skills', skills: ['Leadership', 'Agile', 'Communication'], color: 'from-purple-500 to-pink-600' }
                    ].map((cat, i) => (
                        <div key={i} className={`p-4 bg-gradient-to-br ${cat.color} text-white`}>
                            <div className="text-xs font-mono uppercase tracking-widest opacity-80 mb-2">{cat.category}</div>
                            <div className="flex flex-wrap gap-1">
                                {cat.skills.map(s => (
                                    <span key={s} className="text-[10px] bg-white/20 px-1.5 py-0.5 font-mono">{s}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Two Column */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Local Pattern Matching */}
                    <div className="p-8 bg-white/50 dark:bg-slate-900/50 border border-pink-200/50 dark:border-pink-800/50 space-y-4">
                        <div className="flex items-center gap-4 text-pink-600 dark:text-pink-400 font-mono text-[10px] font-black uppercase tracking-[0.3em]">
                            // LOCAL_PATTERNS
                        </div>
                        <h4 className="text-lg font-bold text-foreground">Instant Categorization</h4>
                        <p className="text-sm text-foreground/70 leading-relaxed">
                            Before calling AI, we run local pattern matching. Common technologies are recognized instantly: <code className="text-pink-600">React|Vue|Angular → Frontend</code>, <code className="text-pink-600">Docker|K8s → DevOps</code>. This catches 80% of cases with zero latency.
                        </p>
                        <div className="p-3 bg-pink-50 dark:bg-pink-900/30 font-mono text-xs text-pink-700 dark:text-pink-300">
                            {`const languagePatterns = /python|java|typescript/i;`}<br />
                            {`const toolPatterns = /docker|git|aws|figma/i;`}
                        </div>
                    </div>

                    {/* AI-Assisted */}
                    <div className="p-8 bg-gradient-to-br from-pink-600 to-rose-700 text-white relative overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_60%)]" />

                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center justify-between">
                                <Sparkles className="w-5 h-5 text-pink-200" />
                                <span className="text-[9px] font-mono uppercase tracking-widest text-pink-200">AI_AUGMENTATION</span>
                                <Badge className="bg-white/10 text-white border-white/20 rounded-none text-[9px] font-mono">GEMINI</Badge>
                            </div>

                            <div>
                                <h4 className="text-2xl font-black uppercase italic tracking-tight">organizeSkills()</h4>
                                <p className="text-pink-100 text-sm mt-2 leading-relaxed">
                                    For ambiguous skills or large lists, AI provides intelligent grouping. It also detects duplicates and suggests modern alternatives for outdated technologies.
                                </p>
                            </div>

                            <div className="pt-4 border-t border-white/20 space-y-2">
                                <div className="flex justify-between text-[10px] font-mono text-pink-100">
                                    <span>Duplicate Detection</span>
                                    <span className="text-pink-300 font-bold">✓</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-mono text-pink-100">
                                    <span>Outdated Skill Flags</span>
                                    <span className="text-pink-300 font-bold">✓</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Why It Matters */}
                <div className="p-6 bg-white/30 dark:bg-slate-900/30 border border-pink-200/30 dark:border-pink-800/30">
                    <h4 className="text-sm font-bold text-pink-700 dark:text-pink-400 uppercase tracking-wide mb-3">Why This Matters for Hiring</h4>
                    <p className="text-sm text-foreground/70 leading-relaxed">
                        <strong className="text-foreground">Categorized skills are scannable skills.</strong> When a resume lists "React, Next.js, TypeScript, Node.js, PostgreSQL, Docker, AWS" as a flat list, recruiters have to mentally group them. When it's organized into "Frontend: React, Next.js" and "Backend: Node.js, PostgreSQL"—you can assess fit in seconds, not minutes.
                    </p>
                </div>
            </div>
        </SwissSection>
    );
};
