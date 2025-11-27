// src/components/Toast.jsx
import React from 'react';
import { useAppContext } from '../context/AppContext';

const Toast = () => {
  const { toast } = useAppContext();

  if (!toast.show) return null;

  const variantStyles = {
    success: 'border-green-200 bg-green-50',
    error: 'border-red-200 bg-red-50',
    warning: 'border-yellow-200 bg-yellow-50',
    info: 'border-blue-200 bg-blue-50'
  };

  const icons = {
    success: 'fas fa-check-circle text-success',
    error: 'fas fa-times-circle text-error',
    warning: 'fas fa-exclamation-circle text-warning',
    info: 'fas fa-info-circle text-blue-500'
  };

  return (
    <div className="fixed top-20 left-1/2 z-40 w-full max-w-xl -translate-x-1/2 px-4">
      <div className={`flex items-center gap-3 rounded-2xl border shadow-xl px-5 py-3 backdrop-blur transition-colors dark:bg-slate-900/90 dark:text-white ${variantStyles[toast.type]}`}>
        <i className={`text-xl ${icons[toast.type]}`}></i>
        <span className="text-sm text-text-dark dark:text-white">{toast.message}</span>
      </div>
    </div>
  );
};

export default Toast;