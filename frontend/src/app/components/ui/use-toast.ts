import { create } from 'zustand';

type Toast = {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
};

type ToastStore = {
  toasts: Toast[];
  addToast: (toast: Toast) => void;
  removeToast: (id: string) => void;
};

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => set((state) => ({ toasts: [...state.toasts, toast] })),
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export const toast = (message: string, type: Toast['type'] = 'info') => {
  const id = Date.now().toString();
  useToast.getState().addToast({ id, message, type });

  // Optionally remove toast after timeout
  setTimeout(() => {
    useToast.getState().removeToast(id);
  }, 3000);
};
