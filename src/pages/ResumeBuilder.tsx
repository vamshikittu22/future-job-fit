import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { FileText, Download, Upload, Save, Eye, Plus } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ResumeBuilderSidebar from "@/components/ResumeBuilderSidebar";
import ResumeSection from "@/components/ResumeSection";
import TemplateCarousel from "@/components/TemplateCarousel";
import ResumePreview from "@/components/ResumePreview";
import ImportResumeModal from "@/components/ImportResumeModal";
import ExportResumeModal from "@/components/ExportResumeModal";
import { useToast } from "@/hooks/use-toast";

interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
  };
  summary: string;
  skills: string[];
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
  }>;
  achievements: string[];
  certifications: string[];
}

const initialResumeData: ResumeData = {
  personalInfo: {
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: ""
  },
  summary: "",
  skills: [],
  experience: [],
  education: [],
  projects: [],
  achievements: [],
  certifications: []
};

export default function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
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
    const interval = setInterval(() => {
      localStorage.setItem('resumeBuilder_data', JSON.stringify(resumeData));
      localStorage.setItem('resumeBuilder_template', selectedTemplate);
      localStorage.setItem('resumeBuilder_sectionOrder', JSON.stringify(sectionOrder));
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(interval);
  }, [resumeData, selectedTemplate, sectionOrder]);

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('resumeBuilder_data');
    const savedTemplate = localStorage.getItem('resumeBuilder_template');
    const savedOrder = localStorage.getItem('resumeBuilder_sectionOrder');
    
    if (savedData) {
      setResumeData(JSON.parse(savedData));
    }
    if (savedTemplate) {
      setSelectedTemplate(savedTemplate);
    }
    if (savedOrder) {
      setSectionOrder(JSON.parse(savedOrder));
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

  const updateResumeData = (section: keyof ResumeData, data: any) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const handleSave = () => {
    localStorage.setItem('resumeBuilder_data', JSON.stringify(resumeData));
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
      <Navigation />
      
      {/* Header with Actions */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowImportModal(true)}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Import
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                {showPreview ? 'Hide' : 'Preview'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowExportModal(true)}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
              
              {currentPage === totalPages && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addNewPage}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Page
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Navigation */}
        <ResumeBuilderSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          sectionOrder={sectionOrder}
          resumeData={resumeData}
        />

        {/* Main Content */}
        <div className={`flex-1 ${showPreview ? 'grid grid-cols-2 gap-6' : ''}`}>
          {/* Builder Content */}
          <div className="p-6">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="sections">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
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
            <div className="border-l bg-muted/30">
              <div className="sticky top-24 p-6">
                <ResumePreview
                  resumeData={resumeData}
                  template={selectedTemplate}
                  currentPage={currentPage}
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
          setResumeData(data);
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
      />

      <Footer />
    </div>
  );
}