import React, { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Button } from '@/components/ui/button';
import ResumeSection from '@/components/ResumeSection';
import ResumeBuilderSidebar from '@/components/ResumeBuilderSidebar';
import ResumePreview from '@/components/ResumePreview';
import { initialSections, initialResumeData } from '@/lib/initialData';
import AIEnhanceModal from '@/components/AIEnhanceModal';
import ExportResumeModal from '@/components/ExportResumeModal';
import ImportResumeModal from '@/components/ImportResumeModal';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import Footer from '@/components/Footer';
import { Minimize2 } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useMediaQuery } from "@/hooks/use-media-query";
import { PanelLeft, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [resumeData, setResumeData] = useLocalStorage("resumeData", initialResumeData);
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
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // Load persisted data
  useEffect(() => {
    const savedData = localStorage.getItem('resumeData');
    const savedOrder = localStorage.getItem('sectionOrder');
    if (savedData) setResumeData(JSON.parse(savedData));
    if (savedOrder) {
      try {
        const loaded = JSON.parse(savedOrder);
        setSectionOrder(loaded);
      } catch {
        setSectionOrder(initialSections);
      }
    } else {
      setSectionOrder(initialSections);
    }
  }, []);

  // Initialize with default custom sections if none exist
  useEffect(() => {
    if (!resumeData.customSections) {
      setResumeData({
        ...resumeData,
        customSections: [],
      });
    }
  }, [resumeData, setResumeData]);

  useEffect(() => {
    setSectionOrder([
      ...initialSections,
      ...(resumeData.customSections?.map((section: any) => section.id) || [])
    ]);
  }, [resumeData.customSections]);

  const handleSave = useCallback(() => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
    localStorage.setItem('sectionOrder', JSON.stringify(sectionOrder));
    toast({ title: 'Saved!', description: 'Your resume has been saved successfully.' });
  }, [resumeData, sectionOrder, toast]);

  const updateSectionData = (section: string, data: any) => {
    setResumeData((prev: any) => ({
      ...prev,
      [section]: data
    }));
  };

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
  };

  const handleRemoveCustomSection = (id: string) => {
    const updatedSections = (resumeData.customSections || []).filter((section: any) => section.id !== id);
    updateSectionData('customSections', updatedSections);
    
    // If the removed section was active, switch to the first available section
    if (activeSection === id) {
      setActiveSection(sectionOrder[0]);
    }
  };

  // Toggle sidebar on mobile
  useEffect(() => {
    setIsSidebarCollapsed(!isDesktop);
  }, [isDesktop]);

  const toggleTemplateCarousel = () => {
    setShowTemplateCarousel(!showTemplateCarousel);
  };

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Existing title bar with integrated tools */}
      <Navigation
        builderTools={{
          onSave: handleSave,
          onPreview: () => setShowPreview(!showPreview),
          onExport: () => setIsExportOpen(true),
          onImport: () => setShowImportModal(true),
          onEnhanceAI: () => setShowAIModal(true),
          onToggleATS: () => setExpandedSidebarSection(prev => (prev === 'ats' ? null : 'ats')),
          showPreview,
        }}
      />

      <div className="pt-16"> {/* Offset for sticky Navigation height (4rem) */}
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
          onAddCustomSection={handleAddCustomSection}
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
      <ImportResumeModal open={showImportModal} onOpenChange={setShowImportModal} />
      <ExportResumeModal
        open={isExportOpen}
        onOpenChange={setIsExportOpen}
        resumeData={resumeData}
        selectedTemplate={selectedTemplate}
      />
      <AIEnhanceModal open={showAIModal} onOpenChange={setShowAIModal} />
      <Toaster />
      <Footer />
    </div>
  );
}
