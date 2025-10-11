import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { FileText, Eye, Download, Printer, Plus, X, Sparkles, Briefcase, GraduationCap, Code2, FolderOpen, Award } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Components
import { Header } from './header';
import { Sidebar } from './sidebar';
import { ResumePreview } from './preview/ResumePreview';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Form Components
import { PersonalInfoForm } from './forms/PersonalInfoForm';
import { ExperienceForm } from './forms/ExperienceForm';
import { EducationForm } from './forms/EducationForm';
import { SkillsForm } from './forms/SkillsForm';
import { ProjectsForm } from './forms/ProjectsForm';
import { CertificationsForm } from './forms/CertificationsForm';
// Types
import { ResumeData, PersonalInfo, Experience, Education, Project, Skill, Certification } from './types';

// Initial data
  const sections = [
  { id: 'personal', title: 'Personal Info', value: 'personal', icon: <FileText className="h-4 w-4 mr-2" /> },
  { id: 'experience', title: 'Experience', value: 'experience', icon: <Briefcase className="h-4 w-4 mr-2" /> },
  { id: 'education', title: 'Education', value: 'education', icon: <GraduationCap className="h-4 w-4 mr-2" /> },
  { id: 'skills', title: 'Skills', value: 'skills', icon: <Code2 className="h-4 w-4 mr-2" /> },
  { id: 'projects', title: 'Projects', value: 'projects', icon: <FolderOpen className="h-4 w-4 mr-2" /> },
  { id: 'certifications', title: 'Certifications', value: 'certifications', icon: <Award className="h-4 w-4 mr-2" /> },
  { id: 'ats', title: 'ATS Score', value: 'ats', icon: <Sparkles className="h-4 w-4 mr-2" /> },
];  ];

const ResumeWizardNew = () => {
  const navigate = useNavigate();
    const saved = localStorage.getItem('resumeData');
    return saved ? JSON.parse(saved) : initialResumeData;
{{ ... }}
                        certifications={resumeData.certifications} 
                        onChange={handleCertificationsChange} 
                      />
                    </TabsContent>
          
          <TabsContent value="ats" className="mt-0">
            <Card className="mt-0">
              <CardHeader>
                <CardTitle className="text-2xl">ATS Score & Optimization</CardTitle>
                <CardDescription>
                  Get your resume's ATS score and optimization suggestions based on a job description.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ATSScoreForm 
                  atsScore={resumeData.atsScore}
                  onAnalyze={handleAnalyzeATS}
                  isAnalyzing={isAnalyzing}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>          </div>
                </Tabs>
              </CardContent>
          </div>
          
{{ ... }}
          <div className="hidden lg:block lg:col-span-3">
            <Card className="h-full">
              <CardContent className="p-6 h-full">
                <ResumePreview 
                  data={resumeData}
                  currentPage={1}
                  totalPages={1}
                  onPageChange={() => {}}
                  onDownload={handleDownloadPdf}
                  onPrint={handlePrint}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Preview Modal - For mobile view */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-6xl w-[90%] h-[90vh] p-0 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <DialogHeader>
              <DialogTitle>Resume Preview</DialogTitle>
            </DialogHeader>
            <Button variant="ghost" size="icon" onClick={() => setIsPreviewOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-[calc(100%-60px)]">
            <ResumePreview 
              data={resumeData}
              currentPage={1}
              totalPages={1}
              onPageChange={() => {}}
              onDownload={handleDownloadPdf}
              onPrint={handlePrint}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResumeWizardNew;
