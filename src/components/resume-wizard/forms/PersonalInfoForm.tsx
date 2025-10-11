import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PersonalInfo } from '../types';

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
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={data.name}
            onChange={handleChange('name')}
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={handleChange('email')}
            placeholder="john@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={data.phone}
            onChange={handleChange('phone')}
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={data.location}
            onChange={handleChange('location')}
            placeholder="City, Country"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website (optional)</Label>
          <Input
            id="website"
            value={data.website || ''}
            onChange={handleChange('website')}
            placeholder="https://yourwebsite.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn (optional)</Label>
          <Input
            id="linkedin"
            value={data.linkedin || ''}
            onChange={handleChange('linkedin')}
            placeholder="https://linkedin.com/in/username"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="github">GitHub (optional)</Label>
          <Input
            id="github"
            value={data.github || ''}
            onChange={handleChange('github')}
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
          placeholder="A passionate software engineer with X years of experience..."
          className="min-h-[120px]"
        />
      </div>
    </div>
  );
};
