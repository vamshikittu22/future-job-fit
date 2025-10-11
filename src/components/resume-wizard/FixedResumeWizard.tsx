import { useState } from 'react';
import { FileText, Briefcase, GraduationCap, Code2, FolderOpen, Award, Sparkles, Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Types
interface Section {
  id: string;
  title: string;
  value: string;
  icon: React.ReactNode;
}

const sections: Section[] = [
  { id: 'personal', title: 'Personal Info', value: 'personal', icon: <FileText className="h-4 w-4 mr-2" /> },
  { id: 'experience', title: 'Experience', value: 'experience', icon: <Briefcase className="h-4 w-4 mr-2" /> },
  { id: 'education', title: 'Education', value: 'education', icon: <GraduationCap className="h-4 w-4 mr-2" /> },
  { id: 'skills', title: 'Skills', value: 'skills', icon: <Code2 className="h-4 w-4 mr-2" /> },
  { id: 'projects', title: 'Projects', value: 'projects', icon: <FolderOpen className="h-4 w-4 mr-2" /> },
  { id: 'certifications', title: 'Certifications', value: 'certifications', icon: <Award className="h-4 w-4 mr-2" /> },
  { id: 'ats', title: 'ATS Score', value: 'ats', icon: <Sparkles className="h-4 w-4 mr-2" /> },
];

const FixedResumeWizard = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Toggle preview panel
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">Resume Builder</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={togglePreview}>
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
            <Button onClick={() => setIsPreviewOpen(true)}>
              <Eye className="mr-2 h-4 w-4" /> Fullscreen
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Always visible on desktop */}
          <div className="lg:w-1/4">
            <Card>
              <CardHeader>
                <CardTitle>Resume Sections</CardTitle>
              </CardHeader>
              <CardContent>
                <TabsList className="flex flex-col h-auto p-0">
                  {sections.map((section) => (
                    <Button
                      key={section.id}
                      variant={activeTab === section.value ? 'secondary' : 'ghost'}
                      className={`w-full justify-start ${activeTab === section.value ? 'bg-gray-100' : ''}`}
                      onClick={() => setActiveTab(section.value)}
                    >
                      {section.icon}
                      {section.title}
                    </Button>
                  ))}
                </TabsList>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className={`${showPreview ? 'lg:w-1/2' : 'lg:w-3/4'} w-full`}>
            <Tabs value={activeTab} className="space-y-6">
              <TabsContent value="personal" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Personal Info Form will go here */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input 
                          type="text" 
                          className="w-full p-2 border rounded" 
                          placeholder="John Doe"
                        />
                      </div>
                      {/* Add more form fields as needed */}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Add other sections here */}
              {sections.slice(1).map((section) => (
                <TabsContent key={section.id} value={section.value} className="m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-2xl">{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Content for {section.title} will appear here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="lg:w-1/4 w-full">
              <Card className="h-full">
                <CardHeader className="border-b">
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent className="p-4 h-[calc(100vh-200px)] overflow-auto">
                  <h2 className="text-xl font-bold">Your Resume</h2>
                  <p className="text-gray-600">Resume preview will appear here</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed bottom-4 right-4">
        <Button 
          size="icon" 
          className="rounded-full w-12 h-12 shadow-lg"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
        </Button>
      </div>

      {/* Fullscreen Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-6xl w-[90%] h-[90vh] p-0 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <DialogHeader>
              <DialogTitle>Fullscreen Preview</DialogTitle>
            </DialogHeader>
            <Button variant="ghost" size="icon" onClick={() => setIsPreviewOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-[calc(100%-60px)] p-4">
            <h2 className="text-2xl font-bold mb-4">Your Resume</h2>
            <p>Fullscreen preview will appear here</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FixedResumeWizard;
