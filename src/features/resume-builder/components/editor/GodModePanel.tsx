import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, RefreshCw, Cpu, Activity, AlertTriangle } from 'lucide-react';
import { useResume } from '@/shared/contexts/ResumeContext';
import { Button } from '@/shared/ui/button';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/lib/utils';

const GodModePanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const { resumeData } = useResume();
    const [logs, setLogs] = useState<{ timestamp: string, type: 'info' | 'warn' | 'error', message: string }[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Simulated logs
    useEffect(() => {
        if (!isOpen) return;

        const interval = setInterval(() => {
            const types = ['info', 'info', 'info', 'warn'] as const;
            const type = types[Math.floor(Math.random() * types.length)];
            const messages = {
                info: [
                    'ATS_SCAN: Analyzing keyword density...',
                    'CONTEXT_UPDATE: Merging delta changes...',
                    'RENDER_THREAD: Layout recalculation complete -> 12ms',
                    'AI_CLIENT: Token usage optimized (145 tokens)'
                ],
                warn: [
                    'LAYOUT_SHIFT: Detected minor layout shift in Preview',
                    'ATS_WARN: "Leadership" keyword missing in Experience block',
                    'MEMORY: Heap usage approaching threshold'
                ],
                error: []
            };

            const message = messages[type][Math.floor(Math.random() * messages[type].length)];

            setLogs(prev => [...prev.slice(-19), {
                timestamp: new Date().toLocaleTimeString().split(' ')[0] + '.' + new Date().getMilliseconds(),
                type,
                message
            }]);

        }, 2000);

        return () => clearInterval(interval);
    }, [isOpen]);

    // Auto scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-0 left-0 right-0 h-64 bg-black/95 border-t border-accent/20 z-[60] font-mono text-xs text-green-500 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex"
        >
            {/* Sidebar Stats */}
            <div className="w-64 border-r border-white/10 p-4 space-y-4 bg-muted/5 flex-shrink-0">
                <div className="flex items-center gap-2 text-accent font-bold uppercase tracking-widest mb-4">
                    <Terminal className="w-4 h-4" /> GOD_MODE_V1
                </div>

                <div className="space-y-1">
                    <div className="text-[10px] text-muted-foreground uppercase">Session Tokens</div>
                    <div className="text-xl font-bold text-white">4,291</div>
                </div>
                <div className="space-y-1">
                    <div className="text-[10px] text-muted-foreground uppercase">ATS Validations</div>
                    <div className="text-xl font-bold text-white">128/s</div>
                </div>
                <div className="space-y-1">
                    <div className="text-[10px] text-muted-foreground uppercase">Render Cycles</div>
                    <div className="text-xl font-bold text-white">60fps</div>
                </div>
            </div>

            {/* Main Consoles */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Toolbar */}
                <div className="h-10 border-b border-white/10 flex items-center justify-between px-4 bg-white/5">
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Activity className="w-3 h-3" /> Live Event Stream
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Cpu className="w-3 h-3" /> Thread Monitor
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-red-500/20 hover:text-red-500" onClick={onClose}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Logs */}
                <div className="flex-1 flex overflow-hidden">
                    <div className="flex-1 p-4 overflow-y-auto font-mono text-[11px] space-y-1" ref={scrollRef}>
                        <div className="text-muted-foreground opacity-50 mb-2">--- SYSTEM INITIALIZED [GOD_MODE_ACTIVE] ---</div>
                        {logs.map((log, i) => (
                            <div key={i} className="flex gap-3">
                                <span className="text-muted-foreground opacity-50 shrink-0 w-20">{log.timestamp}</span>
                                <span className={cn(
                                    "uppercase shrink-0 w-12 font-bold",
                                    log.type === 'warn' ? "text-yellow-500" : "text-green-500"
                                )}>
                                    [{log.type}]
                                </span>
                                <span className="text-gray-300">{log.message}</span>
                            </div>
                        ))}
                        <div className="animate-pulse text-accent">_</div>
                    </div>

                    {/* Raw State Inspector */}
                    <div className="w-96 border-l border-white/10 bg-black p-4 overflow-y-auto hidden xl:block">
                        <div className="text-[10px] text-muted-foreground uppercase mb-2 flex items-center gap-2">
                            <RefreshCw className="w-3 h-3" /> Resume_State.json
                        </div>
                        <pre className="text-[10px] text-blue-300 leading-tight whitespace-pre-wrap break-all opacity-80">
                            {JSON.stringify({
                                personal: resumeData.personal,
                                stats: { sections: Object.keys(resumeData).length },
                                meta: 'Active'
                            }, null, 2)}
                        </pre>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default GodModePanel;
