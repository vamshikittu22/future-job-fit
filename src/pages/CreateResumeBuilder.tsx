import React, { useState, useEffect, useCallback } from 'react';
import AppNavigation from "@/components/AppNavigation";
import { useResume } from '@/contexts/ResumeContext';
import ResumeSection from '@/components/ResumeSection';
import ResumePreview from '@/components/ResumePreview';
import ResumeBuilderSidebar from '@/components/ResumeBuilderSidebar';
import ImportResumeModal from '@/components/ImportResumeModal';
import ExportResumeModal from '@/components/ExportResumeModal';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Toaster } from '@/components/ui/toaster';
import AIEnhanceModal from '@/components/AIEnhanceModal';
import { useToast } from '@/hooks/use-toast';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useLocalStorage } from '@/hooks/use-local-storage';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Plus, RotateCcw, RotateCw, Sparkles, Minimize2, FileText, Trash2 } from 'lucide-react';
import ClearFormDialog from "@/components/ClearFormDialog";
import { cn } from "@/lib/utils";
import { initialSections, initialResumeData } from '@/lib/initialData';
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
  History,
  MoreHorizontal
} from "lucide-react";

interface CustomSectionData {
  id: string;
  title: string;
  description?: string;
  items: Array<{
    id: string;
    title: string;
    subtitle?: string;
    date?: string;
    description?: string;
  }>;
}

export default function CreateResumeBuilder() {
  // Use only the ResumeContext for resume data - remove duplicate useLocalStorage
  const {
    resumeData,
    undo,
    redo,
    canUndo,
    canRedo,
    updateSection,
    saveSnapshot,
    restoreSnapshot,
    getSavedVersions,
    clearForm
  } = useResume();
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    ...initialSections,
    ...(resumeData.customSections?.map((section: any) => section.id) || [])
  ]);
  const [activeSection, setActiveSection] = useState('personal');
  const [showPreview, setShowPreview] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAIModal, setShowAIModal] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showTemplateCarousel, setShowTemplateCarousel] = useState(true);
  const [expandedSidebarSection, setExpandedSidebarSection] = useState<string | null>('resume');
  const [customSections, setCustomSections] = useState<CustomSectionData[]>([]);
  const [editingCustomSection, setEditingCustomSection] = useState<CustomSectionData | null>(null);
  const { toast } = useToast();
  const handleSave = useCallback(() => {
    localStorage.setItem('sectionOrder', JSON.stringify(sectionOrder));
    toast({ title: 'Saved!', description: 'Your resume has been saved successfully.' });
  }, [sectionOrder, toast]);

  const updateSectionData = (section: string, data: any) => {
    updateSection(section as keyof typeof resumeData, data);
  };

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(sectionOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSectionOrder(items);
  };

  const handleAddCustomSection = () => {
    const newSection = {
      id: `custom-${Date.now()}`,
      title: 'New Custom Section',
      description: '',
      items: [
        {
          id: `item-${Date.now()}`,
          title: '',
          subtitle: '',
          date: '',
          description: ''
        }
      ]
    };

    const updatedSections = [...(resumeData.customSections || []), newSection];
    updateSectionData('customSections', updatedSections);
    setActiveSection(newSection.id);
    setSectionOrder(prevOrder => [...prevOrder, newSection.id]); // Add new custom section to order

    // Auto-scroll to the new section
    setTimeout(() => {
      const element = document.getElementById(newSection.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleRemoveCustomSection = (id: string) => {
    const updatedSections = (resumeData.customSections || []).filter((section: any) => section.id !== id);
    updateSectionData('customSections', updatedSections);

    setSectionOrder(prevOrder => prevOrder.filter(sectionId => sectionId !== id)); // Remove from order
    // If the removed section was active, switch to the first available section
    if (activeSection === id) {
      setActiveSection(sectionOrder[0]);
    }
  };

  // Toggle sidebar on mobile
  useEffect(() => {
    setIsSidebarCollapsed(!isDesktop);
  }, [isDesktop]);

  const [showClearFormDialog, setShowClearFormDialog] = useState(false);

  const handleClearForm = () => {
    setShowClearFormDialog(true);
  };

  const handleSaveAndClear = () => {
    // Save snapshot before clearing
    saveSnapshot('Resume Backup Before Clear');
    clearForm();
    setShowClearFormDialog(false);
    toast({
      title: "Form Cleared",
      description: "Your resume has been cleared and a backup was saved.",
    });
  };

  const handleClearWithoutSaving = () => {
    clearForm();
    setShowClearFormDialog(false);
    toast({
      title: "Form Cleared",
      description: "Your resume has been cleared without saving a backup.",
    });
  };

  const handleRestoreVersion = (version: any) => {
    const success = restoreSnapshot(version.id);
    if (success) {
      toast({
        title: "Version Restored",
        description: `Restored: ${version.name}`,
      });
    } else {
      toast({
        title: "Restore Failed",
        description: "Could not restore the selected version.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Top Navigation - Clean, minimal */}
      <AppNavigation />

      {/* Resume Builder Taskbar - Right below main navigation */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur border-b border-border shadow-sm">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left Section - Title and Page Info */}
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Resume Builder</h1>
                <div className="text-xs text-muted-foreground">
                  Create your perfect resume
                </div>
              </div>
            </div>

            {/* Center Section - Quick Actions */}
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="w-3 h-3 mr-1" /> Save
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className={showPreview ? "bg-primary/10" : ""}
              >
                <Eye className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">{showPreview ? "Hide" : "Show"} Preview</span>
              </Button>

              <Button variant="secondary" size="sm" onClick={() => setIsExportOpen(true)}>
                <Download className="w-3 h-3 mr-1" /> Export
              </Button>

              <Button variant="outline" size="sm" onClick={() => setShowImportModal(true)}>
                <Upload className="w-3 h-3 mr-1" /> Import
              </Button>

              {/* AI Enhancement Button */}
              <Button variant="outline" size="sm" onClick={() => setShowAIModal(true)}>
                <Sparkles className="w-3 h-3 mr-1" /> AI Enhance
              </Button>

              {/* Clear Form Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearForm}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-3 h-3 mr-1" /> Clear
              </Button>
            </div>

            {/* Right Section - Undo/Redo and Versions */}
            <div className="flex items-center gap-1">
              {/* Undo/Redo */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  undo();
                  toast({
                    title: "Undo",
                    description: canUndo ? "Action undone!" : "No actions to undo",
                  });
                }}
                disabled={!canUndo}
                className="h-8 w-8 p-0"
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  redo();
                  toast({
                    title: "Redo",
                    description: canRedo ? "Action redone!" : "No actions to redo",
                  });
                }}
                disabled={!canRedo}
                className="h-8 w-8 p-0"
              >
                <RotateCw className="w-3 h-3" />
              </Button>

              {/* Versions Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <History className="w-3 h-3 mr-1" /> Versions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                    Saved Versions
                  </div>
                  <DropdownMenuSeparator />
                  <div className="py-2 text-sm text-muted-foreground text-center">
                    No saved versions yet
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-16"> {/* Offset for sticky Navigation + Taskbar height */}
        <ResumeBuilderSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          sectionOrder={sectionOrder}
          resumeData={resumeData}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onToggleTemplateCarousel={() => setShowTemplateCarousel(!showTemplateCarousel)}
          onSelectTemplate={setSelectedTemplate}
          selectedTemplate={selectedTemplate}
          expandedSection={expandedSidebarSection}
          onExpandedChange={setExpandedSidebarSection}
          updateResumeData={updateSectionData}
          customSections={customSections}
          onAddCustomSection={handleAddCustomSection}
          onEditCustomSection={(section) => setEditingCustomSection(section)}
          onRemoveCustomSection={handleRemoveCustomSection}
        />

        {/* Main Content */}
        <main className={`${isSidebarCollapsed ? 'ml-20' : 'ml-80'} transition-all duration-300`}>
          <div className={`${showPreview ? 'grid grid-cols-2 gap-6' : ''}`}>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="sections" direction="vertical">
                {(provided) => (
                  <div
                    className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {sectionOrder.map((sectionId, index) => (
                      <ResumeSection
                        key={sectionId}
                        sectionId={sectionId}
                        index={index}
                        resumeData={resumeData}
                        updateResumeData={updateSectionData}
                        isActive={activeSection === sectionId}
                        onActivate={() => setActiveSection(sectionId)}
                      />
                    ))}
                    {provided.placeholder}
                    {/* Add Custom Section Button here */}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddCustomSection}
                      className="w-full mt-6"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Custom Section
                    </Button>
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {/* Preview Pane */}
            {showPreview && (
              <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-hidden">
                <ResumePreview 
                  resumeData={resumeData} 
                  template={selectedTemplate} 
                  currentPage={currentPage}
                  sectionOrder={sectionOrder}
                />
              </div>
            )}
          </div>
        </main>
      </div> {/* Close pt-16 div */}

      {/* Template Carousel */}
      {showTemplateCarousel && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t shadow-lg">
          <div className="h-32 p-4 flex items-center justify-between relative">
            <div className="flex items-center gap-3">
              {['modern', 'classic', 'creative', 'minimal'].map((template) => (
                <Button
                  key={template}
                  variant={selectedTemplate === template ? 'default' : 'outline'}
                  size="sm"
                  className="h-16 w-28 flex flex-col gap-1 capitalize"
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="w-full h-8 rounded bg-gray-200" />
                  {template}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {/* Test Button to populate history */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Add a test action to populate history
                  updateSection('summary', (resumeData.summary || '') + ' Test action for undo/redo.');
                  toast({
                    title: "Test Action Added",
                    description: "Try clicking Undo to reverse this action!",
                  });
                }}
                className="flex items-center gap-2"
              >
                <span className="font-mono text-xs">🧪 Test Undo/Redo</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => setShowTemplateCarousel(false)}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modals, Toaster, Footer */}
      <ImportResumeModal
        open={showImportModal}
        onOpenChange={setShowImportModal}
        onImport={(data) => {
          // Handle import logic here
          console.log('Import data:', data);
        }}
      />
      <ExportResumeModal
        open={isExportOpen}
        onOpenChange={setIsExportOpen}
        resumeData={resumeData}
        template={selectedTemplate}
      />
      <AIEnhanceModal
        open={showAIModal}
        onOpenChange={setShowAIModal}
        resumeData={resumeData}
        onEnhance={(enhancedData) => {
          // Handle enhanced data
          console.log('Enhanced data:', enhancedData);
        }}
      />
      <Toaster />
      <Footer />

      {/* Clear Form Dialog */}
      <ClearFormDialog
        open={showClearFormDialog}
        onOpenChange={setShowClearFormDialog}
        onSaveAndClear={handleSaveAndClear}
        onClearWithoutSaving={handleClearWithoutSaving}
      />
    </div>
  );
}