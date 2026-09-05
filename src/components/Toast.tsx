import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info';
  title?: string;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`glass pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-3 duration-200 ${
            toast.type === 'success'
              ? 'border-teal-500/40 text-teal-100 bg-teal-950/40'
              : toast.type === 'warning'
              ? 'border-amber-500/40 text-amber-100 bg-amber-950/40'
              : 'border-teal-500/40 text-slate-100 bg-slate-900/60'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />}
          {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />}

          <div className="flex-1">
            {toast.title && <h4 className="text-xs font-bold leading-tight">{toast.title}</h4>}
            <p className="text-xs font-medium leading-relaxed mt-0.5">{toast.message}</p>
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
