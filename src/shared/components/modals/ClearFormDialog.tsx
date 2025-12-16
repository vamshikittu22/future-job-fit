import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ClearFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveAndClear: () => void;
  onClearWithoutSaving: () => void;
}

export default function ClearFormDialog({
  open,
  onOpenChange,
  onSaveAndClear,
  onClearWithoutSaving,
}: ClearFormDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear Resume Form</AlertDialogTitle>
          <AlertDialogDescription>
            Unsaved data will be lost. Would you like to save a copy before clearing?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onClearWithoutSaving}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Clear Without Saving
          </AlertDialogAction>
          <AlertDialogAction onClick={onSaveAndClear}>
            Save & Clear
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
