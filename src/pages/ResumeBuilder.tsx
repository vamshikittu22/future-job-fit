import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
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
  FileText
} from "lucide-react";
import AppNavigation from "@/components/AppNavigation";
import Footer from "@/components/Footer";
import ResumeBuilderSidebar from "@/components/ResumeBuilderSidebar";
import ResumeSection from "@/components/ResumeSection";
import TemplateCarousel from "@/components/TemplateCarousel";
import ResumePreview from "@/components/ResumePreview";
import ImportResumeModal from "@/components/ImportResumeModal";
import ExportResumeModal from "../components/ExportResumeModal";
import { useResume } from "@/contexts/ResumeContext";
import { useToast } from "@/hooks/use-toast";

// Import ResumeData type from ResumeContext
import { ResumeData } from '@/contexts/ResumeContext';

export default function ResumeBuilder() {
  const { resumeData, updateSection, undo, redo, canUndo, canRedo, addCustomSection, updateCustomSection, removeCustomSection } = useResume();
  const [activeSection, setActiveSection] = useState("personal");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState("minimal");
  const [showPreview, setShowPreview] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [sectionOrder, setSectionOrder] = useState([
    "personal",
    "summary", 
    "skills",
    "experience",
    "education",
    "projects",
    "achievements",
    "certifications"
  ]);
  const { toast } = useToast();

  // Auto-save functionality
  useEffect(() => {
    const saveData = () => {
      try {
        // Ensure customSections is always an array
        const dataToSave = {
          ...resumeData,
          customSections: resumeData.customSections || []
        };
        
        localStorage.setItem('resume_builder_draft', JSON.stringify(dataToSave));
        localStorage.setItem('resumeBuilder_template', selectedTemplate);
        localStorage.setItem('resumeBuilder_sectionOrder', JSON.stringify(sectionOrder));
      } catch (error) {
        console.error('Failed to save resume data:', error);
      }
    };
    
    // Save immediately on mount
    saveData();
    
    // Then set up the interval for auto-saving
    const interval = setInterval(saveData, 30000); // Auto-save every 30 seconds

    return () => clearInterval(interval);
  }, [resumeData, selectedTemplate, sectionOrder]);

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('resume_builder_draft');
    const savedTemplate = localStorage.getItem('resumeBuilder_template');
    const savedOrder = localStorage.getItem('resumeBuilder_sectionOrder');
    
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Update each section individually
        Object.entries(parsedData).forEach(([key, value]) => {
          // Skip custom sections here, they'll be handled by the sectionOrder
          if (key === 'customSections') return;
          updateSection(key as keyof ResumeData, value);
        });
        
        // Handle custom sections separately to ensure they're in sync with sectionOrder
        if (parsedData.customSections) {
          updateSection('customSections', parsedData.customSections);
        }
      } catch (error) {
        console.error('Failed to parse saved resume data:', error);
      }
    }
    
    if (savedTemplate) {
      setSelectedTemplate(savedTemplate);
    }
    
    if (savedOrder) {
      try {
        const order = JSON.parse(savedOrder);
        setSectionOrder(order);
        
        // If we have custom sections in the order but not in the data, add them
        const customSectionIds = order.filter((id: string) => id.startsWith('custom-'));
        if (customSectionIds.length > 0 && (!resumeData.customSections || resumeData.customSections.length === 0)) {
          const newCustomSections = customSectionIds.map((id: string) => ({
            id,
            title: 'New Section',
            description: '',
            items: []
          }));
          updateSection('customSections', newCustomSections);
        }
      } catch (error) {
        console.error('Failed to parse saved section order:', error);
      }
    }
  }, [updateSection]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(sectionOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSectionOrder(items);
    toast({
      title: "Section reordered",
      description: "Your resume sections have been reorganized.",
    });
  };

  const updateResumeData = (section: keyof ResumeData, data: any) => {
    updateSection(section, data);
  };

  const handleSave = () => {
    localStorage.setItem('resume_builder_draft', JSON.stringify(resumeData));
    localStorage.setItem('resumeBuilder_template', selectedTemplate);
    localStorage.setItem('resumeBuilder_sectionOrder', JSON.stringify(sectionOrder));
    toast({
      title: "Resume saved",
      description: "Your resume has been saved successfully.",
    });
  };

  const addNewPage = () => {
    setTotalPages(prev => prev + 1);
    setCurrentPage(totalPages + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation />
      <main className="container mx-auto px-4 py-8">
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
                    Page {currentPage} of {totalPages}
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

                <Button variant="secondary" size="sm" onClick={() => setShowExportModal(true)}>
                  <Download className="w-3 h-3 mr-1" /> Export
                </Button>

                <Button variant="outline" size="sm" onClick={() => setShowImportModal(true)}>
                  <Upload className="w-3 h-3 mr-1" /> Import
                </Button>
              </div>

              {/* Right Section - Secondary Actions Dropdown */}
              <div className="flex items-center gap-1">
                {/* Undo/Redo */}
                {undo && redo && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={undo}
                      disabled={!canUndo}
                      className="h-8 w-8 p-0"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={redo}
                      disabled={!canRedo}
                      className="h-8 w-8 p-0"
                    >
                      <RotateCw className="w-3 h-3" />
                    </Button>
                  </>
                )}

                {/* More Actions Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => {}}>
                      <Sparkles className="w-4 h-4 mr-2" /> Enhance with AI
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => {}}
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Clear Form
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

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

        <div className="flex mt-6 min-h-[calc(100vh-12rem)]">
          {/* Sidebar Navigation */}
          <div className="w-80 flex-shrink-0">
            <ResumeBuilderSidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              sectionOrder={sectionOrder}
              resumeData={resumeData}
              isCollapsed={false}
              onToggleCollapse={() => {}}
              onToggleTemplateCarousel={() => {}}
              onSelectTemplate={setSelectedTemplate}
              selectedTemplate={selectedTemplate}
              expandedSection={null}
              onExpandedChange={() => {}}
              customSections={resumeData.customSections || []}
              onAddCustomSection={(section) => {
                // Add to custom sections
                const newSections = [...(resumeData.customSections || []), section];
                updateSection('customSections', newSections);
                
                // Add to section order if not already present
                if (!sectionOrder.includes(section.id)) {
                  const newOrder = [...sectionOrder, section.id];
                  setSectionOrder(newOrder);
                  localStorage.setItem('resumeBuilder_sectionOrder', JSON.stringify(newOrder));
                }
                
                // Set the new section as active
                setActiveSection(section.id);
              }}
              onEditCustomSection={(section) => {
                const updated = (resumeData.customSections || []).map(s => 
                  s.id === section.id ? section : s
                );
                updateSection('customSections', updated);
              }}
              onRemoveCustomSection={(id) => {
                // Remove from custom sections
                const updatedSections = (resumeData.customSections || []).filter(s => s.id !== id);
                updateSection('customSections', updatedSections);
                
                // Remove from section order
                const updatedOrder = sectionOrder.filter(sectionId => sectionId !== id);
                setSectionOrder(updatedOrder);
                localStorage.setItem('resumeBuilder_sectionOrder', JSON.stringify(updatedOrder));
                
                // If the active section was the one being removed, switch to the first section
                if (activeSection === id) {
                  setActiveSection(updatedOrder[0] || 'personal');
                }
              }}
              updateResumeData={updateResumeData}
            />
          </div>

          {/* Main Content */}
          <div className={`flex-1 ${showPreview ? 'grid grid-cols-2 gap-4' : ''}`}>
            {/* Builder Content */}
            <div className="p-6 min-h-full">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="sections">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-6 min-h-[calc(100vh-16rem)]"
                    >
                      {sectionOrder.map((sectionId, index) => (
                        <ResumeSection
                          key={sectionId}
                          sectionId={sectionId}
                          index={index}
                          resumeData={resumeData}
                          updateResumeData={updateSection}
                          isActive={activeSection === sectionId}
                          onActivate={() => setActiveSection(sectionId)}
                          addCustomSection={addCustomSection}
                          updateCustomSection={updateCustomSection}
                          removeCustomSection={removeCustomSection}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              {/* Page Navigation */}
              {totalPages > 1 && (
                <Card className="mt-8 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Multi-page Resume
                    </div>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      ))}
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Live Preview */}
            {showPreview && (
              <div className="border-l bg-muted/30 min-h-full">
                <div className="sticky top-24 p-6 h-full">
                  <ResumePreview
                    resumeData={resumeData}
                    template={selectedTemplate}
                    currentPage={currentPage}
                    sectionOrder={sectionOrder}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Template Carousel - Bottom Panel */}
        <TemplateCarousel
          selectedTemplate={selectedTemplate}
          onTemplateChange={setSelectedTemplate}
          resumeData={resumeData}
        />

        {/* Modals */}
        <ImportResumeModal
          open={showImportModal}
          onOpenChange={setShowImportModal}
          onImport={(data) => {
            // Update each section of the resume data
            Object.entries(data).forEach(([key, value]) => {
              updateSection(key as keyof ResumeData, value);
            });
            toast({
              title: "Resume imported",
              description: "Your resume has been imported successfully.",
            });
          }}
        />

        <ExportResumeModal
          open={showExportModal}
          onOpenChange={setShowExportModal}
          resumeData={resumeData}
          template={selectedTemplate}
        >
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={() => setShowExportModal(true)}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </ExportResumeModal>

        <Footer />
      </main>
    </div>
  );
}