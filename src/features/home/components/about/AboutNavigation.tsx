import React from 'react';
import { cn } from '@/shared/lib/utils';
import { ABOUT_SECTIONS } from './constants';

interface AboutNavigationProps {
    activeSection: string;
}

export const AboutNavigation: React.FC<AboutNavigationProps> = ({ activeSection }) => {
    return (
        <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden 2xl:flex flex-col gap-6">
            {ABOUT_SECTIONS.map((section) => (
                <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="group relative flex items-center justify-center p-2"
                >
                    <div className={cn(
                        "w-1.5 h-1.5 transition-all duration-300 rotate-45",
                        activeSection === section.id
                            ? "bg-primary scale-[2.5] shadow-[0_0_10px_rgba(59,130,246,0.4)]"
                            : "bg-muted-foreground/20 hover:bg-muted-foreground/40"
                    )} />

                    <div className={cn(
                        "absolute left-10 px-3 py-1 border border-muted/20 backdrop-blur-md transition-all duration-300 pointer-events-none opacity-0 group-hover:opacity-100",
                        activeSection === section.id && "opacity-100 border-primary/20 bg-primary/5"
                    )}>
                        <span className="text-[9px] font-mono whitespace-nowrap uppercase tracking-widest text-foreground font-bold">
                            {section.title}
                        </span>
                    </div>
                </a>
            ))}
        </div>
    );
};
