import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import { ArrowLeft, Save, Eye, Download, Upload, Sparkles, Target, RotateCcw, RotateCw, Trash2, History } from "lucide-react";
import ThemeToggle from "@/shared/components/common/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/shared/ui/dropdown-menu";

// Error boundary wrapper for Navigation
class NavigationErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Navigation Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-2xl font-bold">ResumeAI</h1>
              <div className="text-sm text-muted-foreground">Navigation temporarily unavailable</div>
            </div>
          </div>
        </nav>
      );
    }

    return this.props.children;
  }
}

interface SavedVersion {
  id: string;
  name: string;
  timestamp: string;
  data: any;
}

interface BuilderToolsProps {
  onSave: () => void;
  onPreview: () => void;
  onExport: () => void;
  onImport: () => void;
  onEnhanceAI: () => void;
  onToggleATS?: () => void;
  onClearForm?: () => void;
  onRestoreVersion?: (version: SavedVersion) => void;
  savedVersions?: SavedVersion[];
  showPreview?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

interface NavigationProps {
  builderTools?: BuilderToolsProps;
}

function NavigationContent({ builderTools }: NavigationProps) {
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

              {/* Saved Versions Dropdown */}
              {builderTools.savedVersions && builderTools.savedVersions.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <History className="w-4 h-4 mr-2" /> Versions ({builderTools.savedVersions.length})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                      Saved Versions
                    </div>
                    <DropdownMenuSeparator />
                    {builderTools.savedVersions.map((version) => (
                      <DropdownMenuItem
                        key={version.id}
                        onClick={() => builderTools.onRestoreVersion?.(version)}
                        className="flex flex-col items-start py-2"
                      >
                        <div className="font-medium">{version.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(version.timestamp).toLocaleString()}
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

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

              {/* Undo/Redo Buttons */}
              {builderTools.onUndo && builderTools.onRedo && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={builderTools.onUndo}
                    disabled={builderTools.canUndo === false}
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Undo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={builderTools.onRedo}
                    disabled={builderTools.canRedo === false}
                    className="flex items-center gap-2"
                  >
                    <RotateCw className="w-4 h-4" />
                    Redo
                  </Button>
                </>
              )}

              <Button variant="outline" size="sm" onClick={builderTools.onEnhanceAI}>
                <Sparkles className="w-4 h-4 mr-2" /> Enhance with AI
              </Button>
              {builderTools.onToggleATS && (
                <Button variant="outline" size="sm" onClick={builderTools.onToggleATS}>
                  <Target className="w-4 h-4 mr-2" /> ATS Toggle
                </Button>
              )}

              {/* Clear Form Button */}
              {builderTools.onClearForm && (
                <Button variant="destructive" size="sm" onClick={builderTools.onClearForm}>
                  <Trash2 className="w-4 h-4 mr-2" /> Clear Form
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

export default function Navigation(props: NavigationProps) {
  return (
    <NavigationErrorBoundary>
      <NavigationContent {...props} />
    </NavigationErrorBoundary>
  );
}