import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Check, X, ShieldAlert, Cpu, Database } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';

const ConstraintChronicle: React.FC = () => {
    const decisions = [
        {
            id: '01',
            title: 'THE LATENCY WAR',
            problem: "Server-side PDF generation introduced a 2.5s delay, breaking the 'flow state' of the editor.",
            solution: "Moved rendering to a client-side Web Worker pipeline.",
            outcome: "Instant preview updates (16ms) at the cost of 4MB initial bundle size.",
            status: 'RESOLVED',
            icon: <Cpu className="w-5 h-5" />,
            rejected: 'Server-Side Rendering (SSR)'
        },
        {
            id: '02',
            title: 'CONTEXT RETENTION',
            problem: "LLMs hallucinate details when the resume exceeds 4000 tokens (approx 2 pages).",
            solution: "Implemented a 'Sliding Window' context strategy with vector embeddings for long histories.",
            outcome: "Zero hallucination on resumes up to 10 pages.",
            status: 'OPTIMIZED',
            icon: <Database className="w-5 h-5" />,
            rejected: 'Naive Truncation'
        },
        {
            id: '03',
            title: 'DATA SOVEREIGNTY',
            problem: "Users are hesitant to send PII (Personal Identifiable Information) to cloud databases.",
            solution: "Architected a 'Local-First' sync engine. Data lives in IndexedDB and only syncs to cloud on explicit save.",
            outcome: "GDPR compliance by default. Offline-first capability.",
            status: 'ENFORCED',
            icon: <ShieldAlert className="w-5 h-5" />,
            rejected: 'Cloud-Only Database'
        }
    ];

    return (
        <div className="grid gap-px bg-white/10 border border-white/10">
            {decisions.map((item, i) => (
                <div
                    key={item.id}
                    className="bg-black p-8 group hover:bg-white/[0.02] transition-colors relative overflow-hidden"
                >
                    {/* Background Number */}
                    <div className="absolute right-0 top-0 p-4 opacity-10 font-mono text-6xl font-black text-white/20 select-none">
                        {item.id}
                    </div>

                    <div className="space-y-6 relative z-10">
                        {/* Header */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-accent text-xs font-mono uppercase tracking-widest">
                                {item.icon}
                                <span>ENGINEERING_DECISION_RECORD</span>
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter">{item.title}</h3>
                        </div>

                        {/* Problem/Solution Matrix */}
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <span className="text-[10px] text-red-400 font-mono uppercase tracking-widest flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" /> The Constraint
                                </span>
                                <p className="text-sm text-balance leading-relaxed text-muted-foreground border-l-2 border-red-500/20 pl-3">
                                    {item.problem}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <span className="text-[10px] text-green-400 font-mono uppercase tracking-widest flex items-center gap-1">
                                    <Check className="w-3 h-3" /> The Resolution
                                </span>
                                <p className="text-sm text-balance leading-relaxed text-white border-l-2 border-green-500/20 pl-3">
                                    {item.solution}
                                </p>
                            </div>
                        </div>

                        {/* Footer Metadata */}
                        <div className="pt-6 border-t border-white/5 flex justify-between items-center text-[10px] font-mono uppercase">
                            <div className="flex items-center gap-2 text-muted-foreground/60 line-through decoration-red-500/50">
                                <X className="w-3 h-3" /> Rejected: {item.rejected}
                            </div>
                            <Badge variant="outline" className="border-accent/20 text-accent h-6">
                                {item.status}
                            </Badge>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ConstraintChronicle;
