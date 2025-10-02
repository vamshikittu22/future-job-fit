import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CreateResumeModal from '@/components/CreateResumeModal';

const NewResumePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      // Navigate back when modal is closed if needed
      // navigate(-1);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-3xl font-bold mb-6">Create a New Resume</h1>
        <p className="text-muted-foreground mb-8">
          Get started by creating a new resume from scratch, using a sample, or importing an existing one.
        </p>
        
        <Button 
          onClick={() => setIsModalOpen(true)}
          size="lg"
          className="gap-2"
        >
          <Plus className="w-5 h-5" />
          Create New Resume
        </Button>
      </div>

      <CreateResumeModal 
        open={isModalOpen} 
        onOpenChange={handleOpenChange} 
      />
    </div>
  );
};

export default NewResumePage;
