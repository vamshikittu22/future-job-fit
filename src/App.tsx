import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import { ResumeProvider } from "@/contexts/ResumeContext";
import Home from "./pages/Home";
import ResumeInput from "./pages/ResumeInput";
import Results from "./pages/Results";
import ResumeBuilder from "./pages/ResumeBuilder";
import CreateResumeBuilder from "./pages/CreateResumeBuilder";
import NewResumePage from "./pages/NewResumePage";
import EnhancedResumeBuilder from "./pages/EnhancedResumeBuilder";
import ResumeWizard from "./pages/ResumeWizard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <ResumeProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/input" element={<ResumeInput />} />
              <Route path="/results" element={<Results />} />
              <Route path="/builder" element={<ResumeBuilder />} />
              <Route path="/create-resume" element={<CreateResumeBuilder />} />
              <Route path="/new-resume" element={<NewResumePage />} />
              <Route path="/enhanced-resume" element={<EnhancedResumeBuilder />} />
              <Route path="/resume-wizard" element={<ResumeWizard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ResumeProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
