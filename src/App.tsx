import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { ResumeProvider } from "@/contexts/ResumeContext";
import Home from "./pages/Home";
import ResumeInput from "./pages/ResumeInput";
import Results from "./pages/Results";
import NotFound from "./pages/NotFound";

// New Wizard Routes
import { WizardLayout } from "./pages/wizard/WizardLayout";
import { TemplateStep } from "./pages/wizard/steps/TemplateStep";
import { PersonalInfoStep } from "./pages/wizard/steps/PersonalInfoStep";
import { SummaryStep } from "./pages/wizard/steps/SummaryStep";
import { ExperienceStep } from "./pages/wizard/steps/ExperienceStep";
import { EducationStep } from "./pages/wizard/steps/EducationStep";
import { SkillsStep } from "./pages/wizard/steps/SkillsStep";
import { ProjectsStep } from "./pages/wizard/steps/ProjectsStep";
import { ReviewStep } from "./pages/wizard/steps/ReviewStep";
import CustomSectionStep from "./pages/wizard/steps/CustomSectionStep";

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
