import { Suspense, lazy } from "react";
import { Toaster } from "@/shared/ui/toaster";
import { Toaster as Sonner } from "@/shared/ui/sonner";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/shared/providers/theme-provider";
import { ResumeProvider } from "@/shared/contexts/ResumeContext";
import { APIKeyProvider } from "@/shared/contexts/APIKeyContext";

// Eagerly loaded - small and needed immediately
import Home from "@/features/home/pages/HomePage";
import NotFound from "@/features/home/pages/NotFoundPage";

// Lazy loaded - heavy features loaded on-demand
const AboutPlatform = lazy(() => import("@/features/home/pages/AboutPlatformPage"));
const ResumeInput = lazy(() => import("@/features/job-optimizer/pages/JobInputPage"));
const Results = lazy(() => import("@/features/job-optimizer/pages/AnalysisResultPage"));

// Wizard Layout - lazy load the entire wizard feature
const WizardLayout = lazy(() => import("@/features/resume-builder/components/layout/WizardLayout").then(m => ({ default: m.WizardLayout })));

// Wizard Steps - lazy loaded individually
const TemplateStep = lazy(() => import("@/features/resume-builder/components/editor/steps/TemplateStep").then(m => ({ default: m.TemplateStep })));
const PersonalInfoStep = lazy(() => import("@/features/resume-builder/components/editor/steps/PersonalInfoStep").then(m => ({ default: m.PersonalInfoStep })));
const SummaryStep = lazy(() => import("@/features/resume-builder/components/editor/steps/SummaryStep").then(m => ({ default: m.SummaryStep })));
const ExperienceStep = lazy(() => import("@/features/resume-builder/components/editor/steps/ExperienceStep").then(m => ({ default: m.ExperienceStep })));
const EducationStep = lazy(() => import("@/features/resume-builder/components/editor/steps/EducationStep").then(m => ({ default: m.EducationStep })));
const SkillsStep = lazy(() => import("@/features/resume-builder/components/editor/steps/SkillsStep").then(m => ({ default: m.SkillsStep })));
const ProjectsStep = lazy(() => import("@/features/resume-builder/components/editor/steps/ProjectsStep").then(m => ({ default: m.ProjectsStep })));
const AchievementsStep = lazy(() => import("@/features/resume-builder/components/editor/steps/AchievementsStep").then(m => ({ default: m.AchievementsStep })));
const CertificationsStep = lazy(() => import("@/features/resume-builder/components/editor/steps/CertificationsStep").then(m => ({ default: m.CertificationsStep })));
const ReviewStep = lazy(() => import("@/features/resume-builder/components/editor/steps/ReviewStep").then(m => ({ default: m.ReviewStep })));
const CustomSectionStep = lazy(() => import("@/features/resume-builder/components/editor/steps/CustomSectionStep"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const queryClient = new QueryClient();

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/about-platform", element: <Suspense fallback={<PageLoader />}><AboutPlatform /></Suspense> },
  { path: "/input", element: <Suspense fallback={<PageLoader />}><ResumeInput /></Suspense> },
  { path: "/results", element: <Suspense fallback={<PageLoader />}><Results /></Suspense> },
  {
    path: "/resume-wizard",
    element: <Suspense fallback={<PageLoader />}><WizardLayout /></Suspense>,
    children: [
      { index: true, element: <Suspense fallback={null}><TemplateStep /></Suspense> },
      { path: "template", element: <Suspense fallback={null}><TemplateStep /></Suspense> },
      { path: "personal", element: <Suspense fallback={null}><PersonalInfoStep /></Suspense> },
      { path: "summary", element: <Suspense fallback={null}><SummaryStep /></Suspense> },
      { path: "experience", element: <Suspense fallback={null}><ExperienceStep /></Suspense> },
      { path: "education", element: <Suspense fallback={null}><EducationStep /></Suspense> },
      { path: "skills", element: <Suspense fallback={null}><SkillsStep /></Suspense> },
      { path: "projects", element: <Suspense fallback={null}><ProjectsStep /></Suspense> },
      { path: "achievements", element: <Suspense fallback={null}><AchievementsStep /></Suspense> },
      { path: "certifications", element: <Suspense fallback={null}><CertificationsStep /></Suspense> },
      { path: "review", element: <Suspense fallback={null}><ReviewStep /></Suspense> },
      { path: "custom/:id", element: <Suspense fallback={null}><CustomSectionStep /></Suspense> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <APIKeyProvider>
          <ResumeProvider>
            <Toaster />
            <Sonner />
            <RouterProvider router={router} />
          </ResumeProvider>
        </APIKeyProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
