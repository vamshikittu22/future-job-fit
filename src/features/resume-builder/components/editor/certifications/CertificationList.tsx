import { BadgeCheck, Pencil, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumeData } from "@/lib/initialData";

type Certification = ResumeData['certifications'][0];

interface CertificationListProps {
  certifications: Certification[];
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
}

export const CertificationList = ({
  certifications,
  onEdit,
  onRemove,
}: CertificationListProps) => {
  if (certifications.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <BadgeCheck className="mx-auto h-12 w-12 mb-2 opacity-20" />
        <p>No certifications added yet.</p>
        <p className="text-sm">Click the button above to add your first certification.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {certifications.map((cert, index) => (
        <div key={cert.id} className="border rounded-lg p-4 relative group">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{cert.name}</h3>
                {cert.credentialUrl && (
                  <a 
                    href={cert.credentialUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{cert.issuer}</p>
              
              <div className="mt-2 space-y-1">
                {cert.credentialId && (
                  <p className="text-xs text-muted-foreground">
                    Credential ID: {cert.credentialId}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {cert.date && (
                    <span>
                      Issued: {new Date(cert.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                      })}
                      {cert.expiryDate ? ' • ' : ''}
                    </span>
                  )}
                  {cert.expiryDate && (
                    <span>
                      Expires: {new Date(cert.expiryDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(index)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CertificationList;
