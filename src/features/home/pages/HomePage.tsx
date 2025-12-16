import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Target, Zap, FileText, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Footer from "@/components/Footer";
import AppNavigation from "@/components/AppNavigation";

export default function Home() {
  const [showJDModal, setShowJDModal] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />
      
      {/* Sticky Navigation Buttons */}
      <div className="sticky top-4 z-50 flex justify-center gap-4 px-6 py-4">
        <Link to="/resume-wizard">
          <Button
            variant="secondary"
            size="sm"
            className="flex items-center gap-2 shadow-swiss hover:shadow-accent transition-all duration-200"
          >
            <FileText className="w-4 h-4" />
            Create Resume
          </Button>
        </Link>
        <Link to="/input">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 shadow-swiss hover:shadow-accent transition-all duration-200"
          >
            <Briefcase className="w-4 h-4" />
            JD-Tailored Resume
          </Button>
        </Link>
      </div>
      
      {/* Hero Section */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            AI Resume Evaluator
            <br />
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              & Builder
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Paste your resume. Add a job description. Get an ATS-friendly version in seconds.
          </p>
          
          <Link to="/resume-wizard">
            <Button variant="hero" size="lg" className="text-lg px-8 py-6">
              Start Now
            </Button>
          </Link>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="p-8 text-center border-0 shadow-swiss bg-gradient-card">
            <div className="w-12 h-12 mx-auto mb-4 bg-accent/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3">ATS-Friendly Rewriting</h3>
            <p className="text-muted-foreground">
              Transform your resume to pass through Applicant Tracking Systems with optimized formatting and keywords.
            </p>
          </Card>

          <Card className="p-8 text-center border-0 shadow-swiss bg-gradient-card">
            <div className="w-12 h-12 mx-auto mb-4 bg-accent/20 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Tailored to Job Descriptions</h3>
            <p className="text-muted-foreground">
              Match your resume to specific job requirements with intelligent keyword optimization and content adaptation.
            </p>
          </Card>

          <Card className="p-8 text-center border-0 shadow-swiss bg-gradient-card">
            <div className="w-12 h-12 mx-auto mb-4 bg-accent/20 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Instant Actionable Feedback</h3>
            <p className="text-muted-foreground">
              Get immediate insights with ATS scores, missing keywords, and practical suggestions for improvement.
            </p>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}