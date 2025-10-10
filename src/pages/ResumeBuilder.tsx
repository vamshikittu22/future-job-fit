import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
import { toast } from "@/components/ui/use-toast";
import { SaveProvider, useSave } from "@/contexts/SaveContext";
import SaveManager from "@/components/SaveManager";


const ResumeBuilder: React.FC = () => {
  const { resumeData, updateSection, undo, redo, canUndo, canRedo, addCustomSection, updateCustomSection, removeCustomSection, setResumeData } = useResume();
  const { saveResume, currentSlot, lastSaved } = useSave();
  const [activeSection, setActiveSection] = useState<string>("personal");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
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
  const { toast: showToast } = useToast();

  // Handle keyboard shortcuts for undo/redo
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Check for Ctrl+Z (undo) or Ctrl+Shift+Z/Ctrl+Y (redo)
    if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      if (canUndo) undo();
    } else if ((e.ctrlKey && e.shiftKey && e.key === 'Z') || (e.ctrlKey && e.key === 'y')) {
      e.preventDefault();
      if (canRedo) redo();
    }
  }, [canUndo, canRedo, undo, redo]);

  // Add keyboard event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Expose save/load functions to the SaveContext
  useEffect(() => {
    // @ts-ignore - Adding to window for SaveContext to access
    window.__getCurrentResumeData = () => ({
      resumeData,
      template: selectedTemplate,
      sectionOrder,
    });
    
    // @ts-ignore - Adding to window for SaveContext to access
    window.__loadResumeData = (savedResume: any) => {
      setResumeData(savedResume.data);
      setSelectedTemplate(savedResume.template);
      setSectionOrder(savedResume.sectionOrder);
    };
    
    return () => {
      // @ts-ignore - Clean up
      delete window.__getCurrentResumeData;
      // @ts-ignore - Clean up
      delete window.__loadResumeData;
    };
  }, [resumeData, selectedTemplate, sectionOrder, setResumeData]);
  
  // Auto-save functionality
  useEffect(() => {
    if (!currentSlot) return;
    
    const autoSave = () => {
      saveResume();
    };
    
    const interval = setInterval(autoSave, 30000); // Auto-save every 30 seconds
    return () => clearInterval(interval);
  }, [currentSlot, saveResume]);

  // Load saved data on mount
  useEffect(() => {
    // Use a ref to track if the component is still mounted
    let isMounted = true;

    const loadSavedData = () => {
      const savedData = localStorage.getItem('resume_builder_draft');
      const savedTemplate = localStorage.getItem('resumeBuilder_template');
      const savedOrder = localStorage.getItem('resumeBuilder_sectionOrder');
      
      if (savedData && isMounted) {
        try {
          const parsedData = JSON.parse(savedData);
          // Batch updates to prevent multiple re-renders
          const updates: { [key: string]: any } = {};
          
          // Collect all updates
          Object.entries(parsedData).forEach(([key, value]) => {
            if (key === 'customSections') return; // Will handle custom sections separately
            updates[key] = value;
          });
          
          // Apply all updates at once if component is still mounted
          if (isMounted) {
            Object.entries(updates).forEach(([key, value]) => {
              updateSection(key as keyof ResumeData, value);
            });
            
            // Handle custom sections
            if (parsedData.customSections) {
              updateSection('customSections', parsedData.customSections);
            }
          }
        } catch (error) {
          console.error('Failed to parse saved resume data:', error);
        }
      }
      
      if (savedTemplate && isMounted) {
        setSelectedTemplate(savedTemplate);
      }
      
      if (savedOrder && isMounted) {
        try {
          const order = JSON.parse(savedOrder);
          setSectionOrder(order);
          
          // Handle custom sections in order
          if (isMounted) {
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
          }
        } catch (error) {
          console.error('Failed to parse saved section order:', error);
        }
      }
    };

    loadSavedData();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array means this runs once on mount

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
    showToast({
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
        {/* Import/Export Modals */}
        <ImportResumeModal 
          open={showImportModal} 
          onOpenChange={setShowImportModal} 
        />
        
        <ExportResumeModal 
          open={showExportModal} 
          onOpenChange={setShowExportModal} 
        />
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-80 flex-shrink-0">
            <ResumeBuilderSidebar 
              activeSection={activeSection}
              onSectionSelect={setActiveSection}
              sectionOrder={sectionOrder}
              onAddSection={(type) => {
                const newSection = {
                  id: `custom-${Date.now()}`,
                  title: 'New Section',
                  description: '',
                  items: []
                };
                addCustomSection(newSection);
                setSectionOrder([...sectionOrder, newSection.id]);
                setActiveSection(newSection.id);
              }}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold">Resume Builder</h1>
                <div className="w-full sm:w-auto">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={undo} 
                              disabled={!canUndo} 
                              className="h-8 w-8 p-0 flex-shrink-0"
                            >
                              <RotateCcw className="h-4 w-4" />
                              <span className="sr-only">Undo</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={redo} 
                              disabled={!canRedo} 
                              className="h-8 w-8 p-0 flex-shrink-0"
                            >
                              <RotateCw className="h-4 w-4" />
                              <span className="sr-only">Redo</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Redo (Ctrl+Shift+Z)</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <SaveManager />
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setShowImportModal(true)}
                              className="h-8 flex items-center gap-1.5"
                            >
                              <Upload className="h-4 w-4" />
                              <span className="sr-only sm:not-sr-only">Import</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Import Resume</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setShowExportModal(true)}
                              className="h-8 flex items-center gap-1.5"
                            >
                              <Download className="h-4 w-4" />
                              <span className="sr-only sm:not-sr-only">Export</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Export Resume</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    
                    <Separator orientation="vertical" className="h-6 mx-1" />
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1.5 whitespace-nowrap"
                        onClick={() => setShowImportModal(true)}
                      >
                        <Upload className="h-4 w-4" />
                        <span>Import</span>
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1.5 whitespace-nowrap"
                        onClick={() => setShowExportModal(true)}
                      >
                        <Download className="h-4 w-4" />
                        <span>Export</span>
                      </Button>
                      
                      <Button 
                        variant={showPreview ? "secondary" : "outline"} 
                        size="sm" 
                        className="flex items-center gap-1.5"
                        onClick={() => setShowPreview(!showPreview)}
                      >
                        <Eye className="h-4 w-4" />
                        <span>{showPreview ? 'Hide' : 'Preview'}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {lastSaved && (
                <p className="text-xs text-muted-foreground mt-2">
                  Last saved: {new Date(lastSaved).toLocaleString()}
                </p>
              )}
            </div>

            {showPreview ? (
              <div className="bg-white p-6 rounded-lg shadow">
                <ResumePreview 
                  resumeData={resumeData} 
                  template={selectedTemplate} 
                  sectionOrder={sectionOrder} 
                />
              </div>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="sections">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                          {sectionOrder.map((sectionId, index) => {
                            if (sectionId.startsWith('custom-')) {
                              const section = resumeData.customSections?.find(s => s.id === sectionId);
                              if (!section) return null;
                              
                              return (
                                <ResumeSection
                                  key={sectionId}
                                  id={sectionId}
                                  index={index}
                                  title={section.title}
                                  data={section}
                                  onUpdate={(data) => updateCustomSection(sectionId, data)}
                                  onRemove={() => {
                                    removeCustomSection(sectionId);
                                    setSectionOrder(sectionOrder.filter(id => id !== sectionId));
                                  }}
                                />
                              );
                            }
                            
                            return (
                              <ResumeSection
                                key={sectionId}
                                id={sectionId}
                                index={index}
                                title={sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}
                                data={resumeData[sectionId as keyof typeof resumeData]}
                                onUpdate={(data) => updateSection(sectionId as keyof typeof resumeData, data)}
                              />
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <ImportResumeModal
          open={showImportModal}
          onOpenChange={setShowImportModal}
          onImport={(data: any) => {
            // Update each section of the resume data
            Object.entries(data).forEach(([key, value]) => {
              updateSection(key as keyof typeof resumeData, value);
            });
            showToast({
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
        />
      </main>
      <Footer />
    </div>
  );
};

// Wrap the ResumeBuilder with SaveProvider
export default function ResumeBuilderWrapper() {
  return (
    <SaveProvider>
      <ResumeBuilder />
    </SaveProvider>
  );
}