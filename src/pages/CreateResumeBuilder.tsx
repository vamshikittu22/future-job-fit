import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { FileText, Plus, Settings } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingToolbar from "@/components/FloatingToolbar";
import CollapsibleTemplateBar from "@/components/CollapsibleTemplateBar";
import DynamicSection from "@/components/DynamicSection";
import ResumePreview from "@/components/ResumePreview";
import ImportResumeModal from "@/components/ImportResumeModal";
import ExportResumeModal from "@/components/ExportResumeModal";
import CustomizeAIModal from "@/components/CustomizeAIModal";
import { useToast } from "@/hooks/use-toast";

interface ResumeData {
  personal: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
  };
  summary: {
    summary: string;
  };
  skills: {
    categories: Array<{
      id: string;
      name: string;
      skills: string[];
    }>;
  };
  experience: {
    experiences: Array<{
      id: string;
      title: string;
      company: string;
      duration: string;
      location: string;
      description: string;
    }>;
  };
  education: {
    items: Array<{
      id: string;
      degree: string;
      school: string;
      year: string;
      gpa?: string;
    }>;
  };
  projects: {
    items: Array<{
      id: string;
      name: string;
      description: string;
      tech: string;
      links: string[];
    }>;
  };
  certifications: {
    items: Array<{
      id: string;
      title: string;
      issuer: string;
      date: string;
    }>;
  };
  achievements: {
    items: string[];
  };
}

const initialResumeData: ResumeData = {
  personal: {
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    linkedin: ""
  },
  summary: {
    summary: ""
  },
  skills: {
    categories: []
  },
  experience: {
    experiences: []
  },
  education: {
    items: []
  },
  projects: {
    items: []
  },
  certifications: {
    items: []
  },
  achievements: {
    items: []
  }
};

const defaultSections = [
  { id: 'personal', title: 'Personal Information', required: true },
  { id: 'summary', title: 'Professional Summary', required: false },
  { id: 'skills', title: 'Technical Skills', required: false },
  { id: 'experience', title: 'Professional Experience', required: false },
  { id: 'education', title: 'Education', required: false },
  { id: 'projects', title: 'Projects', required: false },
  { id: 'certifications', title: 'Certifications', required: false },
  { id: 'achievements', title: 'Achievements', required: false }
];

export default function CreateResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [activeSections, setActiveSections] = useState(['personal', 'summary', 'skills', 'experience']);
  const [activeSection, setActiveSection] = useState('personal');
  const [selectedTemplate, setSelectedTemplate] = useState('minimal-1');
  const [showPreview, setShowPreview] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCustomizeAI, setShowCustomizeAI] = useState(false);
  const { toast } = useToast();

  // Auto-save functionality
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem('createResumeBuilder_data', JSON.stringify(resumeData));
      localStorage.setItem('createResumeBuilder_template', selectedTemplate);
      localStorage.setItem('createResumeBuilder_activeSections', JSON.stringify(activeSections));
    }, 30000);

    return () => clearInterval(interval);
  }, [resumeData, selectedTemplate, activeSections]);

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('createResumeBuilder_data');
    const savedTemplate = localStorage.getItem('createResumeBuilder_template');
    const savedSections = localStorage.getItem('createResumeBuilder_activeSections');
    
    if (savedData) {
      setResumeData(JSON.parse(savedData));
    }
    if (savedTemplate) {
      setSelectedTemplate(savedTemplate);
    }
    if (savedSections) {
      setActiveSections(JSON.parse(savedSections));
    }
  }, []);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(activeSections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setActiveSections(items);
    toast({
      title: "Section reordered",
      description: "Your resume sections have been reorganized.",
    });
  };

  const updateSectionData = (sectionId: keyof ResumeData, data: any) => {
    setResumeData(prev => ({
      ...prev,
      [sectionId]: data
    }));
  };

  const addSection = (sectionId: string) => {
    if (!activeSections.includes(sectionId)) {
      setActiveSections(prev => [...prev, sectionId]);
    }
  };

  const removeSection = (sectionId: string) => {
    const section = defaultSections.find(s => s.id === sectionId);
    if (section?.required) {
      toast({
        title: "Cannot remove section",
        description: "This section is required and cannot be removed.",
        variant: "destructive"
      });
      return;
    }
    setActiveSections(prev => prev.filter(id => id !== sectionId));
  };

  const handleSave = () => {
    localStorage.setItem('createResumeBuilder_data', JSON.stringify(resumeData));
    localStorage.setItem('createResumeBuilder_template', selectedTemplate);
    localStorage.setItem('createResumeBuilder_activeSections', JSON.stringify(activeSections));
  };

  const handleEnhanceAI = () => {
    setShowCustomizeAI(true);
  };

  const availableSections = defaultSections.filter(section => !activeSections.includes(section.id));

  return (
    <div className="min-h-screen bg-background pb-32">
      <Navigation />
      
      {/* Floating Toolbar */}
      <FloatingToolbar
        onSave={handleSave}
        onPreview={() => setShowPreview(!showPreview)}
        onExport={() => setShowExportModal(true)}
        onImport={() => setShowImportModal(true)}
        onEnhanceAI={handleEnhanceAI}
        showPreview={showPreview}
      />

      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <FileText className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Create Resume</h1>
            <p className="text-muted-foreground">
              Build your professional resume with AI-powered assistance
            </p>
          </div>
        </div>

        <div className={`${showPreview ? 'grid grid-cols-2 gap-8' : ''}`}>
          {/* Builder Content */}
          <div>
            {/* Add Section Controls */}
            {availableSections.length > 0 && (
              <Card className="p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Add Sections</span>
                  <div className="flex gap-2 flex-wrap">
                    {availableSections.map(section => (
                      <Button
                        key={section.id}
                        variant="outline"
                        size="sm"
                        onClick={() => addSection(section.id)}
                        className="text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {section.title}
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Dynamic Sections */}
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="sections">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-6">
                    {activeSections.map((sectionId, index) => {
                      const section = defaultSections.find(s => s.id === sectionId);
                      if (!section) return null;
                      
                      return (
                        <DynamicSection
                          key={sectionId}
                          sectionId={sectionId}
                          index={index}
                          title={section.title}
                          data={resumeData[sectionId as keyof ResumeData]}
                          onUpdate={(data) => updateSectionData(sectionId as keyof ResumeData, data)}
                          onDelete={() => removeSection(sectionId)}
                          isActive={activeSection === sectionId}
                          onActivate={() => setActiveSection(sectionId)}
                        />
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          {/* Live Preview */}
          {showPreview && (
            <div className="sticky top-8">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Live Preview</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCustomizeAI(true)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Customize AI
                  </Button>
                </div>
                <Separator className="mb-4" />
                <ResumePreview
                  resumeData={resumeData}
                  template={selectedTemplate}
                  currentPage={1}
                />
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Collapsible Template Bar */}
      <CollapsibleTemplateBar
        selectedTemplate={selectedTemplate}
        onTemplateChange={setSelectedTemplate}
      />

      {/* Modals */}
      <ImportResumeModal
        open={showImportModal}
        onOpenChange={setShowImportModal}
        onImport={(data) => {
          // Convert imported data to our format
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

      <CustomizeAIModal
        open={showCustomizeAI}
        onOpenChange={setShowCustomizeAI}
        onSave={(instructions) => {
          // Save AI instructions
          localStorage.setItem('createResumeBuilder_aiInstructions', JSON.stringify(instructions));
          toast({
            title: "AI instructions saved",
            description: "Your customization preferences have been saved.",
          });
        }}
      />

      <Footer />
    </div>
  );
}