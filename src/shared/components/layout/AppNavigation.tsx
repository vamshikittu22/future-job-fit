import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/shared/ui/button";
import {
  ArrowLeft, Save, Eye, Download, Upload, Sparkles,
  RotateCcw, RotateCw, Trash2, History, MoreHorizontal, Zap
} from "lucide-react";
import ThemeToggle from "@/shared/components/common/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/shared/ui/dropdown-menu";

// ─── Error Boundary ───────────────────────────────────────────
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
    console.error("Navigation Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl">
          <nav className="nav-floating px-6 py-3">
            <div className="flex items-center justify-between">
              <span className="brand-logo">FutureJobFit</span>
              <span className="text-sm text-muted-foreground">Navigation temporarily unavailable</span>
            </div>
          </nav>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Types ────────────────────────────────────────────────────
interface SavedVersion {
  id: string;
  name: string;
  timestamp: string;
  data: unknown;
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

// ─── Nav Links ────────────────────────────────────────────────
const NAV_LINKS = [
  { to: "/input", label: "Job Optimizer" },
  { to: "/match-intelligence", label: "Match AI" },
  { to: "/resume-wizard", label: "Resume Wizard" },
  { to: "/about-platform", label: "Architecture" },
];

// ─── NavigationContent ───────────────────────────────────────
function NavigationContent({ builderTools }: AppNavigationProps) {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isWizard = location.pathname.startsWith("/resume-wizard");

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-5xl pointer-events-none">
      <nav className="nav-floating pointer-events-auto">
        <div className="flex items-center gap-3 px-4 py-2.5">
          {/* ── Brand ────────────────────────────────── */}
          <Link
            to="/"
            className="flex items-center gap-2 flex-shrink-0 group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-accent flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
              <Zap className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <span className="brand-logo hidden sm:block">FutureJobFit</span>
          </Link>

          {/* ── Divider ──────────────────────────────── */}
          <div className="hidden md:block h-5 w-px bg-border mx-1 flex-shrink-0" />

          {/* ── Nav Links (home page only) ───────────── */}
          {isHome && (
            <div className="hidden md:flex items-center gap-1 flex-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-180 cursor-pointer"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* ── Spacer ───────────────────────────────── */}
          <div className="flex-1" />

          {/* ── Builder Tools ────────────────────────── */}
          {builderTools && !isWizard && (
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              <Button
                variant="outline"
                size="sm"
                onClick={builderTools.onSave}
                className="cursor-pointer flex-shrink-0 h-8 text-xs"
              >
                <Save className="w-3.5 h-3.5 mr-1" />
                Save
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={builderTools.onPreview}
                className="cursor-pointer flex-shrink-0 h-8 text-xs"
              >
                <Eye className="w-3.5 h-3.5 mr-1" />
                <span className="hidden sm:inline">
                  {builderTools.showPreview ? "Hide" : "Show"} Preview
                </span>
              </Button>

              <Button
                size="sm"
                onClick={builderTools.onExport}
                className="cursor-pointer flex-shrink-0 h-8 text-xs bg-gradient-accent border-0 hover:opacity-90"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                Export
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer h-8 w-8 p-0 flex-shrink-0"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem
                    onClick={builderTools.onImport}
                    className="cursor-pointer"
                  >
                    <Upload className="w-4 h-4 mr-2" /> Import
                  </DropdownMenuItem>
                  {builderTools.onUndo && builderTools.onRedo && (
                    <>
                      <DropdownMenuItem
                        onClick={builderTools.onUndo}
                        disabled={!builderTools.canUndo}
                        className="cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" /> Undo
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={builderTools.onRedo}
                        disabled={!builderTools.canRedo}
                        className="cursor-pointer"
                      >
                        <RotateCw className="w-4 h-4 mr-2" /> Redo
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem
                    onClick={builderTools.onEnhanceAI}
                    className="cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 mr-2" /> Enhance with AI
                  </DropdownMenuItem>
                  {builderTools.onClearForm && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive cursor-pointer"
                        onClick={builderTools.onClearForm}
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Clear Form
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {builderTools.savedVersions && builderTools.savedVersions.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer flex-shrink-0 h-8 text-xs"
                    >
                      <History className="w-3.5 h-3.5 mr-1" /> Versions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground overline">
                      Saved Versions
                    </div>
                    <DropdownMenuSeparator />
                    {builderTools.savedVersions.map((version) => (
                      <DropdownMenuItem
                        key={version.id}
                        onClick={() => builderTools.onRestoreVersion?.(version)}
                        className="flex flex-col items-start py-2 cursor-pointer"
                      >
                        <div className="font-medium text-sm">{version.name}</div>
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

          {/* ── Right Actions ─────────────────────────── */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <ThemeToggle />
            {!isHome && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="cursor-pointer h-8 text-xs"
              >
                <Link to="/">
                  <ArrowLeft className="w-3.5 h-3.5 sm:mr-1" />
                  <span className="hidden sm:inline">Home</span>
                </Link>
              </Button>
            )}
            {location.pathname !== "/input" && (
              <Button
                size="sm"
                asChild
                className="cursor-pointer h-8 text-xs bg-gradient-accent border-0 hover:opacity-90 hidden sm:flex"
              >
                <Link to="/input">New Analysis</Link>
              </Button>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────
export default function AppNavigation(props: AppNavigationProps) {
  return (
    <NavigationErrorBoundary>
      <NavigationContent {...props} />
    </NavigationErrorBoundary>
  );
}
