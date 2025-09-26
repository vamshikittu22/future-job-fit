import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Eye, Download, Upload, Sparkles, Target, RotateCcw, RotateCw, Trash2, History, MoreHorizontal } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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

interface AppNavigationProps {
  builderTools?: BuilderToolsProps;
}

function NavigationContent({ builderTools }: AppNavigationProps) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-nav">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <h1 className="text-xl font-bold bg-gradient-accent bg-clip-text text-transparent">
              ResumeAI
            </h1>
          </Link>

          {/* Builder Tools (conditionally rendered) */}
          {builderTools && location.pathname === "/create-resume" ? null : builderTools && (
            <div className="flex flex-1 items-center justify-end gap-2 overflow-x-auto py-1 scrollbar-hide">
              {/* Primary Actions */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={builderTools.onSave}>
                  <Save className="w-4 h-4 mr-1" /> Save
                </Button>

                <Button variant="outline" size="sm" onClick={builderTools.onPreview}>
                  <Eye className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">{builderTools.showPreview ? "Hide" : "Show"} Preview</span>
                </Button>

                <Button variant="secondary" size="sm" onClick={builderTools.onExport}>
                  <Download className="w-4 h-4 mr-1" /> Export
                </Button>
              </div>

              {/* Secondary Actions Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                    <MoreHorizontal className="h-4 h-4" />
                    <span className="sr-only">More actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={builderTools.onImport}>
                    <Upload className="w-4 h-4 mr-2" /> Import
                  </DropdownMenuItem>

                  {builderTools.onUndo && builderTools.onRedo && (
                    <>
                      <DropdownMenuItem
                        onClick={builderTools.onUndo}
                        disabled={!builderTools.canUndo}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" /> Undo
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={builderTools.onRedo}
                        disabled={!builderTools.canRedo}
                      >
                        <RotateCw className="w-4 h-4 mr-2" /> Redo
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuItem onClick={builderTools.onEnhanceAI}>
                    <Sparkles className="w-4 h-4 mr-2" /> Enhance with AI
                  </DropdownMenuItem>

                  {builderTools.onClearForm && (
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={builderTools.onClearForm}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Clear Form
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Saved Versions Dropdown */}
              {builderTools.savedVersions && builderTools.savedVersions.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <History className="w-4 h-4 mr-1" /> Versions
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
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center gap-2 ml-auto">
            <ThemeToggle />
            {!isHome && (
              <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Home
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

export default function AppNavigation(props: AppNavigationProps) {
  // Add scrollbar hide styles to the document head
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .scrollbar-hide {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
      }
      .scrollbar-hide::-webkit-scrollbar {
        display: none;  /* Chrome, Safari and Opera */
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <NavigationErrorBoundary>
      <NavigationContent {...props} />
    </NavigationErrorBoundary>
  );
}
