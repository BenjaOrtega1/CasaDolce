import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AlertTriangle, CheckCircle2, X } from "lucide-react";
import { Button } from "./ui/button";

type DialogKind = "alert" | "confirm";
type DialogTone = "default" | "danger" | "success";

interface DialogOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: DialogTone;
}

interface DialogState extends DialogOptions {
  kind: DialogKind;
}

interface AppDialogContextValue {
  alert: (options: DialogOptions | string) => Promise<void>;
  confirm: (options: DialogOptions | string) => Promise<boolean>;
}

const AppDialogContext = createContext<AppDialogContextValue | null>(null);

function toOptions(options: DialogOptions | string): DialogOptions {
  return typeof options === "string" ? { title: options } : options;
}

export function AppDialogProvider({ children }: { children: ReactNode }) {
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const openDialog = useCallback((kind: DialogKind, options: DialogOptions | string) => {
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
      setDialog({ ...toOptions(options), kind });
    });
  }, []);

  const closeDialog = useCallback((value: boolean) => {
    resolverRef.current?.(value);
    resolverRef.current = null;
    setDialog(null);
  }, []);

  const value: AppDialogContextValue = {
    alert: async (options) => {
      await openDialog("alert", options);
    },
    confirm: (options) => openDialog("confirm", options),
  };

  const tone = dialog?.tone ?? "default";
  const isConfirm = dialog?.kind === "confirm";
  const confirmLabel = dialog?.confirmLabel ?? (tone === "danger" ? "Eliminar" : "Aceptar");
  const cancelLabel = dialog?.cancelLabel ?? "Cancelar";
  const Icon = tone === "success" ? CheckCircle2 : AlertTriangle;

  return (
    <AppDialogContext.Provider value={value}>
      {children}
      <DialogPrimitive.Root open={Boolean(dialog)} onOpenChange={(open) => !open && closeDialog(false)}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="app-dialog__overlay" />
          <DialogPrimitive.Content className={`app-dialog app-dialog--${tone}`}>
            <div className="app-dialog__brand">
              <img src="/logocasadolce-icon.webp" alt="" aria-hidden="true" />
              <span>Casa Dolce</span>
            </div>

            <button type="button" className="app-dialog__close" onClick={() => closeDialog(false)} aria-label="Cerrar">
              <X className="size-4" aria-hidden="true" />
            </button>

            <div className="app-dialog__icon" aria-hidden="true">
              <Icon className="size-5" />
            </div>

            <DialogPrimitive.Title className="app-dialog__title">{dialog?.title}</DialogPrimitive.Title>
            {dialog?.description && (
              <DialogPrimitive.Description className="app-dialog__description">
                {dialog.description}
              </DialogPrimitive.Description>
            )}

            <div className="app-dialog__actions">
              {isConfirm && (
                <Button type="button" variant="outline" className="btn-secondary" onClick={() => closeDialog(false)}>
                  {cancelLabel}
                </Button>
              )}
              <Button
                type="button"
                className={tone === "danger" ? "app-dialog__danger-action" : "btn-primary"}
                onClick={() => closeDialog(true)}
              >
                {confirmLabel}
              </Button>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </AppDialogContext.Provider>
  );
}

export function useAppDialog() {
  const context = useContext(AppDialogContext);
  if (!context) throw new Error("useAppDialog must be used within AppDialogProvider");
  return context;
}
