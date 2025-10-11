import { useState } from 'react';
import { FileText, Briefcase, GraduationCap, Code2, FolderOpen, Award, Sparkles, Eye, X, Menu, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

// Types
interface ResumeData {
  personal: {
    name: string;
    email: string;
    phone: string;
    location: string;
    portfolioUrl: string;
    linkedinUrl: string;
    githubUrl: string;
    summary: string;
  };
  experience: any[];
  education: any[];
  skills: any[];
  projects: any[];
  certifications: any[];
  achievements: any[];
  languages: any[];
}

const sections = [
  { id: 'personal', title: 'Personal Info', value: 'personal', icon: <FileText className="h-4 w-4 mr-2" /> },
  { id: 'experience', title: 'Experience', value: 'experience', icon: <Briefcase className="h-4 w-4 mr-2" /> },
  { id: 'education', title: 'Education', value: 'education', icon: <GraduationCap className="h-4 w-4 mr-2" /> },
  { id: 'skills', title: 'Skills', value: 'skills', icon: <Code2 className="h-4 w-4 mr-2" /> },
  { id: 'projects', title: 'Projects', value: 'projects', icon: <FolderOpen className="h-4 w-4 mr-2" /> },
  { id: 'certifications', title: 'Certifications', value: 'certifications', icon: <Award className="h-4 w-4 mr-2" /> },
  { id: 'ats', title: 'ATS Score', value: 'ats', icon: <Sparkles className="h-4 w-4 mr-2" /> },
];

const ResumeWizardNew = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [resumeData, setResumeData] = useState<ResumeData>({
    personal: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      portfolioUrl: 'https://johndoe.portfolio',
      linkedinUrl: 'https://linkedin.com/in/johndoe',
      githubUrl: 'https://github.com/johndoe',
      summary: 'Experienced software engineer with 5+ years of experience in web development.',
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    achievements: [],
    languages: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResumeData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        [name]: value
      }
    }));
  };

  const togglePreview = () => setShowPreview(!showPreview);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden mr-2"
              onClick={toggleMobileMenu}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Resume Builder</h1>
          </div>
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
          {/* Sidebar */}
          <div className={`lg:w-1/4 ${isMobileMenuOpen ? 'block' : 'hidden'} lg:block`}>
            <Card>
              <CardHeader>
                <CardTitle>Resume Sections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {sections.map((section) => (
                    <Button
                      key={section.id}
                      variant={activeTab === section.value ? 'secondary' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setActiveTab(section.value)}
                    >
                      {section.icon}
                      {section.title}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className={`${showPreview ? 'lg:w-1/2' : 'lg:w-3/4'} w-full`}>
            <Tabs value={activeTab} className="space-y-6">
              <TabsContent value="personal" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <Input
                          name="name"
                          value={resumeData.personal.name}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <Input
                          name="email"
                          type="email"
                          value={resumeData.personal.email}
                          onChange={handleInputChange}
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Phone</label>
                        <Input
                          name="phone"
                          value={resumeData.personal.phone}
                          onChange={handleInputChange}
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <Input
                          name="location"
                          value={resumeData.personal.location}
                          onChange={handleInputChange}
                          placeholder="City, Country"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Summary</label>
                      <Textarea
                        name="summary"
                        value={resumeData.personal.summary}
                        onChange={handleInputChange}
                        placeholder="A brief summary about yourself and your experience..."
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {sections.slice(1).map((section) => (
                <TabsContent key={section.id} value={section.value} className="m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-gray-500">
                        {section.icon}
                        <p className="text-lg font-medium mt-2">Your {section.title} will appear here</p>
                        <p className="text-sm">Click the button below to add new {section.title.toLowerCase()}</p>
                        <Button className="mt-4" variant="outline">
                          <Plus className="h-4 w-4 mr-2" /> Add {section.title}
                        </Button>
                      </div>
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
                  <h2 className="text-xl font-bold">{resumeData.personal.name}</h2>
                  <p className="text-gray-600">{resumeData.personal.email}</p>
                  <p className="text-gray-600">{resumeData.personal.phone}</p>
                  <p className="text-gray-600 mb-4">{resumeData.personal.location}</p>
                  
                  {resumeData.personal.summary && (
                    <div className="mt-4">
                      <h3 className="font-semibold text-gray-800">Summary</h3>
                      <p className="text-gray-600 text-sm">{resumeData.personal.summary}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
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
          <div className="h-[calc(100%-60px)] p-8">
            <div className="bg-white p-8 shadow-lg max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-2">{resumeData.personal.name}</h1>
              <div className="flex flex-wrap gap-4 text-gray-600 mb-6">
                <span>{resumeData.personal.email}</span>
                <span>•</span>
                <span>{resumeData.personal.phone}</span>
                <span>•</span>
                <span>{resumeData.personal.location}</span>
              </div>
              
              {resumeData.personal.summary && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold border-b pb-1 mb-2">Summary</h2>
                  <p className="text-gray-700">{resumeData.personal.summary}</p>
                </div>
              )}
              
              <div className="space-y-8">
                {sections.slice(1).map((section) => (
                  <div key={section.id}>
                    <h2 className="text-xl font-semibold border-b pb-1 mb-4">{section.title}</h2>
                    <p className="text-gray-500">Your {section.title.toLowerCase()} will appear here</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResumeWizardNew;
