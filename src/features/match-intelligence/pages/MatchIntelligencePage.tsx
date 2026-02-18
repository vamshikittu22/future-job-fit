/**
 * Match Intelligence Page
 * 
 * Displays the Match Intelligence Dashboard with all features:
 * - Weighted keyword scoring
 * - Skill clustering visualization
 * - Competency gaps
 * - Semantic similarity
 * - Recruiter heatmap
 * - Recommendations
 * - JD comparison view
 */

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs';
import { MatchDashboard } from '@/features/match-intelligence/components/MatchDashboard';
import { useJob } from '@/shared/contexts/JobContext';
import { useResume } from '@/shared/contexts/ResumeContext';
import AppNavigation from '@/shared/components/layout/AppNavigation';
import Footer from '@/shared/components/layout/Footer';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, FileText, Sparkles } from 'lucide-react';

export default function MatchIntelligencePage() {
  const { currentJob } = useJob();
  const { resumeData } = useResume();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Check if we have data to analyze
  const hasResume = Boolean(resumeData?.personal?.name || resumeData?.experience?.length > 0);
  const hasJobDescription = Boolean(currentJob?.description);

  // If no job description, show empty state with CTA
  if (!hasJobDescription) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavigation />
        <div className="swiss-container swiss-section">
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="text-6xl mb-6">📊</div>
            <h1 className="text-3xl font-bold mb-4">Match Intelligence</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Analyze how well your resume matches job descriptions with advanced scoring,
              skill clustering, and AI-powered recommendations.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <Card className="p-6 text-left">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    1. Add Your Resume
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {!hasResume ? (
                    <Link to="/resume-wizard">
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Resume
                      </Button>
                    </Link>
                  ) : (
                    <p className="text-green-600">✓ Resume added</p>
                  )}
                </CardContent>
              </Card>
              
              <Card className="p-6 text-left">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    2. Add Job Description
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <Link to="/input">
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Import JD
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3 text-sm text-muted-foreground">
              <p>To use Match Intelligence, you need:</p>
              <ul className="list-disc list-inside text-left max-w-sm mx-auto space-y-1">
                <li>A completed resume in the Resume Wizard</li>
                <li>A job description to analyze against</li>
              </ul>
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <Link to="/resume-wizard">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go to Resume Wizard
                </Button>
              </Link>
              <Link to="/input">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Import Job Description
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Main dashboard view
  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />
      <div className="swiss-container swiss-section">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Match Intelligence</h1>
          <p className="text-muted-foreground">
            Application performance analytics for "{currentJob?.title}" at {currentJob?.company}
          </p>
        </div>

        {/* Dashboard */}
        <MatchDashboard 
          features={{
            score: true,
            clusters: true,
            gaps: true,
            similarity: true,
            heatmap: true,
            recommendations: true,
            comparison: true,
          }}
        />

        {/* Quick Actions */}
        <div className="flex justify-center gap-4 mt-8">
          <Link to="/results">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Analysis
            </Button>
          </Link>
          <Link to="/input">
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              New Job Description
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
