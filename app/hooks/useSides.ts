import { useToast } from '@/components/ui/use-toast';
import { useEffect, useState } from 'react';
import { sideService } from '../services/sideService';
import { Side } from '../types/menu.types';

export function useSides() {
  const [sides, setSides] = useState<Side[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadSides = async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedSides = await sideService.getSides();
      setSides(loadedSides);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load sides';
      setError(message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  const addSide = async (newSide: Omit<Side, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      await sideService.addSide(newSide);
      await loadSides();
      toast({
        title: 'Success',
        description: 'Side added successfully',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add side';
      setError(message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSide = async (id: string, updates: Partial<Side>) => {
    try {
      setLoading(true);
      setError(null);
      await sideService.updateSide(id, updates);
      await loadSides();
      toast({
        title: 'Success',
        description: 'Side updated successfully',
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to update side';
      setError(message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteSide = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await sideService.deleteSide(id);
      await loadSides();
      toast({
        title: 'Success',
        description: 'Side deleted successfully',
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete side';
      setError(message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSides();
  }, []);

  return {
    sides,
    loading,
    error,
    addSide,
    updateSide,
    deleteSide,
    refreshSides: loadSides,
  };
}
