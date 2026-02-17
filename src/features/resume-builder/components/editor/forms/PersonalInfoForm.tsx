import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import { PersonalInfo } from '@/features/resume-builder/components/editor/types';

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onChange: (data: Partial<PersonalInfo>) => void;
}

export const PersonalInfoForm = ({ data, onChange }: PersonalInfoFormProps) => {
  const handleChange = (field: keyof PersonalInfo) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange({ [field]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={data.name}
            onChange={handleChange('name')}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={handleChange('email')}
            placeholder="john@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={handleChange('phone')}
            placeholder="+1 (555) 123-4567"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={data.location}
            onChange={handleChange('location')}
            placeholder="San Francisco, CA"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="portfolioUrl">Portfolio URL (optional)</Label>
          <Input
            id="portfolioUrl"
            value={data.portfolioUrl || ''}
            onChange={handleChange('portfolioUrl')}
            placeholder="https://yourwebsite.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedinUrl">LinkedIn (optional)</Label>
          <Input
            id="linkedinUrl"
            value={data.linkedinUrl || ''}
            onChange={handleChange('linkedinUrl')}
            placeholder="https://linkedin.com/in/username"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="githubUrl">GitHub (optional)</Label>
          <Input
            id="githubUrl"
            value={data.githubUrl || ''}
            onChange={handleChange('githubUrl')}
            placeholder="https://github.com/username"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Professional Summary</Label>
        <Textarea
          id="summary"
          value={data.summary}
          onChange={handleChange('summary')}
          placeholder="Write a brief professional summary..."
          rows={4}
        />
      </div>
    </div>
  );
};
