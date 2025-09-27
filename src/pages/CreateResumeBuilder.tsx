import React, { useState, useEffect, useCallback } from 'react';
import AppNavigation from "@/components/AppNavigation";
import { useResume } from '@/contexts/ResumeContext';
import ResumeSection from '@/components/ResumeSection';
import ResumePreview from '@/components/ResumePreview';
import ResumeBuilderSidebar from '@/components/ResumeBuilderSidebar';
import ImportResumeModal from '@/components/ImportResumeModal';
import ExportResumeModal from '../components/ExportResumeModal';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Toaster } from '@/components/ui/toaster';
import { Minimize2 } from 'lucide-react';
import AIEnhanceModal from '@/components/AIEnhanceModal';
import { useToast } from '@/hooks/use-toast';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useLocalStorage } from '@/hooks/use-local-storage';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Plus, RotateCcw, RotateCw, Sparkles, FileText, Trash2 } from 'lucide-react';
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
  // State variables
  const [activeSection, setActiveSection] = useState<string>('personal');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [showImportModal, setShowImportModal] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showTemplateCarousel, setShowTemplateCarousel] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [showClearFormDialog, setShowClearFormDialog] = useState(false);
  const [customSections, setCustomSections] = useState<CustomSectionData[]>([]);

  // Handler functions
  const handleSaveAndClear = async () => {
    try {
      await saveResume();
      clearForm();
      setShowClearFormDialog(false);
      toast({
        title: "Success",
        description: "Resume saved and form cleared.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save resume.",
        variant: "destructive",
      });
    }
  };

  const handleClearForm = () => {
    setShowClearFormDialog(true);
  };

  const handleSaveResume = () => {
    // Implement save resume logic here
    toast({
      title: "Success",
      description: "Resume saved successfully.",
    });
  };

  const saveResume = async () => {
    // Implement async save logic here
    return Promise.resolve();
  };

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

  // Function to add a new custom section with optional section data
  const addCustomSection = (sectionData?: CustomSectionData) => {
    const newSection = sectionData || {
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
    setCustomSections(updatedSections); // Update local state
    
    // Set the new section as active
    setActiveSection(newSection.id);
    
    // Add new custom section to order if not already present
    setSectionOrder(prevOrder => {
      if (!prevOrder.includes(newSection.id)) {
        return [...prevOrder, newSection.id];
      }
      return prevOrder;
    });

    // Auto-scroll to the new section
    setTimeout(() => {
      const element = document.getElementById(newSection.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
    
    return newSection;
  };

  // Event handler for adding a custom section from a button click
  const handleAddCustomSection = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    addCustomSection();
  };

  const handleRemoveCustomSection = (id: string) => {
    const sectionToRemove = resumeData.customSections?.find((s: any) => s.id === id);
    if (!sectionToRemove) return;
    
    const updatedSections = (resumeData.customSections || []).filter((section: any) => section.id !== id);
    updateSectionData('customSections', updatedSections);
    setCustomSections(updatedSections); // Update local state

    // Remove from section order
    setSectionOrder(prevOrder => prevOrder.filter(sectionId => sectionId !== id));
    
    // If the removed section was active, switch to the first available section
    if (activeSection === id) {
      const nextSection = sectionOrder.find(sectionId => sectionId !== id) || 'personal';
      setActiveSection(nextSection);
    }
    
    return sectionToRemove;
  };

  // Toggle sidebar on mobile
  useEffect(() => {
    setIsSidebarCollapsed(!isDesktop);
  }, [isDesktop]);

  // Keep customSections and sectionOrder in sync with resumeData.customSections
  useEffect(() => {
    if (resumeData.customSections) {
      // Update local state with the latest custom sections
      setCustomSections(resumeData.customSections);
      
      // Ensure all custom section IDs are in the sectionOrder
      const customSectionIds = resumeData.customSections.map((s: any) => s.id);
      setSectionOrder(prevOrder => {
        // Keep the existing order but add any new custom sections at the end
        const existingOrder = prevOrder.filter(id => !id.startsWith('custom'));
        const existingCustomSections = prevOrder.filter(id => id.startsWith('custom'));
        const newCustomSections = customSectionIds.filter((id: string) => !existingCustomSections.includes(id));
        
        return [...existingOrder, ...existingCustomSections, ...newCustomSections];
      });
    }
  }, [resumeData.customSections]);

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
    <div className="min-h-screen bg-background">
      <AppNavigation />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Resume Builder Taskbar - Compact action buttons */}
        <div className="bg-background/95 backdrop-blur border-b border-border shadow-sm mb-6 h-10 flex items-center justify-center w-full sticky top-16 z-30">
          <div className="flex items-center gap-2 max-w-full overflow-x-auto px-4">
            {/* All Action Buttons in Single Row */}
            <Button variant="outline" size="sm" onClick={handleSave} className="flex-shrink-0">
              <Save className="w-3 h-3 mr-1" /> Save
            </Button>

            <Button
              variant="outline"
              size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className={`flex-shrink-0 ${showPreview ? "bg-primary/10" : ""}`}
              >
                <Eye className="w-3 h-3 mr-1" />
                <span className="hidden md:inline">{showPreview ? "Hide" : "Show"} Preview</span>
                <span className="md:hidden">Preview</span>
              </Button>

              <Button variant="outline" size="sm" onClick={() => setIsExportOpen(true)} className="flex-shrink-0">
                <Download className="w-3 h-3 mr-1" /> Export
              </Button>

              <Button variant="outline" size="sm" onClick={() => setShowImportModal(true)} className="flex-shrink-0">
                <Upload className="w-3 h-3 mr-1" /> Import
              </Button>

              <Button variant="outline" size="sm" onClick={() => setShowAIModal(true)} className="flex-shrink-0">
                <Sparkles className="w-3 h-3 mr-1" /> AI Enhance
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleClearForm}
                className="flex-shrink-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-3 h-3 mr-1" /> Clear
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  undo();
                  toast({
                    title: "Undo",
                    description: canUndo ? "Action undone!" : "No actions to undo",
                  });
                }}
                disabled={!canUndo}
                className="h-7 px-1.5 flex-shrink-0"
              >
                <RotateCcw className="w-3 h-3" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  redo();
                  toast({
                    title: "Redo",
                    description: canRedo ? "Action redone!" : "No actions to redo",
                  });
                }}
                disabled={!canRedo}
                className="h-7 px-1.5 flex-shrink-0"
              >
                <RotateCw className="w-3 h-3" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 px-1.5 flex-shrink-0">
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

          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className={`${isSidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-200 flex-shrink-0`}>
              <ResumeBuilderSidebar
                activeSection={activeSection}
                onSectionChange={setActiveSection}
                sectionOrder={sectionOrder}
                resumeData={resumeData}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                customSections={customSections}
                onAddCustomSection={addCustomSection}
                onEditCustomSection={setEditingCustomSection}
                onRemoveCustomSection={handleRemoveCustomSection}
                updateResumeData={updateSectionData}
              />
            </div>

            {/* Main Content and Preview Side by Side */}
            <div className="flex-1 flex flex-col lg:flex-row gap-6">
              {/* Editor Section */}
              <div className={`${showPreview ? 'lg:w-1/2' : 'w-full'} overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6`}>
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="sections">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
                        {sectionOrder.map((sectionId, index) => (
                          <div 
                            key={sectionId}
                            className="mb-6"
                            onClick={() => setActiveSection(sectionId)}
                          >
                            <div className={`${activeSection === sectionId ? 'ring-1 ring-primary/30 rounded-lg p-4 shadow-md shadow-primary/5 transition-all duration-200' : 'p-4'}`}>
                            <ResumeSection
                              sectionId={sectionId}
                              index={index}
                              resumeData={resumeData}
                              updateResumeData={updateSectionData}
                              isActive={activeSection === sectionId}
                              onActivate={() => setActiveSection(sectionId)}
                            />
                            </div>
                          </div>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    addCustomSection();
                  }}
                  className="w-full mt-6"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Custom Section
                </Button>
              </div>

              {/* Preview Pane */}
              {showPreview && (
                <div className="lg:w-1/2 sticky top-16 h-[calc(100vh-4rem)] overflow-auto p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <ResumePreview
                    resumeData={resumeData}
                    template={selectedTemplate}
                    currentPage={currentPage}
                    sectionOrder={sectionOrder}
                  />
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Template Carousel - Placeholder for future use */}
        {showTemplateCarousel && (
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t shadow-lg">
            <div className="h-16 p-4 flex items-center justify-between relative">
              <div className="flex-1 text-center text-muted-foreground text-sm">
                Template customization panel (coming soon)
              </div>
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
        )}

        {/* Modals, Toaster, Footer */}
        <div>
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
          template={selectedTemplate || 'default'}
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
    </div>
  );
}