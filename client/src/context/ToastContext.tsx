import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

type ToastVariant = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

let toastCounter = 0;

const variantStyles: Record<ToastVariant, { icon: typeof CheckCircle2; classes: string }> = {
  success: { icon: CheckCircle2, classes: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200" },
  error: { icon: XCircle, classes: "border-rose-400/30 bg-rose-500/10 text-rose-200" },
  info: { icon: Info, classes: "border-sky-400/30 bg-sky-500/10 text-sky-200" },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, variant: ToastVariant = "info") => {
    const id = ++toastCounter;
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 sm:bottom-6 sm:right-6" role="status" aria-live="polite">
        <AnimatePresence>
          {toasts.map((toast) => {
            const { icon: Icon, classes } = variantStyles[toast.variant];
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`glass-panel flex max-w-sm items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-card ${classes}`}
              >
                <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                <p className="flex-1">{toast.message}</p>
                <button
                  onClick={() => dismiss(toast.id)}
                  aria-label="Dismiss notification"
                  className="text-slate-400 hover:text-slate-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
