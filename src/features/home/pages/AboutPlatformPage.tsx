import React, { useState, useEffect } from 'react';
import { useScroll, useSpring } from 'framer-motion';
import AppNavigation from '@/shared/components/layout/AppNavigation';
import Footer from '@/shared/components/layout/Footer';

// Componentized Sections
import { VisionHero } from '../components/about/VisionHero';
import { TechStackSection } from '../components/about/TechStackSection';
import { ResilienceSection } from '../components/about/ResilienceSection';
import { PerformanceSection } from '../components/about/PerformanceSection';
import { IntelligenceSection } from '../components/about/IntelligenceSection';
import { FidelitySection } from '../components/about/FidelitySection';
import { TaxonomySection } from '../components/about/TaxonomySection';
import { VersatilitySection } from '../components/about/VersatilitySection';
import { AestheticsSection } from '../components/about/AestheticsSection';
import { StrategySection } from '../components/about/StrategySection';
import { CapacitySection } from '../components/about/CapacitySection';
import { OutcomesSection } from '../components/about/OutcomesSection';
import { FinalCTA } from '../components/about/FinalCTA';

// UI Helpers
import { AboutNavigation } from '../components/about/AboutNavigation';
import { ScrollProgress } from '../components/about/ScrollProgress';
import { ABOUT_SECTIONS } from '../components/about/constants';

const AboutPlatformPage: React.FC = () => {
    const [activeSection, setActiveSection] = useState('overview');
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveSection(entry.target.id);
                });
            },
            { threshold: 0.1, rootMargin: "-20% 0px -40% 0px" }
        );

        ABOUT_SECTIONS.forEach((s) => {
            const el = document.getElementById(s.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans transition-colors duration-500 overflow-x-hidden">
            <ScrollProgress scaleX={scaleX} />

            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.03)_0%,transparent_50%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
            </div>

            <AboutNavigation activeSection={activeSection} />

            <AppNavigation />

            <main className="relative z-10 w-full pt-20">
                <VisionHero />
                <TechStackSection />
                <ResilienceSection />
                <PerformanceSection />
                <IntelligenceSection />
                <FidelitySection />
                <TaxonomySection />
                <VersatilitySection />
                <AestheticsSection />
                <StrategySection />
                <CapacitySection />
                <OutcomesSection />
                <FinalCTA />
            </main>

            <Footer />
        </div>
    );
};

export default AboutPlatformPage;
