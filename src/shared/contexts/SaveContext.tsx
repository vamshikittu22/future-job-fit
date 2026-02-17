import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/shared/hooks/use-toast';
import { ResumeData } from '@/shared/lib/initialData';

interface SavedResume {
  id: string;
  name: string;
  data: ResumeData;
  template: string;
  sectionOrder: string[];
  updatedAt: string;
  isAutoSave?: boolean;
}

interface SaveContextType {
  savedResumes: SavedResume[];
  currentSlot: string | null;
  isSaving: boolean;
  lastSaved: Date | null;
  saveResume: (name?: string) => Promise<void>;
  loadResume: (id: string) => void;
  deleteResume: (id: string) => void;
  renameResume: (id: string, newName: string) => void;
  createNewResume: () => void;
  duplicateResume: (id: string, newName: string) => void;
}

const SaveContext = createContext<SaveContextType | undefined>(undefined);

const STORAGE_KEY = 'resume_builder_saves';
const MAX_SLOTS = 10;
const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

export const SaveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [currentSlot, setCurrentSlot] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();

  // Load saved resumes on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSavedResumes(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Failed to load saved resumes:', error);
    }
  }, []);

  // Auto-save current resume if there's a current slot
  useEffect(() => {
    if (!currentSlot) return;
    
    const autoSave = () => {
      const resume = savedResumes.find(r => r.id === currentSlot);
      if (resume?.isAutoSave) {
        saveResume();
      }
    };

    const interval = setInterval(autoSave, AUTO_SAVE_INTERVAL);
    return () => clearInterval(interval);
  }, [currentSlot, savedResumes]);

  // Save to localStorage whenever savedResumes changes
  useEffect(() => {
    if (savedResumes.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedResumes));
      } catch (error) {
        console.error('Failed to save resumes to localStorage:', error);
      }
    }
  }, [savedResumes]);

  const saveResume = useCallback(async (name?: string) => {
    setIsSaving(true);
    try {
      // This will be implemented in the ResumeBuilder component
      // to get the current resume data
      const saveData = (window as any).__getCurrentResumeData?.();
      if (!saveData) return;

      const { resumeData, template, sectionOrder } = saveData;
      const now = new Date();
      
      setSavedResumes(prev => {
        const existingIndex = prev.findIndex(r => r.id === currentSlot);
        const newResume = {
          id: currentSlot || Date.now().toString(),
          name: name || `Resume ${prev.length + 1}`,
          data: resumeData,
          template,
          sectionOrder,
          updatedAt: now.toISOString(),
          isAutoSave: !name // If no name is provided, it's an auto-save
        };

        if (existingIndex >= 0) {
          // Update existing
          const updated = [...prev];
          updated[existingIndex] = { ...newResume, name: name || prev[existingIndex].name };
          return updated;
        } else if (prev.length < MAX_SLOTS) {
          // Add new if we have space
          return [...prev, newResume];
        } else {
          // Replace the oldest auto-save if we're at max capacity
          const oldestAutoSaveIndex = prev.findIndex(r => r.isAutoSave);
          if (oldestAutoSaveIndex >= 0) {
            const updated = [...prev];
            updated[oldestAutoSaveIndex] = newResume;
            return updated;
          }
          // If no auto-saves to replace, don't save
          toast({
            title: 'Save limit reached',
            description: `You've reached the maximum number of save slots (${MAX_SLOTS}). Please delete an existing save to create a new one.`,
            variant: 'destructive',
          });
          return prev;
        }
      });

      if (!currentSlot) {
        setCurrentSlot(now.getTime().toString());
      }
      
      setLastSaved(now);
      
      if (name) {
        toast({
          title: 'Resume saved',
          description: `"${name}" has been saved successfully.`,
        });
      }
    } catch (error) {
      console.error('Failed to save resume:', error);
      toast({
        title: 'Save failed',
        description: 'There was an error saving your resume. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  }, [currentSlot, toast]);

  const loadResume = useCallback((id: string) => {
    const resume = savedResumes.find(r => r.id === id);
    if (resume) {
      // This will be implemented in the ResumeBuilder component
      (window as any).__loadResumeData?.(resume);
      setCurrentSlot(id);
      toast({
        title: 'Resume loaded',
        description: `"${resume.name}" has been loaded.`,
      });
    }
  }, [savedResumes, toast]);

  const deleteResume = useCallback((id: string) => {
    setSavedResumes(prev => {
      const updated = prev.filter(r => r.id !== id);
      if (currentSlot === id) {
        setCurrentSlot(updated[0]?.id || null);
      }
      return updated;
    });
  }, [currentSlot]);

  const renameResume = useCallback((id: string, newName: string) => {
    if (!newName.trim()) return;
    
    setSavedResumes(prev =>
      prev.map(resume =>
        resume.id === id ? { ...resume, name: newName } : resume
      )
    );
  }, []);

  const createNewResume = useCallback(() => {
    const newId = Date.now().toString();
    const newResume: SavedResume = {
      id: newId,
      name: `Resume ${savedResumes.length + 1}`,
      data: { personal: { name: '', email: '', phone: '', location: '' }, summary: '', experience: [], education: [], skills: { languages: [], frameworks: [], tools: [] }, projects: [], achievements: [], certifications: [], customSections: [] },
      template: 'minimal',
      sectionOrder: ['personal', 'summary', 'skills', 'experience', 'education', 'projects', 'achievements', 'certifications'],
      updatedAt: new Date().toISOString(),
      isAutoSave: false
    };

    if (savedResumes.length < MAX_SLOTS) {
      setSavedResumes(prev => [...prev, newResume]);
      setCurrentSlot(newId);
      // This will be implemented in the ResumeBuilder component
      (window as any).__loadResumeData?.(newResume);
    } else {
      toast({
        title: 'Save limit reached',
        description: `You've reached the maximum number of save slots (${MAX_SLOTS}). Please delete an existing save to create a new one.`,
        variant: 'destructive',
      });
    }
  }, [savedResumes.length, toast]);

  const duplicateResume = useCallback((id: string, newName: string) => {
    if (savedResumes.length >= MAX_SLOTS) {
      toast({
        title: 'Save limit reached',
        description: `You've reached the maximum number of save slots (${MAX_SLOTS}). Please delete an existing save to create a new one.`,
        variant: 'destructive',
      });
      return;
    }

    const original = savedResumes.find(r => r.id === id);
    if (!original) return;

    const newResume: SavedResume = {
      ...original,
      id: Date.now().toString(),
      name: newName,
      updatedAt: new Date().toISOString(),
      isAutoSave: false
    };

    setSavedResumes(prev => [...prev, newResume]);
    setCurrentSlot(newResume.id);
    // This will be implemented in the ResumeBuilder component
    (window as any).__loadResumeData?.(newResume);
  }, [savedResumes, toast]);

  return (
    <SaveContext.Provider
      value={{
        savedResumes,
        currentSlot,
        isSaving,
        lastSaved,
        saveResume,
        loadResume,
        deleteResume,
        renameResume,
        createNewResume,
        duplicateResume,
      }}
    >
      {children}
    </SaveContext.Provider>
  );
};

export const useSave = () => {
  const context = useContext(SaveContext);
  if (context === undefined) {
    throw new Error('useSave must be used within a SaveProvider');
  }
  return context;
};
