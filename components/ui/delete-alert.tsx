'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export function DeleteAlert({
  open,
  onOpenChange,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
}: DeleteAlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="border-2 border-[#2C5530] bg-[#F5F5F5]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-serif text-[#2C5530]">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[#2C5530]/80">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-[#2C5530] text-[#2C5530] hover:bg-[#2C5530]/5">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-[#2C5530] text-white hover:bg-[#2C5530]/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
