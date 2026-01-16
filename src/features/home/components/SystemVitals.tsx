import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Cpu, Server, Wifi, Terminal } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const SystemVitals: React.FC = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const [metrics, setMetrics] = useState({
        latency: 24,
        memory: 142,
        requests: 840,
        uptime: '99.99%'
    });

    const logContainerRef = useRef<HTMLDivElement>(null);

    // Simulated log messages
    const logMessages = [
        "INITIALIZING_CORE_SYSTEMS...",
        "CONNECTING_TO_EDGE_NODES...",
        "VERIFYING_AI_HANDSHAKE: GEMINI_1.5_FLASH",
        "LOADING_CONTEXT_VECTORS...",
        "OPTIMIZING_RENDER_TREE...",
        "HYDRATING_STATIC_ASSETS...",
        "CHECKING_LATENCY: 24ms [OPTIMAL]",
        "SYNCING_LOCAL_STATE...",
        "READY_FOR_INPUT_STREAM.",
        "MONITORING_THREAD_ACTIVITY...",
        "GARBAGE_COLLECTION: HEAP_NORMAL",
        "ATS_RULESET_VERSION: v2.4.1 LOADED",
        "SECURITY_PROTOCOL: ENFORCED",
    ];

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setLogs(prev => {
                const newLogs = [...prev, logMessages[index % logMessages.length]];
                if (newLogs.length > 6) newLogs.shift();
                return newLogs;
            });

            // Simulate metric fluctuation
            setMetrics(prev => ({
                ...prev,
                latency: 20 + Math.floor(Math.random() * 15),
                memory: 140 + Math.floor(Math.random() * 20),
                requests: prev.requests + Math.floor(Math.random() * 5)
            }));

            index++;
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full border border-white/10 bg-black/50 backdrop-blur-sm p-6 space-y-6 font-mono overflow-hidden relative group">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

            {/* Header */}
            <div className="flex justify-between items-center border-b border-white/10 pb-4 relative z-10">
                <div className="flex items-center gap-2 text-accent">
                    <Activity className="w-4 h-4 animate-pulse" />
                    <span className="text-xs uppercase tracking-[0.2em] font-bold">System_Vitals_Monitor</span>
                </div>
                <div className="flex gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500/20" />
                    <span className="w-2 h-2 rounded-full bg-yellow-500/20" />
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest">
                        <Wifi className="w-3 h-3" /> Latency
                    </div>
                    <div className="text-xl font-bold flex items-baseline gap-1">
                        {metrics.latency}<span className="text-[10px] text-accent font-normal">ms</span>
                    </div>
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest">
                        <Cpu className="w-3 h-3" /> Heap_Alloc
                    </div>
                    <div className="text-xl font-bold flex items-baseline gap-1">
                        {metrics.memory}<span className="text-[10px] text-accent font-normal">MB</span>
                    </div>
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest">
                        <Server className="w-3 h-3" /> Req_Total
                    </div>
                    <div className="text-xl font-bold flex items-baseline gap-1">
                        {metrics.requests}
                    </div>
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest">
                        <TargetChart className="w-3 h-3" /> Uptime
                    </div>
                    <div className="text-xl font-bold text-accent">
                        {metrics.uptime}
                    </div>
                </div>
            </div>

            {/* Terminal Log */}
            <div className="bg-black/80 border border-white/5 p-4 rounded-none h-32 overflow-hidden relative z-10">
                <div className="absolute top-2 right-2 text-[9px] text-muted-foreground uppercase tracking-widest">
                    /var/log/sys_core
                </div>
                <div className="space-y-1" ref={logContainerRef}>
                    <AnimatePresence mode='popLayout'>
                        {logs.map((log, i) => (
                            <motion.div
                                key={`${log}-${i}`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-[10px] font-mono flex gap-2 items-center text-green-500/80"
                            >
                                <span className="text-muted-foreground opacity-50">{new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                                <span>&gt; {log}</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
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
