import { Toaster } from "@/shared/ui/toaster";
import { Toaster as Sonner } from "@/shared/ui/sonner";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/shared/providers/theme-provider";
import { ResumeProvider } from "@/shared/contexts/ResumeContext";
import Home from "@/features/home/pages/HomePage";
import ResumeInput from "@/features/job-optimizer/pages/JobInputPage";
import Results from "@/features/job-optimizer/pages/AnalysisResultPage";
import NotFound from "@/features/home/pages/NotFoundPage";

// New Wizard Routes
import { WizardLayout } from "@/features/resume-builder/components/layout/WizardLayout";
import { TemplateStep } from "@/features/resume-builder/components/editor/steps/TemplateStep";
import { PersonalInfoStep } from "@/features/resume-builder/components/editor/steps/PersonalInfoStep";
import { SummaryStep } from "@/features/resume-builder/components/editor/steps/SummaryStep";
import { ExperienceStep } from "@/features/resume-builder/components/editor/steps/ExperienceStep";
import { EducationStep } from "@/features/resume-builder/components/editor/steps/EducationStep";
import { SkillsStep } from "@/features/resume-builder/components/editor/steps/SkillsStep";
import { ProjectsStep } from "@/features/resume-builder/components/editor/steps/ProjectsStep";
import { AchievementsStep } from "@/features/resume-builder/components/editor/steps/AchievementsStep";
import { CertificationsStep } from "@/features/resume-builder/components/editor/steps/CertificationsStep";
import { ReviewStep } from "@/features/resume-builder/components/editor/steps/ReviewStep";
import CustomSectionStep from "@/features/resume-builder/components/editor/steps/CustomSectionStep";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/input", element: <ResumeInput /> },
  { path: "/results", element: <Results /> },
  {
    path: "/resume-wizard",
    element: <WizardLayout />,
    children: [
      { index: true, element: <TemplateStep /> },
      { path: "template", element: <TemplateStep /> },
      { path: "personal", element: <PersonalInfoStep /> },
      { path: "summary", element: <SummaryStep /> },
      { path: "experience", element: <ExperienceStep /> },
      { path: "education", element: <EducationStep /> },
      { path: "skills", element: <SkillsStep /> },
      { path: "projects", element: <ProjectsStep /> },
      { path: "achievements", element: <AchievementsStep /> },
      { path: "certifications", element: <CertificationsStep /> },
      { path: "review", element: <ReviewStep /> },
      { path: "custom/:id", element: <CustomSectionStep /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <ResumeProvider>
          <Toaster />
          <Sonner />
          <RouterProvider router={router} />
        </ResumeProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
