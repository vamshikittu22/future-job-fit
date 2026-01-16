import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Cpu, Globe, Layout, FileText, Code2, ShieldCheck, Zap } from 'lucide-react';
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
    { id: 'state', label: 'State Manager', icon: <Cpu className="w-6 h-6" />, x: 350, y: 300, description: 'Zustand stores with optimistic UI updates.' },
    { id: 'validation', label: 'Zod Guard', icon: <ShieldCheck className="w-6 h-6" />, x: 350, y: 100, description: 'Runtime schema validation ensuring type safety.' },
    { id: 'ai', label: 'AI Engine', icon: <Zap className="w-6 h-6" />, x: 600, y: 150, description: 'Edge Functions bridging Gemini 1.5 & GPT-4.' },
    { id: 'storage', label: 'Persistence', icon: <Database className="w-6 h-6" />, x: 600, y: 450, description: 'IndexedDB wrapper for offline-first capability.' },
    { id: 'render', label: 'PDF Worker', icon: <FileText className="w-6 h-6" />, x: 850, y: 300, description: 'Off-main-thread generation avoiding UI blocking.' },
];

const connections = [
    { from: 'client', to: 'state' },
    { from: 'state', to: 'validation' },
    { from: 'validation', to: 'state' },
    { from: 'state', to: 'ai' },
    { from: 'ai', to: 'state' },
    { from: 'state', to: 'storage' },
    { from: 'state', to: 'render' },
];

const ArchitectureMap: React.FC = () => {
    const [activeNode, setActiveNode] = useState<string | null>(null);

    return (
        <div className="w-full h-[600px] border border-white/10 bg-black/50 backdrop-blur-sm relative overflow-hidden group select-none">
            {/* Instruction Overlay */}
            <div className="absolute top-6 left-6 z-40 space-y-2 pointer-events-none">
                <div className="flex items-center gap-2 text-accent">
                    <Globe className="w-4 h-4 animate-spin-slow" />
                    <span className="text-xs font-mono uppercase tracking-[0.2em] font-bold">Live_Architecture_Graph</span>
                </div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Hover nodes to inspect data flow</p>
            </div>

            {/* Background Grid */}
            <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]' />

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
