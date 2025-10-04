import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Toast, ToastData } from './Toast';

interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none">
      <div className="flex flex-col space-y-3 max-h-screen overflow-hidden">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              toast={toast}
              onDismiss={onDismiss}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
