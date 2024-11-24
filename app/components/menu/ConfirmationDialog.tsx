'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export type ConfirmationDialogProps = {
  isOpen: boolean;
  onCloseAction: () => void;
  onConfirmAction: () => Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'default';
};

export const ConfirmationDialog = ({
  isOpen,
  onCloseAction,
  onConfirmAction,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
}: ConfirmationDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirmAction();
      onCloseAction();
    } catch (error) {
      console.error('Confirmation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[#2A4E45]/70">{description}</p>
          <div className="flex justify-end gap-4 mt-6">
            <Button
              variant="outline"
              onClick={onCloseAction}
              disabled={isLoading}
              className="border-[#2A4E45] text-[#2A4E45] hover:bg-[#2A4E45] hover:text-[#F5E6D3]"
            >
              {cancelText}
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isLoading}
              className={cn(
                'text-white',
                variant === 'destructive'
                  ? 'bg-[#D64C37] hover:bg-[#D64C37]/90'
                  : 'bg-[#2A4E45] hover:bg-[#2A4E45]/90'
              )}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {confirmText}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
