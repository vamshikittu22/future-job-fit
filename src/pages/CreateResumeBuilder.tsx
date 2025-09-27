import React, { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Minimize2 } from 'lucide-react';
import AppNavigation from "@/components/AppNavigation";
import { useResume } from '@/contexts/ResumeContext';
import ResumeSection from '@/components/ResumeSection';
import ResumeBuilderSidebar from '@/components/ResumeBuilderSidebar';
import ResumePreview from '@/components/ResumePreview';
import ImportResumeModal from '@/components/ImportResumeModal';
import ExportResumeModal from '@/components/ExportResumeModal';
import AIEnhanceModal from '@/components/AIEnhanceModal';
import ClearFormDialog from '@/components/ClearFormDialog';
import { Toaster } from '@/components/ui/toaster';
import { SECTION_ORDER } from '@/constants/sectionNames';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

// Define types
type TemplateType = 'default' | 'modern' | 'professional';

interface CustomSectionData {
  id: string;
  title: string;
  items: any[];
  type: string;
  isCustom?: boolean;
}

interface ResumeData {
  [key: string]: any;
}

const CreateResumeBuilder: React.FC = () => {
  const { toast } = useToast();
  const resumeContext = useResume();
  
  // Provide default values if resumeContext is undefined
  const {
    resumeData = {},
    updateResumeData = () => {},
    saveResume = async () => {},
    clearForm = () => {},
    undo = () => {},
    redo = () => {},
    canUndo = false,
    canRedo = false
  } = resumeContext || {};

  // State management
  const [customSections, setCustomSections] = useState<CustomSectionData[]>([]);
  const [sectionOrder, setSectionOrder] = useState<string[]>(SECTION_ORDER);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('default');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [showTemplateCarousel, setShowTemplateCarousel] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showAIEnhanceModal, setShowAIEnhanceModal] = useState<boolean>(false);
  const [showClearFormDialog, setShowClearFormDialog] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Handler for adding a new custom section
  const handleAddCustomSection = useCallback(() => {
    const newSection: CustomSectionData = {
      id: `custom-${Date.now()}`,
      title: 'New Section',
      items: [],
      type: 'custom',
      isCustom: true
    };
    setCustomSections(prev => [...prev, newSection]);
    setSectionOrder(prev => [...prev, newSection.id]);
  }, []);

  // Handler for saving and clearing form
  const handleSaveAndClear = useCallback(async () => {
    try {
      await saveResume();
      clearForm();
      setShowClearFormDialog(false);
      toast({
        title: "Success",
        description: "Resume saved and form cleared successfully!",
      });
    } catch (error) {
      console.error('Failed to save and clear form:', error);
      toast({
        title: "Error",
        description: "Failed to save and clear form. Please try again.",
        variant: "destructive",
      });
    }
  }, [saveResume, clearForm, toast]);

  const handleClearWithoutSaving = useCallback(() => {
    clearForm();
    setShowClearFormDialog(false);
    toast({
      title: "Form Cleared",
      description: "The form has been cleared successfully!",
    });
  }, [clearForm, toast]);

  // Handler for importing resume data
  const handleImport = useCallback((data: ResumeData) => {
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        updateResumeData(key, value);
      });
      setShowImportModal(false);
      toast({
        title: "Resume Imported",
        description: "Your resume has been imported successfully!",
      });
    }
  }, [updateResumeData, toast]);

  // Handler for AI enhancement
  const handleAIEnhance = useCallback((data: ResumeData) => {
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        updateResumeData(key, value);
      });
      setShowAIEnhanceModal(false);
      toast({
        title: "Resume Enhanced",
        description: "Your resume has been enhanced successfully!",
      });
    }
  }, [updateResumeData, toast]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) return;

    const newSectionOrder = Array.from(sectionOrder);
    const [reorderedItem] = newSectionOrder.splice(source.index, 1);
    newSectionOrder.splice(destination.index, 0, reorderedItem);

    setSectionOrder(newSectionOrder);
  };

  // If resume context is not available, show loading state
  if (!resumeContext) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">Loading resume builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppNavigation />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/3">
            <ResumeBuilderSidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              sectionOrder={sectionOrder}
              resumeData={resumeData}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              customSections={customSections}
              onAddCustomSection={handleAddCustomSection}
              updateResumeData={updateResumeData}
            />
          </div>
          
          {/* Main Content */}
          <div className={`${showPreview ? 'lg:w-1/2' : 'lg:w-2/3'}`}>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="resume-sections">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
                    {sectionOrder.map((sectionId, index) => {
                      const isCustom = customSections.some(cs => cs.id === sectionId);
                      const section = isCustom ? customSections.find(cs => cs.id === sectionId) : { id: sectionId };

                      if (!section) return null;

                      return (
                        <Draggable key={section.id} draggableId={section.id} index={index}>
                          {(provided) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <ResumeSection
                                sectionId={section.id}
                                index={index}
                                resumeData={resumeData}
                                updateResumeData={updateResumeData}
                                isActive={activeSection === section.id}
                                onActivate={() => setActiveSection(section.id)}
                              />
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
          
          {/* Preview Pane */}
          {showPreview && (
            <div className="lg:w-1/2 sticky top-16 h-[calc(100vh-4rem)] overflow-auto p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <ResumePreview
                resumeData={resumeData}
                template={selectedTemplate}
                sectionOrder={sectionOrder}
                currentPage={currentPage}
              />
            </div>
          )}
        </div>
      </div>
      
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
      
      {/* Modals */}
      <ImportResumeModal
        open={showImportModal}
        onOpenChange={setShowImportModal}
        onImport={handleImport}
      />
      
      <ExportResumeModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        resumeData={resumeData}
      />
      
      <AIEnhanceModal
        open={showAIEnhanceModal}
        onOpenChange={setShowAIEnhanceModal}
        resumeData={resumeData}
        onEnhance={handleAIEnhance}
      />
      
      <ClearFormDialog
        open={showClearFormDialog}
        onOpenChange={setShowClearFormDialog}
        onSaveAndClear={handleSaveAndClear}
        onClearWithoutSaving={handleClearWithoutSaving}
      />
      
      <Toaster />
    </div>
  );
};

export default CreateResumeBuilder;