import React, { createContext, useContext, useState, useCallback } from 'react';
type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  text: string;
  type: ToastType;
}

interface ToastContextType {
  show: (text: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback((text: string, type: ToastType = 'info') => {
    const id = Date.now() + Math.random();
    const toast: ToastItem = { id, text, type };
    
    setToasts(prev => [toast, ...prev]);
    
    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed top-4 right-4 flex flex-col gap-2 z-[9999]" aria-live="polite">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`min-w-[220px] max-w-[360px] p-[0.6rem_0.9rem] rounded-md shadow-lg cursor-pointer text-[0.95rem] text-white
              ${toast.type === 'success' ? 'bg-gradient-to-r from-[#2ecc71] to-[#27ae60]' :
                toast.type === 'error' ? 'bg-gradient-to-r from-[#e74c3c] to-[#c0392b]' :
                'bg-gradient-to-r from-[#3498db] to-[#2c82c9]'}`}
            onClick={() => dismiss(toast.id)}
          >
            {toast.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

/* eslint-disable react-refresh/only-export-components */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider;