import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { FileText, Download, Upload, Save, Eye, Plus, Sparkles, Target, Settings, Palette } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ResumeBuilderSidebar from "@/components/ResumeBuilderSidebar";
import DynamicSection from "@/components/DynamicSection";
import CollapsibleTemplateBar from "@/components/CollapsibleTemplateBar";
import ResumePreview from "@/components/ResumePreview";
import ImportResumeModal from "@/components/ImportResumeModal";
import ExportResumeModal from "@/components/ExportResumeModal";
import AIEnhanceModal from "@/components/AIEnhanceModal";
import CustomSectionModal from "@/components/CustomSectionModal";
import { useToast } from "@/hooks/use-toast";

interface ResumeData {
  personal: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
    photo?: string;
  };
  summary: string;
  skills: {
    languages: string[];
    frameworks: string[];
    tools: string[];
  };
  experience: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    duration: string;
    bullets: string[];
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    year: string;
    gpa?: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    tech: string;
    duration: string;
    bullets: string[];
    link?: string;
  }>;
  achievements: string[];
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    link?: string;
  }>;
  customSections: Array<{
    id: string;
    title: string;
    type: 'textarea' | 'bullets' | 'structured';
    content: any;
  }>;
}

const initialResumeData: ResumeData = {
  personal: {
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: ""
  },
  summary: "",
  skills: {
    languages: [],
    frameworks: [],
    tools: []
  },
  experience: [],
  education: [],
  projects: [],
  achievements: [],
  certifications: [],
  customSections: []
};

export default function CreateResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [activeSection, setActiveSection] = useState("personal");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState("minimal-1");
  const [showPreview, setShowPreview] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showCustomSectionModal, setShowCustomSectionModal] = useState(false);
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedData = localStorage.getItem('createResumeBuilder_data');
    if (savedData) {
      setResumeData(JSON.parse(savedData));
    }
    
    const savedSection = localStorage.getItem('activeSection');
    if (savedSection) {
      setActiveSection(savedSection);
    }
    
    const savedSidebarState = localStorage.getItem('isSidebarCollapsed');
    if (savedSidebarState !== null) {
      setIsSidebarCollapsed(savedSidebarState === 'true');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('createResumeBuilder_data', JSON.stringify(resumeData));
  }, [resumeData]);

  useEffect(() => {
    localStorage.setItem('activeSection', activeSection);
  }, [activeSection]);

  useEffect(() => {
    localStorage.setItem('isSidebarCollapsed', String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  // Auto-save functionality
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem('createResumeBuilder_data', JSON.stringify(resumeData));
      localStorage.setItem('createResumeBuilder_template', selectedTemplate);
      localStorage.setItem('createResumeBuilder_sectionOrder', JSON.stringify(sectionOrder));
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(interval);
  }, [resumeData, selectedTemplate, sectionOrder]);

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('createResumeBuilder_data');
    const savedTemplate = localStorage.getItem('createResumeBuilder_template');
    const savedOrder = localStorage.getItem('createResumeBuilder_sectionOrder');
    
    if (savedData) {
      try {
        setResumeData(JSON.parse(savedData));
      } catch (error) {
        console.error("Failed to load saved data:", error);
      }
    }
    if (savedTemplate) {
      setSelectedTemplate(savedTemplate);
    }
    if (savedOrder) {
      try {
        setSectionOrder(JSON.parse(savedOrder));
      } catch (error) {
        console.error("Failed to load saved order:", error);
      }
    }
  }, []);

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

  const updateSectionData = (sectionId: string, data: any) => {
    setResumeData(prev => ({
      ...prev,
      [sectionId]: data
    }));
  };

  const handleSave = () => {
    localStorage.setItem('createResumeBuilder_data', JSON.stringify(resumeData));
    localStorage.setItem('createResumeBuilder_template', selectedTemplate);
    localStorage.setItem('createResumeBuilder_sectionOrder', JSON.stringify(sectionOrder));
    toast({
      title: "Draft saved",
      description: "Your resume has been saved successfully.",
    });
  };

  const handleImport = (importedData: any) => {
    setResumeData(importedData);
    toast({
      title: "Resume imported",
      description: "Your resume has been imported successfully.",
    });
  };

  const handleEnhance = (enhancedData: any) => {
    setResumeData(enhancedData);
    toast({
      title: "Resume enhanced",
      description: "AI has enhanced your resume content.",
    });
  };

  const addNewPage = () => {
    setTotalPages(prev => prev + 1);
    setCurrentPage(totalPages + 1);
    toast({
      title: "Page added",
      description: `Added page ${totalPages + 1} to your resume.`,
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const newOrder = Array.from(sectionOrder);
    const [moved] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, moved);
    setSectionOrder(newOrder);
  };

  const handleSidebarReorder = (newOrder: string[]) => {
    setSectionOrder(newOrder);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b shadow-nav">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FileText className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">Resume Builder</h1>
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? 'Hide' : 'Preview'}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowImportModal(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setShowExportModal(true)}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full">
        {/* Sidebar Navigation */}
        <ResumeBuilderSidebar
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          sectionOrder={sectionOrder}
          resumeData={resumeData}
          onAddCustomSection={() => setShowCustomSectionModal(true)}
          onReorderSections={handleSidebarReorder}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Main Content */}
        <div className={`flex-1 ${showPreview ? 'grid grid-cols-2 gap-6' : ''}`}>
          <div className="p-6">
            {sectionOrder.map((sectionId, index) => (
              <ResumeSection
                key={sectionId}
                sectionId={sectionId}
                index={index}
                resumeData={resumeData}
                updateResumeData={updateResumeData}
                isActive={activeSection === sectionId}
                onActivate={() => setActiveSection(sectionId)}
              />
            ))}
          </div>

          {/* Live Preview */}
          {showPreview && (
            <div className="border-l bg-muted/30 p-6">
              <ResumePreview
                resumeData={resumeData}
                template={selectedTemplate}
                currentPage={currentPage}
              />
            </div>
          )}
        </div>

        {/* ATS Score Panel */}
        <ATSScorePanel resumeData={resumeData} />
      </div>

      {/* Floating Toolbar */}
      <FloatingToolbar
        onSave={handleSave}
        onPreview={() => setShowPreview(!showPreview)}
        onExport={() => setShowExportModal(true)}
        onImport={() => setShowImportModal(true)}
        onEnhanceAI={() => setShowAIModal(true)}
        showPreview={showPreview}
      />

      {/* Template Toggle */}
      <Button
        className="fixed bottom-6 left-6 z-40 shadow-swiss"
        onClick={() => setShowTemplateCarousel(!showTemplateCarousel)}
        variant="secondary"
        size="sm"
      >
        <Settings className="w-4 h-4 mr-2" />
        Templates
      </Button>

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
        template={selectedTemplate} 
      />
      
      <AIEnhanceModal 
        open={showAIModal} 
        onOpenChange={setShowAIModal} 
        resumeData={resumeData} 
        onEnhance={handleEnhance} 
      />
      
      <CustomSectionModal 
        open={showCustomSectionModal} 
        onOpenChange={setShowCustomSectionModal} 
        onAdd={addCustomSection} 
      />

      <Footer />
    </div>
  );
}
