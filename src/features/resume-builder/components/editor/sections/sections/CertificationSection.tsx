import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Card } from "@/shared/ui/card";
import { Plus, X } from "lucide-react";

interface CertificationSectionProps {
    certifications: any[];
    updateResumeData: (section: string, data: any) => void;
}

export const CertificationSection = ({ certifications, updateResumeData }: CertificationSectionProps) => {
    const addCertification = () => {
        const newCert = {
            id: Date.now().toString(),
            name: "",
            issuer: "",
            date: "",
            link: ""
        };
        updateResumeData('certifications', [...(certifications || []), newCert]);
    };

    const updateCertification = (id: string, field: string, value: string) => {
        const updated = (certifications || []).map((cert: any) =>
            cert.id === id ? { ...cert, [field]: value } : cert
        );
        updateResumeData('certifications', updated);
    };

    const removeCertification = (id: string) => {
        updateResumeData('certifications', (certifications || []).filter((cert: any) => cert.id !== id));
    };

    return (
        <div className="space-y-6">
            <Button
                type="button"
                variant="outline"
                onClick={addCertification}
                className="w-full"
            >
                <Plus className="w-4 h-4 mr-2" />
                Add Certification
            </Button>

            {(certifications || []).map((cert: any, index: number) => (
                <Card key={cert.id} className="p-4">
                    <div className="space-y-4">
                        <div className="flex justify-between items-start">
                            <h4 className="font-medium">Certification {index + 1}</h4>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeCertification(cert.id)}
                                className="text-destructive hover:text-destructive"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor={`cert-name-${cert.id}`}>Certification Name *</Label>
                                <Input
                                    id={`cert-name-${cert.id}`}
                                    placeholder="AWS Certified Developer"
                                    value={cert.name || ''}
                                    onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor={`cert-issuer-${cert.id}`}>Issuing Organization *</Label>
                                <Input
                                    id={`cert-issuer-${cert.id}`}
                                    placeholder="Amazon Web Services"
                                    value={cert.issuer || ''}
                                    onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor={`cert-date-${cert.id}`}>Date Obtained</Label>
                                <Input
                                    id={`cert-date-${cert.id}`}
                                    placeholder="March 2023"
                                    value={cert.date || ''}
                                    onChange={(e) => updateCertification(cert.id, 'date', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor={`cert-link-${cert.id}`}>Credential Link (Optional)</Label>
                                <Input
                                    id={`cert-link-${cert.id}`}
                                    placeholder="https://credential-url.com"
                                    value={cert.link || ''}
                                    onChange={(e) => updateCertification(cert.id, 'link', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};
