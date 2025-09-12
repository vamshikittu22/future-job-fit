{{ ... }}
import { ResumeSection } from "./ResumeSection";
import { ResumePreview } from "./ResumePreview";
import { Button } from "./ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { initialResumeData } from "@/lib/initialData";

export function ResumeBuilder({
  sectionId,
  resumeData,
  updateResumeData,
  customSections = [],
  onUpdateCustomSection,
  onRemoveCustomSection,
}: {
  sectionId: string;
  resumeData: any;
  updateResumeData: (section: string, data: any) => void;
  customSections?: any[];
  onUpdateCustomSection?: (section: any) => void;
  onRemoveCustomSection?: (id: string) => void;
}) {
  const sections = [
    { id: "personal", label: "Personal Info" },
    { id: "work", label: "Work Experience" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "achievements", label: "Achievements" },
    { id: "certifications", label: "Certifications" },
    ...customSections.map((section) => ({
      id: section.id,
      label: section.title || "Custom Section",
    })),
  ];

  // Find the current section index for navigation
  const currentIndex = sections.findIndex((s) => s.id === sectionId);
  const prevSection = currentIndex > 0 ? sections[currentIndex - 1] : null;
  const nextSection = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {sections.find((s) => s.id === sectionId)?.label || "Resume Builder"}
        </h2>
      </div>

      <div className="bg-background rounded-lg border p-6">
        <ResumeSection
          key={sectionId}
          sectionId={sectionId}
          index={currentIndex}
          resumeData={resumeData}
          updateResumeData={updateResumeData}
          isActive={true}
          onActivate={() => {}}
        />
      </div>

      <div className="flex justify-between">
        {prevSection ? (
          <Button
            variant="outline"
            onClick={() => {
              // Update URL or state to navigate to previous section
              window.history.pushState({}, "", `?section=${prevSection.id}`);
              window.dispatchEvent(new Event("popstate"));
            }}
          >
            Previous: {prevSection.label}
          </Button>
        ) : (
          <div />
        )}
        {nextSection && (
          <Button
            onClick={() => {
              // Update URL or state to navigate to next section
              window.history.pushState({}, "", `?section=${nextSection.id}`);
              window.dispatchEvent(new Event("popstate"));
            }}
          >
            Next: {nextSection.label}
          </Button>
        )}
      </div>
    </div>
  );
}
{{ ... }}
