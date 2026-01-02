import { useState, useCallback } from 'react';

export function useToast() {
  const [toast, setToast] = useState({ open: false, message: '', tone: 'info' });
  const showToast = useCallback((message, tone = 'info') => {
    setToast({ open: true, message, tone });
  }, []);
  const closeToast = useCallback(() => setToast(t => ({ ...t, open: false })), []);
  return { toast, showToast, closeToast };
}