import { useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import { X, Plus, Trash2, ExternalLink, Calendar } from 'lucide-react';
import { Certification } from '@/features/resume-builder/components/editor/types';

interface CertificationsFormProps {
  certifications: Certification[];
  onChange: (certifications: Certification[]) => void;
}

export const CertificationsForm = ({
  certifications,
  onChange,
}: CertificationsFormProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Certification>>({
    id: '',
    name: '',
    issuer: '',
    date: '',
    credentialUrl: '',
    description: '',
  });

  const handleAddCertification = () => {
    if (!formData.name || !formData.issuer || !formData.date) return;

    const certification: Certification = {
      id: editingId || `cert-${Date.now()}`,
      name: formData.name || '',
      issuer: formData.issuer || '',
      date: formData.date || '',
      credentialUrl: formData.credentialUrl || '',
      description: formData.description || '',
    };

    if (editingId) {
      onChange(
        certifications.map((c) => (c.id === editingId ? certification : c))
      );
    } else {
      onChange([...certifications, certification]);
    }

    resetForm();
  };

  const handleEdit = (cert: Certification) => {
    setFormData({
      id: cert.id,
      name: cert.name,
      issuer: cert.issuer,
      date: cert.date,
      credentialUrl: cert.credentialUrl,
      description: cert.description,
    });
    setEditingId(cert.id);
  };

  const handleDelete = (id: string) => {
    onChange(certifications.filter((cert) => cert.id !== id));
    if (editingId === id) {
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      issuer: '',
      date: '',
      credentialUrl: '',
      description: '',
    });
    setEditingId(null);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6 p-4 border rounded-lg bg-card">
        <h3 className="text-lg font-medium">
          {editingId ? 'Edit Certification' : 'Add New Certification'}
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="certName">Certification Name *</Label>
              <Input
                id="certName"
                value={formData.name || ''}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., AWS Certified Solutions Architect"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issuer">Issuing Organization *</Label>
              <Input
                id="issuer"
                value={formData.issuer || ''}
                onChange={(e) =>
                  setFormData({ ...formData, issuer: e.target.value })
                }
                placeholder="e.g., Amazon Web Services"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date Issued *</Label>
              <div className="relative">
                <Input
                  id="date"
                  type="month"
                  value={formData.date || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="pl-10"
                />
                <Calendar className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="credentialUrl">Credential URL (optional)</Label>
              <div className="relative">
                <Input
                  id="credentialUrl"
                  type="url"
                  value={formData.credentialUrl || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, credentialUrl: e.target.value })
                  }
                  placeholder="https://example.com/certificate/123"
                  className="pl-10"
                />
                <ExternalLink className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Any additional details about this certification"
              className="min-h-[80px]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          {editingId && (
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
            >
              Cancel
            </Button>
          )}
          <Button
            type="button"
            onClick={handleAddCertification}
            disabled={!formData.name || !formData.issuer || !formData.date}
          >
            {editingId ? 'Update Certification' : 'Add Certification'}
          </Button>
        </div>
      </div>

      {certifications.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Your Certifications</h3>
          <div className="space-y-4">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="group relative p-4 border rounded-lg hover:bg-accent/20 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{cert.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {cert.issuer}
                      {cert.date && ` • ${formatDate(cert.date)}`}
                    </p>
                    {cert.description && (
                      <p className="mt-2 text-sm">{cert.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-primary hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                      </a>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(cert)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        <path d="m13.5 6.5 4 4" />
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive/90"
                      onClick={() => handleDelete(cert.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
