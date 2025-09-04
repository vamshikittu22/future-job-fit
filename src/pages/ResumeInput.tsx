import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

export default function ResumeInput() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const navigate = useNavigate();

  const handleGenerate = () => {
    if (!resumeText.trim()) {
      return;
    }
    
    // Store data in localStorage for now (in production would use proper state management)
    localStorage.setItem("resumeText", resumeText);
    localStorage.setItem("jobDescription", jobDescription);
    
    navigate("/results");
  };

  const loadExample = () => {
    setResumeText(`John Smith
Senior Software Engineer
john.smith@email.com | (555) 123-4567 | LinkedIn: linkedin.com/in/johnsmith

EXPERIENCE
Senior Software Engineer - TechCorp (2020-Present)
• Developed scalable web applications using React and Node.js
• Led team of 5 developers on client projects
• Improved application performance by 40%
• Collaborated with cross-functional teams

Software Engineer - StartupXYZ (2018-2020)  
• Built responsive frontend interfaces
• Worked with REST APIs and databases
• Participated in agile development process

EDUCATION
Bachelor of Science in Computer Science
State University (2014-2018)

SKILLS
JavaScript, React, Node.js, Python, SQL, Git`);

    setJobDescription(`We are seeking a Senior Frontend Developer to join our dynamic team. The ideal candidate will have:

REQUIREMENTS:
• 5+ years of experience in frontend development
• Expert knowledge of React, TypeScript, and modern JavaScript
• Experience with state management (Redux, Zustand)
• Proficiency in CSS frameworks (Tailwind, Styled Components)
• Knowledge of testing frameworks (Jest, Cypress)
• Experience with CI/CD pipelines and deployment
• Strong problem-solving and communication skills
• Bachelor's degree in Computer Science or related field

PREFERRED:
• Experience with Next.js or similar frameworks
• Knowledge of GraphQL and Apollo Client
• Familiarity with micro-frontend architectures
• Previous leadership or mentoring experience`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Resume Analysis</h1>
        </div>

        {/* Input Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Resume Input */}
          <Card className="p-6 shadow-swiss">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-accent" />
              </div>
              <div>
                <Label htmlFor="resume" className="text-lg font-semibold">
                  Resume Text
                </Label>
                <p className="text-sm text-muted-foreground">
                  Copy and paste your resume content
                </p>
              </div>
            </div>
            
            <Textarea
              id="resume"
              placeholder="Paste your resume here (copy from Word/PDF)&#10;&#10;Include your contact info, experience, education, and skills..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="min-h-[400px] text-sm leading-relaxed"
            />
          </Card>

          {/* Job Description Input */}
          <Card className="p-6 shadow-swiss">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-accent" />
              </div>
              <div>
                <Label htmlFor="job-description" className="text-lg font-semibold">
                  Job Description <span className="text-muted-foreground font-normal">(Optional)</span>
                </Label>
                <p className="text-sm text-muted-foreground">
                  Add the target job posting for better tailoring
                </p>
              </div>
            </div>
            
            <Textarea
              id="job-description"
              placeholder="Paste the target job description here&#10;&#10;Include requirements, responsibilities, and preferred qualifications..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[400px] text-sm leading-relaxed"
            />
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <Button 
            variant="hero" 
            size="lg" 
            onClick={handleGenerate}
            disabled={!resumeText.trim()}
            className="px-8"
          >
            Generate Resume
          </Button>
          <Button 
            variant="secondary" 
            size="lg" 
            onClick={loadExample}
            className="px-8"
          >
            Load Example
          </Button>
        </div>
      </div>
    </div>
  );
}