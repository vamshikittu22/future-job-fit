import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Cpu, Server, Wifi, Terminal } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';

const SystemVitals: React.FC = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const [metrics, setMetrics] = useState({
        latency: 24,
        memory: 142,
        requests: 840,
        throughput: '1.2GB/s'
    });

    const logMessages = [
        "PARSING_RESUME: OFFLINE_ENGINE_V3.14",
        "ATS_SCAN: KEYWORD_DENSITY_OPTIMAL",
        "HYBRID_ROUTE: DETERMINISTIC_LOCAL",
        "LLM_ORCHESTRATION: GEMINI_1.5_PRO",
        "TOKEN_SAVED: 84% REDUCTION",
        "STATE_SYNC: PERSISTENCE_ACTIVE",
        "PDF_WORKER: RENDER_START",
        "CACHE_HIT: SECTION_ANALYTICS"
    ];

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setLogs(prev => {
                const newLogs = [...prev, logMessages[index % logMessages.length]];
                if (newLogs.length > 5) newLogs.shift();
                return newLogs;
            });

            setMetrics(prev => ({
                ...prev,
                latency: 20 + Math.floor(Math.random() * 15),
                memory: 140 + Math.floor(Math.random() * 20),
                requests: prev.requests + Math.floor(Math.random() * 5)
            }));

            index++;
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full border border-muted/20 bg-background transition-colors duration-500 p-8 space-y-8 font-sans overflow-hidden relative group shadow-2xl">
            {/* Minimalist Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#80808012_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            {/* Status Header */}
            <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-1.5 h-1.5 bg-primary animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                        ))}
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-[0.3em] uppercase text-muted-foreground">System_Telemetry</span>
                </div>
                <Badge variant="outline" className="rounded-none border-primary/20 text-primary uppercase font-mono text-[9px] tracking-widest">Live_Feed</Badge>
            </div>

            {/* Large Metrics */}
            <div className="grid grid-cols-2 gap-8 relative z-10 border-t border-muted/20 pt-8">
                <div className="space-y-1">
                    <div className="text-[9px] text-muted-foreground uppercase tracking-widest font-mono">Res_Latency</div>
                    <div className="text-4xl font-black tracking-tighter text-foreground">
                        {metrics.latency}<span className="text-xs font-normal text-muted-foreground ml-1">MS</span>
                    </div>
                </div>
                <div className="space-y-1 text-right">
                    <div className="text-[9px] text-muted-foreground uppercase tracking-widest font-mono">Token_Efficiency</div>
                    <div className="text-4xl font-black tracking-tighter text-emerald-500">
                        +84%
                    </div>
                </div>
            </div>

            {/* Compact Terminal - Higher Contrast */}
            <div className="bg-muted/10 border border-border/40 p-4 relative z-10 overflow-hidden h-28">
                <div className="space-y-1.5">
                    <AnimatePresence mode='popLayout'>
                        {logs.map((log, i) => (
                            <motion.div
                                key={`${log}-${i}`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-[10px] font-mono flex gap-3 items-center"
                            >
                                <span className="text-muted-foreground/60 font-bold">{new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                                <span className="text-foreground">&gt; {log}</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Technical Labels */}
            <div className="flex justify-between items-center text-[8px] font-mono text-muted-foreground uppercase tracking-[0.3em] font-bold">
                <span>V2.4.0 / OFFLINE_PRIORITY</span>
                <span className="text-primary italic">Handshake_Stable</span>
            </div>
        </div>
    );
};

// Helper icon component
const TargetChart = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 2v20M2 12h20" />
        <circle cx="12" cy="12" r="10" />
    </svg>
);

export default SystemVitals;
