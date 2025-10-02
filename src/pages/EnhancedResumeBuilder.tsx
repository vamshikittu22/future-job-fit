import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useResume } from '@/contexts/ResumeContext';

const EnhancedResumeBuilder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { clearForm } = useResume();
  const [activeTab, setActiveTab] = useState('blank');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateBlank = () => {
    clearForm();
    navigate('/create-resume');
  };

  const handleUseTemplate = () => {
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      clearForm();
      setIsLoading(false);
      navigate('/create-resume');
      toast({
        title: "Template loaded",
        description: "You can now customize your resume template.",
      });
    }, 1000);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        // Here you would process the imported data
        console.log('Imported data:', data);
        navigate('/create-resume');
        toast({
          title: "Resume imported",
          description: "Your resume has been imported successfully.",
        });
      } catch (error) {
        toast({
          title: "Import failed",
          description: "Invalid file format. Please upload a valid JSON file.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Create Your Resume</h1>
        <p className="text-muted-foreground">
          Choose how you'd like to get started with your resume
        </p>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="blank">
            <FileText className="w-4 h-4 mr-2" />
            Start Blank
          </TabsTrigger>
          <TabsTrigger value="templates">
            <FileText className="w-4 h-4 mr-2" />
            Use Template
          </TabsTrigger>
          <TabsTrigger value="import">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </TabsTrigger>
        </TabsList>

        <TabsContent value="blank" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Start from Scratch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Create a resume from the ground up with our easy-to-use editor.
              </p>
              <Button 
                onClick={handleCreateBlank}
                className="w-full md:w-auto"
              >
                Create Blank Resume
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Choose a Template</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Professional', 'Modern', 'Creative', 'Minimal'].map((template) => (
                  <div 
                    key={template}
                    className="border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
                    onClick={handleUseTemplate}
                  >
                    <div className="h-32 bg-muted rounded mb-2 flex items-center justify-center">
                      <span className="text-muted-foreground">{template} Preview</span>
                    </div>
                    <h3 className="font-medium">{template} Template</h3>
                    <p className="text-sm text-muted-foreground">
                      {template === 'Professional' && 'Clean and professional design'}
                      {template === 'Modern' && 'Sleek and contemporary layout'}
                      {template === 'Creative' && 'Unique and eye-catching style'}
                      {template === 'Minimal' && 'Simple and focused layout'}
                    </p>
                  </div>
                ))}
              </div>
              {isLoading && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading template...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Import Resume</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-medium mb-2">Drag and drop your file here</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Supported formats: .json
                </p>
                <label className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer">
                  Select File
                  <input 
                    type="file" 
                    accept=".json" 
                    className="hidden" 
                    onChange={handleImport}
                  />
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedResumeBuilder;
