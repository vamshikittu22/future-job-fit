import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Check, X, ShieldAlert, Cpu, Database, Zap, FileText } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';

const ConstraintChronicle: React.FC = () => {
    const decisions = [
        {
            id: '01',
            title: 'LATENCY ARCHITECTURE',
            problem: "Synchronous UI rendering of complex PDF previews caused noticeable frame drops (jank) during rapid text entry.",
            solution: "Decoupled rendering logic into an asynchronous Web Worker pipeline using a binary-transferable state strategy.",
            outcome: "Maintained consistent 60FPS UI performance even with 5+ page documents.",
            status: 'RESOLVED',
            icon: <Cpu className="w-5 h-5" />,
            rejected: 'Server-Side Rendering'
        },
        {
            id: '02',
            title: 'STATE ORCHESTRATION',
            problem: "Managing deeply nested, auto-saving resume data led to excessive re-render cycles and potential 'race conditions'.",
            solution: "Architected a 'Flat-Slice' Zustand store with optimistic updates and debouncing logic for the persistence layer.",
            outcome: "40% reduction in average CPU usage during long editing sessions.",
            status: 'ENFORCED',
            icon: <Database className="w-5 h-5" />,
            rejected: 'Redux Thunk'
        },
        {
            id: '03',
            title: 'HYBRID NLP STRATEGY',
            problem: "Pure LLM-based chains were cost-prohibitive and too slow for real-time ATS scoring and syntax feedback.",
            solution: "Implemented a local Python-based Regex/Context engine for immediate feedback, reserving LLMs for semantic polish.",
            outcome: "92% reduction in cloud API dependency and sub-100ms processing for 90% of tasks.",
            status: 'INTEGRATED',
            icon: <Zap className="w-5 h-5" />,
            rejected: 'Pure Cloud-AI Model'
        },
        {
            id: '04',
            title: 'CONTENT NORMALIZATION',
            problem: "Rich Text Editors (Quill/DraftJS) produced dirty HTML that caused 'rendering drift' between Web, PDF, and DOCX outputs.",
            solution: "Standardized on CommonMark (GFM) via `react-markdown` as the single source of truth for all text content.",
            outcome: "Zero formatting loss across 3 different export pipelines.",
            status: 'STANDARDIZED',
            icon: <FileText className="w-5 h-5" />,
            rejected: 'WYSIWYG HTML'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-px bg-border/20 border border-border/40 shadow-xl transition-colors duration-500">
            {decisions.map((item, i) => (
                <div
                    key={item.id}
                    className="bg-card p-8 group hover:z-10 transition-all relative overflow-hidden flex flex-col justify-between min-h-[400px]"
                >
                    {/* Background Number - Slightly more visible */}
                    <div className="absolute -right-4 -top-8 text-[120px] font-black text-foreground/5 select-none transition-transform group-hover:scale-110 duration-500">
                        {item.id}
                    </div>

                    <div className="space-y-8 relative z-10">
                        {/* Header */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                                {item.icon}
                                <span>RECORD_v4</span>
                            </div>
                            <h3 className="text-3xl font-black uppercase tracking-tighter leading-none text-foreground">{item.title}</h3>
                        </div>

                        {/* Content Matrix */}
                        <div className="space-y-6 pt-6">
                            <div className="space-y-2">
                                <span className="text-[10px] text-muted-foreground/80 font-bold uppercase tracking-widest flex items-center gap-2">
                                    <AlertTriangle className="w-3 h-3 text-red-500" /> Constraint
                                </span>
                                <p className="text-xs leading-relaxed text-muted-foreground font-medium">
                                    {item.problem}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <span className="text-[10px] text-muted-foreground/80 font-bold uppercase tracking-widest flex items-center gap-2">
                                    <Check className="w-3 h-3 text-emerald-500" /> Resolution
                                </span>
                                <p className="text-xs leading-relaxed font-bold text-foreground">
                                    {item.solution}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Meta */}
                    <div className="pt-10 relative z-10 flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/70 line-through decoration-red-500/50 uppercase tracking-widest">
                            <X className="w-3 h-3" /> NO: {item.rejected}
                        </div>
                        <div className="flex justify-between items-center">
                            <Badge className="bg-primary/10 text-primary border-primary/20 rounded-none font-mono text-[9px] px-3 py-1 uppercase tracking-widest">
                                {item.status}
                            </Badge>
                            <span className="text-[10px] font-mono text-muted-foreground/50 font-bold">2024.Q1</span>
                        </div>
                    </div>

                    {/* Hover Decoration */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                </div>
            ))}
        </div>
    );
};

export default ConstraintChronicle;
