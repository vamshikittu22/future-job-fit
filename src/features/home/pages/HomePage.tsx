import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { CheckCircle, Target, Zap, FileText, Briefcase, Upload, Sparkles, Download, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "@/shared/components/layout/Footer";
import AppNavigation from "@/shared/components/layout/AppNavigation";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />

      {/* Hero Section */}
      <main className="swiss-container swiss-section">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
            Build Your Perfect
            <br />
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              AI-Powered Resume
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Create ATS-optimized resumes with multi-model AI enhancement, real-time preview, and professional exports.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/resume-wizard">
              <Button size="lg" className="text-lg px-8 py-6 shadow-accent">
                <FileText className="w-5 h-5 mr-2" />
                Start Resume Wizard
              </Button>
            </Link>
            <Link to="/input">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                <Briefcase className="w-5 h-5 mr-2" />
                Try Job Optimizer
              </Button>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Link to="/about-platform">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary gap-2 group">
                <Sparkles className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
                <span className="border-b border-transparent group-hover:border-accent/40 transition-colors font-mono tracking-tighter uppercase text-[11px]">
                  The Brain Behind the Tech — View Architecture Case Study
                </span>
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Everything you need to stand out
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="p-6 border-border hover:shadow-swiss transition-all duration-200">
              <div className="w-12 h-12 mb-4 bg-accent/10 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Multi-Model AI Engine</h3>
              <p className="text-muted-foreground">
                Powered by Gemini, OpenAI, and Claude. Choose the best AI for your needs or let us decide automatically.
              </p>
            </Card>

            <Card className="p-6 border-border hover:shadow-swiss transition-all duration-200">
              <div className="w-12 h-12 mb-4 bg-accent/10 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-time ATS Scoring</h3>
              <p className="text-muted-foreground">
                See how your resume performs against Applicant Tracking Systems with instant feedback and suggestions.
              </p>
            </Card>

            <Card className="p-6 border-border hover:shadow-swiss transition-all duration-200">
              <div className="w-12 h-12 mb-4 bg-accent/10 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Intelligent Wizard Flow</h3>
              <p className="text-muted-foreground">
                Step-by-step guidance through every section with smart suggestions and validation.
              </p>
            </Card>

            <Card className="p-6 border-border hover:shadow-swiss transition-all duration-200">
              <div className="w-12 h-12 mb-4 bg-accent/10 rounded-lg flex items-center justify-center">
                <Download className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">PDF / DOCX / JSON Exports</h3>
              <p className="text-muted-foreground">
                Export in multiple formats with pixel-perfect styling and ATS compatibility guaranteed.
              </p>
            </Card>

            <Card className="p-6 border-border hover:shadow-swiss transition-all duration-200">
              <div className="w-12 h-12 mb-4 bg-accent/10 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Autosave & Undo/Redo</h3>
              <p className="text-muted-foreground">
                Never lose your work. Every change is automatically saved with full version history.
              </p>
            </Card>

            <Card className="p-6 border-border hover:shadow-swiss transition-all duration-200">
              <div className="w-12 h-12 mb-4 bg-accent/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Swiss Design System</h3>
              <p className="text-muted-foreground">
                Clean, minimal interface with dark mode support and exceptional typography.
              </p>
            </Card>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How it works
          </h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Enter Your Details</h3>
              <p className="text-muted-foreground text-sm">
                Fill in your information with our intuitive step-by-step wizard.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Enhance with AI</h3>
              <p className="text-muted-foreground text-sm">
                Let AI rewrite your bullets for maximum impact and clarity.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Review ATS Score</h3>
              <p className="text-muted-foreground text-sm">
                Check compatibility and get actionable recommendations.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Export & Apply</h3>
              <p className="text-muted-foreground text-sm">
                Download in your preferred format and start applying.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center py-16 px-6 rounded-2xl bg-gradient-card border border-border">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to build your perfect resume?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who've landed their dream jobs with AI-optimized resumes.
          </p>
          <Link to="/resume-wizard">
            <Button size="lg" className="text-lg px-8 py-6 shadow-accent">
              Get Started — It's Free
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}