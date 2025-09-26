import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Save,
  Eye,
  Download,
  Upload,
  Sparkles,
  RotateCcw,
  RotateCw,
  Trash2,
  History,
  MoreHorizontal,
  FileText,
  Printer
} from "lucide-react";

interface ResumeBuilderHeaderProps {
  onSave: () => void;
  onPreview: () => void;
  onExport: () => void;
  onImport: () => void;
  onEnhanceAI: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onClearForm?: () => void;
  onRestoreVersion?: (version: any) => void;
  savedVersions?: any[];
  showPreview: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  currentPage: number;
  totalPages: number;
}

export default function ResumeBuilderHeader({
  onSave,
  onPreview,
  onExport,
  onImport,
  onEnhanceAI,
  onUndo,
  onRedo,
  onClearForm,
  onRestoreVersion,
  savedVersions,
  showPreview,
  canUndo,
  canRedo,
  currentPage,
  totalPages,
}: ResumeBuilderHeaderProps) {
  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left Section - Title and Page Info */}
          <div className="flex items-center gap-4">
            <FileText className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Resume Builder</h1>
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
          </div>

          {/* Right Section - Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Primary Actions */}
            <Button variant="outline" size="sm" onClick={onSave}>
              <Save className="w-4 h-4 mr-1" /> Save
            </Button>

            <Button variant="outline" size="sm" onClick={onPreview}>
              <Eye className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline">{showPreview ? "Hide" : "Show"} Preview</span>
            </Button>

            <Button variant="secondary" size="sm" onClick={onExport}>
              <Download className="w-4 h-4 mr-1" /> Export
            </Button>

            <Button variant="outline" size="sm">
              <Printer className="w-4 h-4 mr-1" /> Print
            </Button>

            {/* Secondary Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={onImport}>
                  <Upload className="w-4 h-4 mr-2" /> Import
                </DropdownMenuItem>

                {onUndo && onRedo && (
                  <>
                    <DropdownMenuItem
                      onClick={onUndo}
                      disabled={!canUndo}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" /> Undo
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={onRedo}
                      disabled={!canRedo}
                    >
                      <RotateCw className="w-4 h-4 mr-2" /> Redo
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuItem onClick={onEnhanceAI}>
                  <Sparkles className="w-4 h-4 mr-2" /> Enhance with AI
                </DropdownMenuItem>

                {onClearForm && (
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={onClearForm}
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Clear Form
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Saved Versions Dropdown */}
            {savedVersions && savedVersions.length > 0 && (
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
                  {savedVersions.map((version) => (
                    <DropdownMenuItem
                      key={version.id}
                      onClick={() => onRestoreVersion?.(version)}
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
        </div>
      </div>
    </div>
  );
}
