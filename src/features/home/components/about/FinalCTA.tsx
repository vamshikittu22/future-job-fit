import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/button';

export const FinalCTA: React.FC = () => {
    return (
        <section className="py-40 bg-background relative overflow-hidden text-center border-t border-border/40">
            <div className="container relative z-10 max-w-7xl mx-auto px-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="space-y-16"
                >
                    <h2 className="text-8xl md:text-[160px] font-black tracking-tighter leading-none text-foreground italic py-4">
                        BUILD THE <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">FUTURE.</span>
                    </h2>
                    <div className="flex flex-col md:flex-row justify-center gap-8">
                        <Link to="/resume-wizard">
                            <Button className="h-24 px-20 rounded-none font-mono bg-foreground text-background hover:bg-primary hover:text-primary-foreground text-2xl font-black tracking-tighter uppercase transition-all shadow-2xl">
                                OPTIMIZE_TALENT &gt;
                            </Button>
                        </Link>
                        <Link to="/">
                            <Button variant="outline" className="h-24 px-16 rounded-none font-mono border-border/40 hover:bg-muted/10 text-xl tracking-widest uppercase transition-all text-foreground">
                                VIEW_HOME
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
