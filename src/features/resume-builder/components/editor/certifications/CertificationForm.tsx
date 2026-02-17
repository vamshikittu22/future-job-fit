import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Button } from "@/shared/ui/button";
import { ResumeData } from "@/shared/lib/initialData";

type Certification = ResumeData['certifications'][0];

interface CertificationFormProps {
  certification: Partial<Certification>;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: keyof Certification, value: any) => void;
  onCancel: () => void;
  isEditing: boolean;
}

export const CertificationForm = ({
  certification,
  onSubmit,
  onChange,
  onCancel,
  isEditing,
}: CertificationFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Certification Name *</Label>
          <Input
            id="name"
            name="name"
            value={certification.name || ''}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="e.g. AWS Certified Solutions Architect"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="issuer">Issuing Organization *</Label>
          <Input
            id="issuer"
            name="issuer"
            value={certification.issuer || ''}
            onChange={(e) => onChange('issuer', e.target.value)}
            placeholder="e.g. Amazon Web Services"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date Obtained</Label>
            <Input
              id="date"
              name="date"
              type="month"
              value={certification.date || ''}
              onChange={(e) => onChange('date', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date (if applicable)</Label>
            <Input
              id="expiryDate"
              name="expiryDate"
              type="month"
              value={certification.expiryDate || ''}
              onChange={(e) => onChange('expiryDate', e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="credentialId">Credential ID (if applicable)</Label>
          <Input
            id="credentialId"
            name="credentialId"
            value={certification.credentialId || ''}
            onChange={(e) => onChange('credentialId', e.target.value)}
            placeholder="e.g. ABC123456789"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="credentialUrl">Credential URL (if available)</Label>
          <Input
            id="credentialUrl"
            name="credentialUrl"
            type="url"
            value={certification.credentialUrl || ''}
            onChange={(e) => onChange('credentialUrl', e.target.value)}
            placeholder="https://example.com/verify/ABC123"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? 'Update Certification' : 'Add Certification'}
        </Button>
      </div>
    </form>
  );
};

export default CertificationForm;
