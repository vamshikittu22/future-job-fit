import React from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/lib/utils';

/**
 * Technical Annotation Component
 */
export const TechnicalAnnotation: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="p-8 border border-border/40 bg-card/50 backdrop-blur-sm relative group overflow-hidden shadow-sm hover:shadow-md transition-all">
        <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 -translate-y-8 translate-x-8 rotate-45" />
        <div className="flex items-start gap-4 mb-4">
            <Terminal className="w-4 h-4 text-primary mt-1" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-foreground font-bold">{title}</span>
        </div>
        <div className="text-xs text-muted-foreground leading-relaxed font-mono">
            {children}
        </div>
        <div className="mt-4 flex gap-2">
            <div className="h-1 w-8 bg-primary/20" />
            <div className="h-1 w-2 bg-primary/40" />
        </div>
    </div>
);

/**
 * Swiss Section Component
 */
export const SwissSection: React.FC<{
    number: string;
    id: string;
    title: string;
    subtitle: string;
    children: React.ReactNode;
    accentColor?: string;
    titleClassName?: string;
    subtitleClassName?: string;
    className?: string;
    description?: string;
}> = ({ number, id, title, subtitle, children, accentColor = "bg-primary", titleClassName, subtitleClassName, className, description }) => (
    <section id={id} className={cn("relative py-24 md:py-32 border-t border-border/40 scroll-mt-20 overflow-hidden", className)}>
        {/* Subtle Background Grid - Adaptive for Light/Dark */}
        <div className="absolute inset-0 bg-[radial-gradient(#00000010_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="container relative z-10 max-w-[1400px] mx-auto px-8 lg:px-16">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">

                {/* Header Information (approx 5/12 cols) */}
                <div className="lg:col-span-5 space-y-8 sticky top-32">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-4"
                    >
                        <div className={cn("w-14 h-14 flex items-center justify-center text-white font-black text-xl shadow-xl relative overflow-hidden group rounded-sm", accentColor)}>
                            <span className="relative z-10">{number}</span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </div>
                        <div className={cn("h-px w-12", subtitleClassName ? subtitleClassName.split(' ')[0].replace('text-', 'bg-') : "bg-border")} />
                        <Badge variant="outline" className={cn("rounded-none border-primary/40 text-[10px] font-mono tracking-widest px-3 py-1", subtitleClassName || "text-foreground")}>
                            MODULE_{number}
                        </Badge>
                    </motion.div>

                    <div className="space-y-4">
                        <h2 className={cn("text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase italic", titleClassName || "text-foreground")}>
                            {title}
                        </h2>
                        <p className={cn("text-xs font-mono uppercase tracking-[0.2em] font-bold", subtitleClassName || "text-primary")}>
                            {subtitle}
                        </p>
                    </div>

                    {description && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="space-y-6"
                        >
                            <div className={cn("h-px w-full opacity-60", subtitleClassName ? subtitleClassName.split(' ')[0].replace('text-', 'bg-') : "bg-border")} />
                            <p className="text-sm text-foreground/80 leading-relaxed font-medium max-w-sm">
                                {description}
                            </p>
                        </motion.div>
                    )}
                </div>

                {/* Content Area (approx 7/12 cols) */}
                <div className="lg:col-span-7">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        {children}
                    </motion.div>
                </div>
            </div>
        </div>
    </section>
);
