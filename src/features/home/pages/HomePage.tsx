import { Button } from "@/shared/ui/button";
import {
  CheckCircle, Target, Zap, FileText, Briefcase,
  Sparkles, Download, Shield, ArrowRight, ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "@/shared/components/layout/Footer";
import AppNavigation from "@/shared/components/layout/AppNavigation";

// ─── Animation variants ────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

// ─── Feature Data ──────────────────────────────────────────────
const FEATURES = [
  {
    icon: Sparkles,
    label: "Multi-Model AI Engine",
    desc: "Powered by Gemini, OpenAI, and Claude. Choose the best AI for your needs or let us decide automatically.",
    accent: "primary",
  },
  {
    icon: Target,
    label: "Real-time ATS Scoring",
    desc: "See how your resume performs against Applicant Tracking Systems with instant feedback.",
    accent: "accent",
  },
  {
    icon: Zap,
    label: "Intelligent Wizard Flow",
    desc: "Step-by-step guidance through every section with smart suggestions and validation.",
    accent: "primary",
  },
  {
    icon: Download,
    label: "PDF / DOCX / JSON",
    desc: "Export in multiple formats with pixel-perfect styling and ATS compatibility guaranteed.",
    accent: "accent",
  },
  {
    icon: Shield,
    label: "Autosave & Undo/Redo",
    desc: "Never lose your work. Every change is automatically saved with full version history.",
    accent: "primary",
  },
  {
    icon: CheckCircle,
    label: "Swiss Design System",
    desc: "Clean, minimal interface with dark mode support and exceptional typography.",
    accent: "accent",
  },
];

const STEPS = [
  { n: "01", label: "Enter Your Details", desc: "Fill in your information with our intuitive step-by-step wizard." },
  { n: "02", label: "Enhance with AI", desc: "Let AI rewrite your bullets for maximum impact and clarity." },
  { n: "03", label: "Review ATS Score", desc: "Check compatibility and get actionable recommendations." },
  { n: "04", label: "Export & Apply", desc: "Download in your preferred format and start applying." },
];

const STATS = [
  { value: "3×", label: "More interviews" },
  { value: "98%", label: "ATS pass rate" },
  { value: "< 5 min", label: "Resume built" },
];

// ─── HomePage ──────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ paddingTop: "calc(5rem + 3rem)", paddingBottom: "6rem" }}
      >
        {/* Ambient background orbs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          {/* Top center glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-[0.07] dark:opacity-[0.12] blur-3xl"
            style={{ background: "var(--gradient-vibrant)" }} />
          {/* Left glow */}
          <div className="absolute top-1/3 -left-64 w-[600px] h-[600px] rounded-full opacity-[0.05] dark:opacity-[0.08] blur-3xl"
            style={{ background: "hsl(231 100% 62%)" }} />
          {/* Right glow */}
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.04] dark:opacity-[0.07] blur-3xl"
            style={{ background: "hsl(265 85% 65%)" }} />
        </div>

        <div className="swiss-container">
          <div className="max-w-4xl mx-auto text-center">
            {/* Pill badge */}
            <motion.div
              initial="hidden"
              animate="visible"
              custom={0}
              variants={fadeUp}
              className="flex justify-center mb-8"
            >
              <div className="neon-pill">
                <Sparkles className="w-3 h-3" aria-hidden="true" />
                AI-Powered Career Intelligence
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial="hidden"
              animate="visible"
              custom={0.08}
              variants={fadeUp}
              className="font-bold tracking-tight text-balance mb-6"
              style={{
                fontSize: "clamp(2.75rem, 7vw, 5.5rem)",
                lineHeight: "1.04",
                letterSpacing: "-0.03em",
              }}
            >
              Build Your Perfect
              <br />
              <span className="gradient-text-animated">
                AI-Powered Resume
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial="hidden"
              animate="visible"
              custom={0.16}
              variants={fadeUp}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed text-balance"
            >
              Create ATS-optimized resumes with multi-model AI enhancement,
              real-time preview, and professional exports — in under 5 minutes.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial="hidden"
              animate="visible"
              custom={0.24}
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8"
            >
              <Link to="/resume-wizard">
                <Button
                  size="lg"
                  id="cta-resume-wizard"
                  className="cursor-pointer text-base px-7 py-5 h-auto bg-gradient-accent border-0 hover:opacity-90 shadow-accent transition-opacity duration-200 group"
                >
                  <FileText className="w-4.5 h-4.5 mr-2" aria-hidden="true" />
                  Start Resume Wizard
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                </Button>
              </Link>
              <Link to="/input">
                <Button
                  variant="outline"
                  size="lg"
                  id="cta-job-optimizer"
                  className="cursor-pointer text-base px-7 py-5 h-auto hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                >
                  <Briefcase className="w-4.5 h-4.5 mr-2" aria-hidden="true" />
                  Try Job Optimizer
                </Button>
              </Link>
            </motion.div>

            {/* Architecture link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Link to="/about-platform">
                <Button
                  variant="ghost"
                  size="sm"
                  id="cta-architecture"
                  className="cursor-pointer text-muted-foreground hover:text-primary gap-2 group h-auto py-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-primary/60" aria-hidden="true" />
                  <span className="text-xs font-mono tracking-widest uppercase border-b border-transparent group-hover:border-primary/40 transition-colors">
                    The Brain Behind the Tech — View Architecture
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 -ml-1 group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ───────────────────────────────────────── */}
      <section className="border-y border-border bg-muted/40">
        <div className="swiss-container py-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid grid-cols-3 divide-x divide-border"
          >
            {STATS.map((s) => (
              <motion.div
                key={s.label}
                variants={fadeUp}
                className="px-4 sm:px-10 text-center first:pl-0 last:pr-0"
              >
                <div
                  className="font-bold text-gradient-accent mb-0.5"
                  style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", letterSpacing: "-0.02em" }}
                >
                  {s.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <main className="swiss-container">
        {/* ── Features Grid ─────────────────────────────────── */}
        <section className="swiss-section" aria-labelledby="features-heading">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            {/* Section header */}
            <motion.div variants={fadeUp} className="mb-14 max-w-xl">
              <div className="overline mb-3">Platform Capabilities</div>
              <h2
                id="features-heading"
                className="font-bold text-balance mb-4"
                style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", letterSpacing: "-0.02em", lineHeight: "1.1" }}
              >
                Everything you need to stand out
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                A complete AI toolkit built for modern job seekers. From resume building to ATS optimization — all in one place.
              </p>
            </motion.div>

            {/* Swiss grid rule */}
            <div className="swiss-divider mb-12 w-full" />

            {/* Feature cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                const isAccent = f.accent === "accent";
                return (
                  <motion.div
                    key={f.label}
                    variants={fadeUp}
                    custom={i * 0.06}
                    className="feature-card gradient-border-card group"
                    role="article"
                  >
                    <div
                      className="icon-container mb-5"
                      style={{
                        background: isAccent
                          ? "hsl(var(--accent) / 0.1)"
                          : "hsl(var(--primary) / 0.1)",
                        borderColor: isAccent
                          ? "hsl(var(--accent) / 0.2)"
                          : "hsl(var(--primary) / 0.2)",
                        color: isAccent
                          ? "hsl(var(--accent))"
                          : "hsl(var(--primary))",
                      }}
                    >
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-base font-semibold mb-2 tracking-tight">
                      {f.label}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {f.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* ── How It Works ──────────────────────────────────── */}
        <section className="swiss-section" aria-labelledby="how-it-works-heading">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            {/* Section header */}
            <motion.div variants={fadeUp} className="mb-14 max-w-xl">
              <div className="overline mb-3">Process</div>
              <h2
                id="how-it-works-heading"
                className="font-bold text-balance mb-4"
                style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", letterSpacing: "-0.02em", lineHeight: "1.1" }}
              >
                How it works
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Four simple steps from raw info to a polished, AI-enhanced resume ready to land interviews.
              </p>
            </motion.div>

            {/* Swiss divider */}
            <div className="swiss-divider mb-12 w-full" />

            {/* Steps */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {/* Connecting line (decorative, desktop only) */}
              <div
                aria-hidden="true"
                className="absolute top-7 left-[12.5%] right-[12.5%] h-px hidden lg:block"
                style={{ background: "var(--gradient-border)", opacity: 0.25 }}
              />

              {STEPS.map((step, i) => (
                <motion.div
                  key={step.n}
                  variants={fadeUp}
                  custom={i * 0.08}
                  className="relative"
                >
                  <div className="flex flex-col items-start gap-4">
                    <div className="step-number">{step.n}</div>
                    <div>
                      <h3 className="text-sm font-semibold mb-1.5 tracking-tight">
                        {step.label}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      </main>

      {/* ── Final CTA ─────────────────────────────────────────── */}
      <section className="swiss-container pb-20">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          className="cta-section px-8 py-20 text-center"
        >
          {/* Decorative glow */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 rounded-2xl overflow-hidden pointer-events-none"
          >
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-3xl opacity-[0.06] dark:opacity-[0.1]"
              style={{ background: "var(--gradient-vibrant)" }}
            />
          </div>

          <div className="overline mb-4 text-center">Get Started</div>
          <h2
            className="font-bold text-balance mb-4 mx-auto"
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 3rem)",
              letterSpacing: "-0.025em",
              lineHeight: "1.1",
              maxWidth: "28rem",
            }}
          >
            Ready to build your perfect resume?
          </h2>
          <p className="text-base text-muted-foreground mb-10 max-w-lg mx-auto leading-relaxed text-balance">
            Join thousands of job seekers who've landed their dream jobs with AI-optimized resumes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/resume-wizard">
              <Button
                size="lg"
                id="cta-get-started"
                className="cursor-pointer text-base px-8 py-5 h-auto bg-gradient-accent border-0 hover:opacity-90 shadow-accent transition-opacity duration-200 animate-pulse-glow group"
              >
                Get Started — It's Free
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
              </Button>
            </Link>
            <Link to="/input">
              <Button
                variant="outline"
                size="lg"
                id="cta-optimize-job"
                className="cursor-pointer text-base px-7 py-5 h-auto hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
              >
                Optimize a Job First
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}