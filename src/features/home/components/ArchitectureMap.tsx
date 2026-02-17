import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Cpu, Globe, Layout, FileText, Code2, ShieldCheck, Zap, Terminal } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface NodeProps {
    id: string;
    label: string;
    icon: React.ReactNode;
    x: number;
    y: number;
    description: string;
    isActive: boolean;
    onHover: (id: string | null) => void;
}

const Node: React.FC<NodeProps> = ({ id, label, icon, x, y, description, isActive, onHover }) => {
    return (
        <motion.div
            className="absolute"
            style={{ left: x, top: y }}
            onHoverStart={() => onHover(id)}
            onHoverEnd={() => onHover(null)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
            <div className={cn(
                "relative -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center border transition-all duration-300 z-20 cursor-crosshair",
                isActive
                    ? "bg-accent text-black border-accent scale-110 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                    : "bg-black border-white/20 text-muted-foreground hover:bg-white/10 hover:text-white"
            )}>
                {icon}
                {/* Connection Pulse */}
                <div className={cn("absolute inset-0 rounded-full border border-accent opacity-0 transition-opacity", isActive && "animate-ping opacity-50")} />
            </div>

            {/* Label and Tooltip */}
            <div className={cn(
                "absolute top-20 left-1/2 -translate-x-1/2 w-48 text-center transition-all duration-300 pointer-events-none z-30",
                isActive ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
            )}>
                <div className="bg-black/90 border border-accent/20 p-3 backdrop-blur-md">
                    <h4 className="text-accent font-mono text-xs font-bold uppercase tracking-widest mb-1">{label}</h4>
                    <p className="text-[10px] text-muted-foreground leading-tight">{description}</p>
                </div>
                {/* Connector Line to Tooltip */}
                <div className="w-px h-4 bg-accent/20 mx-auto absolute -top-4 left-1/2" />
            </div>

            {/* Static Label when not active */}
            <div className={cn(
                "absolute top-20 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground whitespace-nowrap transition-opacity",
                isActive ? "opacity-0" : "opacity-100"
            )}>
                {label}
            </div>
        </motion.div>
    );
};

const Connection: React.FC<{ start: { x: number, y: number }, end: { x: number, y: number }, active: boolean }> = ({ start, end, active }) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const d = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible">
            <motion.div
                className={cn("absolute h-[1px] origin-left transition-colors duration-500", active ? "bg-accent shadow-[0_0_10px_rgba(255,255,255,0.5)] h-[2px]" : "bg-white/10")}
                style={{
                    width: d,
                    left: start.x,
                    top: start.y,
                    transform: `rotate(${angle}deg)`
                }}
            >
                {active && (
                    <motion.div
                        className="w-1 h-3 bg-white absolute top-1/2 -translate-y-1/2 blur-[1px]"
                        initial={{ left: 0 }}
                        animate={{ left: "100%" }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    />
                )}
            </motion.div>
        </div>
    );
}

const inputs = [
    { id: 'client', label: 'Client Input', icon: <Layout className="w-6 h-6" />, x: 100, y: 300, description: 'React 18 Concurrent Root handling high-frequency keystrokes.' },
    { id: 'state', label: 'State Manager', icon: <Cpu className="w-6 h-6" />, x: 380, y: 300, description: 'Zustand stores with optimistic UI updates.' },
    { id: 'validation', label: 'Zod Guard', icon: <ShieldCheck className="w-6 h-6" />, x: 380, y: 100, description: 'Runtime schema validation ensuring type safety.' },
    { id: 'ai', label: 'Cloud AI Engine', icon: <Zap className="w-6 h-6" />, x: 750, y: 120, description: 'Edge Functions bridging Gemini 1.5 & GPT-4 for creative analysis.' },
    { id: 'offline_nlp', label: 'Local NLP Suite', icon: <Terminal className="w-6 h-6" />, x: 750, y: 300, description: 'Python/FastAPI service for high-speed ATS parsing & keyword matching.' },
    { id: 'render', label: 'PDF Worker', icon: <FileText className="w-6 h-6" />, x: 750, y: 480, description: 'Off-main-thread generation avoiding UI blocking.' },
    { id: 'storage', label: 'Persistence', icon: <Database className="w-6 h-6" />, x: 380, y: 500, description: 'IndexedDB wrapper for offline-first capability.' },
];

const connections = [
    { from: 'client', to: 'state' },
    { from: 'state', to: 'validation' },
    { from: 'validation', to: 'state' },
    { from: 'state', to: 'ai' },
    { from: 'ai', to: 'state' },
    { from: 'state', to: 'offline_nlp' },
    { from: 'offline_nlp', to: 'state' },
    { from: 'state', to: 'storage' },
    { from: 'state', to: 'render' },
];

interface ArchitectureMapProps {
    version?: 'enhanced' | 'swiss';
}

const ArchitectureMap: React.FC<ArchitectureMapProps> = ({ version = 'enhanced' }) => {
    const [activeNode, setActiveNode] = useState<string | null>(null);

    if (version === 'swiss') {
        return (
            <div className="w-full bg-background border border-muted/20 p-8 md:p-12 min-h-[600px] relative overflow-hidden font-sans transition-colors duration-500">
                {/* Swiss Grid Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-px bg-muted/20 border border-muted/20">
                    {/* Input Layer */}
                    <div className="bg-background/80 backdrop-blur-sm p-8 space-y-8">
                        <div className="text-[10px] font-mono text-primary font-bold tracking-[0.2em] uppercase flex items-center gap-2">
                            <Layout className="w-3 h-3" /> 01 / Input_Layer
                        </div>
                        <div className="space-y-4">
                            <motion.div
                                whileHover={{ x: 4 }}
                                className="p-6 border border-primary/20 bg-primary/5 group transition-all"
                            >
                                <h5 className="font-black uppercase tracking-tighter text-xl">Concurrent UI</h5>
                                <p className="text-[10px] text-muted-foreground leading-tight mt-2 uppercase tracking-widest">React 18 Fiber / 60FPS</p>
                                <div className="mt-4 h-1 w-0 group-hover:w-full bg-primary transition-all duration-500" />
                            </motion.div>
                        </div>
                    </div>

                    {/* Logic Layer */}
                    <div className="bg-background/80 backdrop-blur-sm p-8 space-y-8">
                        <div className="text-[10px] font-mono text-emerald-500 font-bold tracking-[0.2em] uppercase flex items-center gap-2">
                            <Cpu className="w-3 h-3" /> 02 / Logic_Orchestration
                        </div>
                        <div className="space-y-4">
                            <motion.div
                                whileHover={{ x: 4 }}
                                className="p-6 border border-emerald-500/20 bg-emerald-500/5 group transition-all"
                            >
                                <h5 className="font-black uppercase tracking-tighter text-xl">State Hub</h5>
                                <p className="text-[10px] text-muted-foreground leading-tight mt-2 uppercase tracking-widest">Zustand Persistence Bridge</p>
                                <div className="mt-4 h-1 w-0 group-hover:w-full bg-emerald-500 transition-all duration-500" />
                            </motion.div>
                            <motion.div
                                whileHover={{ x: 4 }}
                                className="p-6 border border-purple-500/20 bg-purple-500/5 group transition-all"
                            >
                                <h5 className="font-black uppercase tracking-tighter text-xl italic">Offline NLP</h5>
                                <p className="text-[10px] text-purple-600/80 leading-tight mt-2 uppercase tracking-widest font-bold">Local Regex Parser / v3.14</p>
                                <div className="mt-4 h-1 w-0 group-hover:w-full bg-purple-500 transition-all duration-500" />
                            </motion.div>
                        </div>
                    </div>

                    {/* Cloud/Output Layer */}
                    <div className="bg-background/80 backdrop-blur-sm p-8 space-y-8">
                        <div className="text-[10px] font-mono text-orange-500 font-bold tracking-[0.2em] uppercase flex items-center gap-2">
                            <Globe className="w-3 h-3" /> 03 / Compute_Cloud
                        </div>
                        <div className="space-y-4">
                            <motion.div
                                whileHover={{ x: 4 }}
                                className="p-6 border border-orange-500/20 bg-orange-500/5 group transition-all"
                            >
                                <h5 className="font-black uppercase tracking-tighter text-xl">Gemini 1.5</h5>
                                <p className="text-[10px] text-muted-foreground leading-tight mt-2 uppercase tracking-widest">Creative Augmentation</p>
                                <div className="mt-4 h-1 w-0 group-hover:w-full bg-orange-500 transition-all duration-500" />
                            </motion.div>
                            <motion.div
                                whileHover={{ x: 4 }}
                                className="p-6 border border-muted/20 bg-muted/5 group transition-all"
                            >
                                <h5 className="font-black uppercase tracking-tighter text-xl">PDF Engine</h5>
                                <p className="text-[10px] text-muted-foreground leading-tight mt-2 uppercase tracking-widest">Web Worker Threading</p>
                                <div className="mt-4 h-1 w-0 group-hover:w-full bg-foreground transition-all duration-500" />
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Swiss Typography Overlay */}
                <div className="absolute bottom-12 right-12 text-right space-y-0 select-none opacity-5 group-hover:opacity-10 transition-opacity">
                    <div className="text-[120px] font-black leading-none uppercase tracking-tighter">ARCH</div>
                    <div className="text-[120px] font-black leading-none uppercase -mt-8 tracking-tighter">TYPE</div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-[600px] border border-muted/20 bg-background/50 backdrop-blur-sm relative overflow-hidden p-6 font-mono group select-none transition-colors duration-500">
            {/* Instruction Overlay */}
            <div className="absolute top-8 left-8 z-40 space-y-2 pointer-events-none">
                <div className="flex items-center gap-2 text-primary">
                    <Globe className="w-4 h-4 animate-spin-slow" />
                    <span className="text-xs font-bold uppercase tracking-[0.4em]">Live_Structural_Graph</span>
                </div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Interact with nodes to isolate flow</p>
            </div>

            {/* Background Grid */}
            <div className='absolute inset-0 bg-[linear-gradient(rgba(128,128,128,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(128,128,128,0.05)_1px,transparent_1px)] bg-[size:40px_40px]' />

            {/* Connections */}
            {connections.map((conn, i) => {
                const start = inputs.find(n => n.id === conn.from)!;
                const end = inputs.find(n => n.id === conn.to)!;
                const isActive = activeNode === conn.from || activeNode === conn.to;

                return <Connection key={i} start={start} end={end} active={isActive} />
            })}

            {/* Nodes */}
            {inputs.map(node => (
                <Node
                    key={node.id}
                    {...node}
                    isActive={activeNode === node.id}
                    onHover={setActiveNode}
                />
            ))}
        </div>
    );
};

export default ArchitectureMap;
