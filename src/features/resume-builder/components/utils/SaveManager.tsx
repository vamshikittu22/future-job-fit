import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Save, Plus, Trash2, Copy, Edit, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useSave } from '@/contexts/SaveContext';

const SaveManager: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<string | null>(null);
  
  const { 
    savedResumes, 
    currentSlot, 
    isSaving: isContextSaving, 
    lastSaved, 
    saveResume, 
    loadResume, 
    deleteResume, 
    renameResume, 
    createNewResume, 
    duplicateResume 
  } = useSave();
  
  const { toast } = useToast();

  const handleSaveAs = async () => {
    if (!newName.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter a name for your resume.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      await saveResume(newName);
      setNewName('');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRename = async (id: string) => {
    if (!editName.trim()) {
      setEditingId(null);
      return;
    }

    renameResume(id, editName);
    setEditingId(null);
    setEditName('');
  };

  const handleDelete = (id: string) => {
    if (isConfirmingDelete === id) {
      deleteResume(id);
      setIsConfirmingDelete(null);
    } else {
      setIsConfirmingDelete(id);
      // Reset confirmation after 3 seconds
      setTimeout(() => setIsConfirmingDelete(null), 3000);
    }
  };

  const currentResume = savedResumes.find(r => r.id === currentSlot);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Save className="h-4 w-4" />
          <span>Save</span>
          {isContextSaving && (
            <span className="ml-1">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-500 animate-ping"></span>
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Manage Saves</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          <div className="space-y-4">
            {/* Current Save Status */}
            {currentResume && (
              <Card className="border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {currentResume.name}
                        {currentResume.isAutoSave && (
                          <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full">
                            Auto-save
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription className="text-blue-800 dark:text-blue-200">
                        {lastSaved ? (
                          <span className="flex items-center gap-1">
                            <CheckCircle className="h-3.5 w-3.5" />
                            Saved {formatDistanceToNow(new Date(currentResume.updatedAt), { addSuffix: true })}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <AlertCircle className="h-3.5 w-3.5" />
                            Not saved yet
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setEditName(currentResume.name);
                          setEditingId(currentResume.id);
                        }}
                      >
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        Rename
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => duplicateResume(currentResume.id, `${currentResume.name} (Copy)`)}
                      >
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        Duplicate
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )}

            {/* Save Slots */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">SAVED RESUMES</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-sm text-primary"
                  onClick={createNewResume}
                  disabled={savedResumes.length >= 10}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  New Resume
                </Button>
              </div>
              
              {savedResumes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No saved resumes yet.</p>
                  <p className="text-sm mt-1">Create your first resume to get started.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {savedResumes.map((resume) => (
                    <Card 
                      key={resume.id} 
                      className={`relative overflow-hidden ${resume.id === currentSlot ? 'border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20' : ''}`}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="pr-4">
                            {editingId === resume.id ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  className="h-8"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleRename(resume.id);
                                    if (e.key === 'Escape') setEditingId(null);
                                  }}
                                />
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleRename(resume.id)}
                                >
                                  Save
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => setEditingId(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <CardTitle className="text-base flex items-center gap-2">
                                {resume.name}
                                {resume.isAutoSave && (
                                  <span className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full">
                                    Auto-save
                                  </span>
                                )}
                              </CardTitle>
                            )}
                            <CardDescription className="text-xs flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDistanceToNow(new Date(resume.updatedAt), { addSuffix: true })}
                            </CardDescription>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {resume.id !== currentSlot && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8"
                                onClick={() => loadResume(resume.id)}
                              >
                                Load
                              </Button>
                            )}
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">More</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setEditName(resume.name);
                                    setEditingId(resume.id);
                                  }}
                                >
                                  <Edit className="h-3.5 w-3.5 mr-2" />
                                  Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => duplicateResume(resume.id, `${resume.name} (Copy)`)}
                                >
                                  <Copy className="h-3.5 w-3.5 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600 dark:text-red-400"
                                  onClick={() => handleDelete(resume.id)}
                                >
                                  <Trash2 className="h-3.5 w-3.5 mr-2" />
                                  {isConfirmingDelete === resume.id ? 'Confirm Delete' : 'Delete'}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Save As Form */}
        <div className="border-t pt-4 mt-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="save-name" className="sr-only">Save as</Label>
              <Input
                id="save-name"
                placeholder="Enter a name for this resume"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveAs()}
                disabled={isSaving}
              />
            </div>
            <Button 
              onClick={handleSaveAs} 
              disabled={!newName.trim() || isSaving}
            >
              {isSaving ? 'Saving...' : 'Save As'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {savedResumes.length}/10 slots used • Auto-save is enabled for the current resume
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SaveManager;
