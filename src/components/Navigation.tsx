import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Eye, Download, Upload, Sparkles, Target } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

interface BuilderToolsProps {
  onSave: () => void;
  onPreview: () => void;
  onExport: () => void;
  onImport: () => void;
  onEnhanceAI: () => void;
  onToggleATS?: () => void;
  showPreview?: boolean;
}

interface NavigationProps {
  builderTools?: BuilderToolsProps;
}

export default function Navigation({ builderTools }: NavigationProps) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-nav">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-accent bg-clip-text text-transparent">
              ResumeAI
            </h1>
          </Link>

          {/* Builder Tools (conditionally rendered) */}
          {builderTools && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={builderTools.onSave}>
                <Save className="w-4 h-4 mr-2" /> Save
              </Button>
              <Button variant="outline" size="sm" onClick={builderTools.onPreview}>
                <Eye className="w-4 h-4 mr-2" />
                {builderTools.showPreview ? "Hide Preview" : "Show Preview"}
              </Button>
              <Button variant="outline" size="sm" onClick={builderTools.onImport}>
                <Upload className="w-4 h-4 mr-2" /> Import
              </Button>
              <Button variant="secondary" size="sm" onClick={builderTools.onExport}>
                <Download className="w-4 h-4 mr-2" /> Export
              </Button>
              <Button variant="outline" size="sm" onClick={builderTools.onEnhanceAI}>
                <Sparkles className="w-4 h-4 mr-2" /> Enhance with AI
              </Button>
              {builderTools.onToggleATS && (
                <Button variant="outline" size="sm" onClick={builderTools.onToggleATS}>
                  <Target className="w-4 h-4 mr-2" /> ATS Toggle
                </Button>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {!isHome && (
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Home
                </Link>
              </Button>
            )}
            {location.pathname !== "/input" && (
              <Button variant="outline" size="sm" asChild>
                <Link to="/input">New Analysis</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}