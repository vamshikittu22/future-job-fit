import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Menu, X, Eye, EyeOff, ExternalLink, FileText, Briefcase, GraduationCap, Code, Award, Sparkles, FolderOpen, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CertificationsForm } from './forms/CertificationsForm';
import { Certification, CustomSection } from '@/types/resume';
import { useResume } from '@/contexts/ResumeContext';
import { CustomSections } from './CustomSections';

// Types
interface Section {
  id: string;
  title: string;
  value: string;
  icon: React.ReactNode;
}

interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'date';
}

interface CustomSectionEntry {
  id: string;
  values: Record<string, string>;
}

const sections: Section[] = [
  { id: 'personal', title: 'Personal Info', value: 'personal', icon: <FileText className="h-4 w-4 mr-2" /> },
  { id: 'experience', title: 'Experience', value: 'experience', icon: <Briefcase className="h-4 w-4 mr-2" /> },
  { id: 'education', title: 'Education', value: 'education', icon: <GraduationCap className="h-4 w-4 mr-2" /> },
  { id: 'skills', title: 'Skills', value: 'skills', icon: <Code className="h-4 w-4 mr-2" /> },
  { id: 'projects', title: 'Projects', value: 'projects', icon: <FolderOpen className="h-4 w-4 mr-2" /> },
  { id: 'certifications', title: 'Certifications', value: 'certifications', icon: <Award className="h-4 w-4 mr-2" /> },
  { id: 'custom', title: 'Custom Sections', value: 'custom', icon: <FileText className="h-4 w-4 mr-2" /> },
  { id: 'ats', title: 'ATS Score', value: 'ats', icon: <Sparkles className="h-4 w-4 mr-2" /> },
];

const FixedResumeWizard = () => {
  const { resumeData, updateResumeData } = useResume();
  const [activeTab, setActiveTab] = useState('personal');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [certifications, setCertifications] = useState<Certification[]>(resumeData.certifications || []);
  const [customSections, setCustomSections] = useState<CustomSection[]>(resumeData.customSections || []);

  // Sync local state with resumeData
  useEffect(() => {
    setCertifications(resumeData.certifications || []);
    if (JSON.stringify(customSections) !== JSON.stringify(resumeData.customSections || [])) {
      setCustomSections(resumeData.customSections || []);
    }
  }, [resumeData]);

  const removeCustomSection = (sectionId: string) => {
    const updatedSections = customSections.filter(s => s.id !== sectionId);
    setCustomSections(updatedSections);
    updateResumeData('customSections', updatedSections);
  };

  const addNewCustomSection = () => {
    const newSection: CustomSection = {
      id: `custom-${Date.now()}`,
      title: 'New Section',
      fields: [
        { id: `field-${Date.now()}-1`, name: 'Field 1', type: 'text' },
        { id: `field-${Date.now()}-2`, name: 'Description', type: 'textarea' }
      ],
      entries: [
        { 
          id: `entry-${Date.now()}`, 
          values: {
            [`field-${Date.now()}-1`]: '',
            [`field-${Date.now()}-2`]: ''
          } 
        }
      ]
    };
    const updatedSections = [...customSections, newSection];
    setCustomSections(updatedSections);
    updateResumeData('customSections', updatedSections);
  };

  const handleCertificationsChange = (updatedCertifications: Certification[]) => {
    updateResumeData('certifications', updatedCertifications);
  };

  const handleCustomSectionChange = (sectionId: string, updatedFields: Partial<CustomSection>) => {
    const updatedSections = customSections.map(section => 
      section.id === sectionId ? { ...section, ...updatedFields } : section
    );
    setCustomSections(updatedSections);
    updateResumeData('customSections', updatedSections);
  };

  const handleCustomSectionFieldChange = (sectionId: string, fieldId: string, value: string | string[]) => {
    setCustomSections(prevSections => {
      const updatedSections = prevSections.map(section => {
        if (section.id === sectionId) {
          // Ensure entries exist, if not create a default one
          const entries = section.entries.length > 0 
            ? section.entries 
            : [{ id: `entry-${Date.now()}`, values: {} }];

          const updatedEntries = entries.map(entry => ({
            ...entry,
            values: {
              ...entry.values,
              [fieldId]: value
            }
          }));
          
          return { 
            ...section, 
            entries: updatedEntries 
          };
        }
        return section;
      });
      
      // Update the resume data with the new sections
      updateResumeData('customSections', updatedSections);
      return updatedSections;
    });
  };

  const handleAddField = (sectionId: string) => {
    const newFieldId = `field-${Date.now()}`;
    const newField = {
      id: newFieldId,
      name: 'New Field',
      type: 'text' as const
    };

    setCustomSections(prevSections => {
      const updatedSections = prevSections.map(section => {
        if (section.id === sectionId) {
          const newEntries = section.entries.map(entry => ({
            ...entry,
            values: {
              ...entry.values,
              [newFieldId]: ''
            }
          }));

          return {
            ...section,
            fields: [...section.fields, newField],
            entries: newEntries
          };
        }
        return section;
      });

      updateResumeData('customSections', updatedSections);
      return updatedSections;
    });
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Toggle preview panel
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  // Handle custom sections update
  const handleCustomSectionsUpdate = (updatedSections: any[]) => {
    updateResumeData('customSections', updatedSections);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">Resume Builder</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4 mr-2" />
              ) : (
                <Menu className="h-4 w-4 mr-2" />
              )}
              {isMobileMenuOpen ? 'Close' : 'Menu'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={togglePreview}
              className="hidden lg:flex items-center"
            >
              {showPreview ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Hide Preview
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Show Preview
                </>
              )}
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

              {/* Experience Section */}
              <TabsContent value="experience" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Work Experience</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Experience section content will appear here.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Education Section */}
              <TabsContent value="education" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Education</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Education section content will appear here.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Skills Section */}
              <TabsContent value="skills" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Skills section content will appear here.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Projects Section */}
              <TabsContent value="projects" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Projects section content will appear here.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Certifications Section */}
              <TabsContent value="certifications" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Certifications</CardTitle>
                    <CardDescription>
                      Add your professional certifications and licenses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CertificationsForm 
                      certifications={certifications}
                      onChange={handleCertificationsChange}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Custom Sections */}
              <TabsContent value="custom" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Custom Sections</CardTitle>
                    <CardDescription>
                      Add and manage your custom resume sections
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {customSections.map((section) => (
                        <div key={section.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">{section.title || 'Untitled Section'}</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCustomSection(section.id)}
                              className="text-destructive hover:text-destructive/80"
                            >
                              Remove Section
                            </Button>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor={`${section.id}-title`}>Section Title</Label>
                              <Input
                                id={`${section.id}-title`}
                                value={section.title}
                                onChange={(e) => 
                                  handleCustomSectionChange(section.id, { title: e.target.value })
                                }
                                placeholder="Enter section title"
                                className="mt-1"
                        </div>
                      ))}
                      
                      <Button
                        variant="outline"
                        className="w-full mt-4"
                        onClick={addNewCustomSection}
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add Custom Section
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ATS Score Section */}
              <TabsContent value="ats" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">ATS Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>ATS Score analysis will appear here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
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
                  <h2 className="text-xl font-bold mb-4">Your Resume</h2>
                  
                  {/* Certifications Preview */}
                  {activeTab === 'certifications' && certifications.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-1">Certifications</h3>
                      <ul className="space-y-4">
                        {certifications.map((cert, index) => (
                          <li key={index} className="border-l-2 border-primary pl-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{cert.name}</h4>
                                <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                                <div className="text-xs text-muted-foreground mt-1">
                                  <span>Issued: {new Date(cert.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short'
                                  })}</span>
                                  {cert.expiryDate && (
                                    <span className="ml-2">• Expires: {new Date(cert.expiryDate).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short'
                                    })}</span>
                                  )}
                                </div>
                                {cert.credentialId && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    ID: {cert.credentialId}
                                  </p>
                                )}
                              </div>
                              {cert.credentialUrl && (
                                <a 
                                  href={cert.credentialUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-primary hover:underline text-sm flex items-center"
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" /> Verify
                                </a>
                              )}
                            </div>
                            {cert.description && (
                              <p className="mt-2 text-sm">{cert.description}</p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Active Tab Content Preview */}
                  {activeTab === 'certifications' && certifications.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-1">Certifications</h3>
                      <ul className="space-y-4">
                        {certifications.map((cert, index) => (
                          <li key={index} className="border-l-2 border-primary pl-3">
                            {/* ... existing certification preview ... */}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : activeTab !== 'custom' ? (
                    <div className="text-muted-foreground">
                      <p>Preview for this section will appear here.</p>
                      {activeTab === 'personal' && <p>Your personal information will be displayed here.</p>}
                      {activeTab === 'experience' && <p>Your work experience will be displayed here.</p>}
                      {activeTab === 'education' && <p>Your education details will be displayed here.</p>}
                      {activeTab === 'skills' && <p>Your skills will be displayed here.</p>}
                      {activeTab === 'projects' && <p>Your projects will be displayed here.</p>}
                      {activeTab === 'ats' && <p>Your ATS score analysis will appear here.</p>}
                    </div>
                  ) : null}

                  {/* Always show custom sections in preview when they exist */}
                  {customSections.length > 0 && (
                    <div className="mt-8 space-y-6">
                      <h3 className="text-lg font-semibold border-b pb-1">Custom Sections</h3>
                      {customSections.map((section) => (
                        <div key={section.id} className="space-y-2 border-l-2 border-primary pl-3">
                          <div className="flex justify-between items-center">
                            <h4 className="text-md font-medium">{section.title || 'Untitled Section'}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive/80"
                              onClick={() => removeCustomSection(section.id)}
                            >
                              Remove Section
                            </Button>
                          </div>
                          <div className="space-y-1 pl-2">
                            {section.entries && section.entries.length > 0 ? (
                              section.entries.map((entry, entryIndex) => (
                                <div key={entryIndex} className="space-y-2">
                                  {section.fields
                                    .filter(field => entry.values && entry.values[field.id])
                                    .map((field) => (
                                      <div key={field.id} className="text-sm">
                                        {field.type === 'textarea' ? (
                                          <p className="whitespace-pre-line">{entry.values[field.id]}</p>
                                        ) : (
                                          <p>
                                            <span className="font-medium">{field.name}:</span>{' '}
                                            {entry.values[field.id]}
                                          </p>
                                        )}
                                      </div>
                                    ))}
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground">No entries yet</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
