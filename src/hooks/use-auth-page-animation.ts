// src/hooks/use-auth-page-animation.ts
import { useState, useEffect } from 'react';

interface UseAuthPageAnimationProps {
  loadingDuration?: number;
}

export function useAuthPageAnimation({
  loadingDuration = 2000,
}: UseAuthPageAnimationProps = {}) {
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setShowForm(true), 50);
    }, loadingDuration);

    return () => clearTimeout(timer);
  }, [loadingDuration]);

  return {
    loading,
    showForm,
    setShowForm,
  };
}
