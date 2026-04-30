'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colors = {
  success: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400',
  error: 'bg-red-500/20 border-red-500/30 text-red-400',
  info: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
  warning: 'bg-amber-500/20 border-amber-500/30 text-amber-400',
};

let toastListeners: ((toast: Toast) => void)[] = [];
let toasts: Toast[] = [];

export const toast = {
  success: (message: string, duration = 3000) => {
    const id = Date.now().toString();
    const newToast: Toast = { id, type: 'success', message, duration };
    toasts.push(newToast);
    toastListeners.forEach(listener => listener(newToast));
    setTimeout(() => toast.remove(id), duration);
  },
  error: (message: string, duration = 4000) => {
    const id = Date.now().toString();
    const newToast: Toast = { id, type: 'error', message, duration };
    toasts.push(newToast);
    toastListeners.forEach(listener => listener(newToast));
    setTimeout(() => toast.remove(id), duration);
  },
  info: (message: string, duration = 3000) => {
    const id = Date.now().toString();
    const newToast: Toast = { id, type: 'info', message, duration };
    toasts.push(newToast);
    toastListeners.forEach(listener => listener(newToast));
    setTimeout(() => toast.remove(id), duration);
  },
  warning: (message: string, duration = 3000) => {
    const id = Date.now().toString();
    const newToast: Toast = { id, type: 'warning', message, duration };
    toasts.push(newToast);
    toastListeners.forEach(listener => listener(newToast));
    setTimeout(() => toast.remove(id), duration);
  },
  remove: (id: string) => {
    toasts = toasts.filter(t => t.id !== id);
    toastListeners.forEach(listener => listener({ id, type: 'info', message: '' }));
  },
};

export default function ToastContainer() {
  const [toastList, setToastList] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (toast: Toast) => {
      setToastList(prev => {
        const exists = prev.find(t => t.id === toast.id);
        if (exists && toast.message === '') {
          return prev.filter(t => t.id !== toast.id);
        }
        if (!exists && toast.message) {
          return [...prev, toast];
        }
        return prev;
      });
    };
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter(l => l !== listener);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toastList.map((item) => {
          const Icon = icons[item.type];
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-xl backdrop-blur-xl ${colors[item.type]}`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <p className="text-sm font-medium">{item.message}</p>
              <button
                onClick={() => toast.remove(item.id)}
                className="ml-2 shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
