// src/hooks/use-auth-page-animation.ts
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface UseAuthPageAnimationProps {
  loadingDuration?: number;
}

export function useAuthPageAnimation({
  loadingDuration = 1500,
}: UseAuthPageAnimationProps = {}) {
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const errorMessage = 'Credenciales inválidas. Por favor, inténtalo de nuevo.';

  useEffect(() => {
    try {
      const timer = setTimeout(() => {
        setLoading(false);
        setTimeout(() => setShowForm(true), 50);
      }, loadingDuration);

      return () => clearTimeout(timer);
    } catch (error) {
      toast.error(errorMessage);
      console.error('Error in useAuthPageAnimation:', error);
    }
  }, [loadingDuration]);

  return {
    loading,
    showForm,
    setShowForm,
  };
}
