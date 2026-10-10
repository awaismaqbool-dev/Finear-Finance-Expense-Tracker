"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

type ToastKind = "success" | "error" | "info";
type ToastEntry = { id: number; kind: ToastKind; message: string };
type ToastApi = Record<ToastKind, (message: string) => void>;

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastEntry[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const show = useCallback((kind: ToastKind, message: string) => {
    const id = ++nextId.current;
    setItems((current) => [...current, { id, kind, message }]);
    timers.current.set(id, setTimeout(() => dismiss(id), 4200));
  }, [dismiss]);

  useEffect(() => () => {
    for (const timer of timers.current.values()) clearTimeout(timer);
    timers.current.clear();
  }, []);

  const api = useMemo<ToastApi>(() => ({
    success: (message) => show("success", message),
    error: (message) => show("error", message),
    info: (message) => show("info", message),
  }), [show]);

  return <ToastContext.Provider value={api}>
    {children}
    <div className="toast-stack" aria-live="polite" aria-relevant="additions text">
      {items.map((item) => {
        const Icon = item.kind === "success" ? CheckCircle2 : item.kind === "error" ? AlertCircle : Info;
        return <div className={`toast toast-${item.kind}`} key={item.id} role={item.kind === "error" ? "alert" : "status"}>
          <Icon size={19} aria-hidden="true" />
          <span>{item.message}</span>
          <button type="button" onClick={() => dismiss(item.id)} aria-label="Dismiss notification"><X size={16} /></button>
        </div>;
      })}
    </div>
  </ToastContext.Provider>;
}

export function useToast(): ToastApi {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider.");
  return context;
}
