import { useState, useCallback } from "react";
import { ToastContainer, Toast, Button } from "react-bootstrap";
import { NotificationContext } from "./notification-context.js";

const VARIANT_ICONS = {
  success: "bi-check-circle-fill",
  danger: "bi-exclamation-circle-fill",
  warning: "bi-exclamation-triangle-fill",
  secondary: "bi-info-circle-fill",
  primary: "bi-bell-fill",
};

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(
    (message, { variant = "success", action, delay = 4000 } = {}) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, message, variant, action, delay }]);
    },
    []
  );

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <ToastContainer
        position="bottom-end"
        containerPosition="fixed"
        className="p-3 no-print"
        style={{ zIndex: 1080 }}
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            bg={toast.variant}
            onClose={() => dismiss(toast.id)}
            delay={toast.delay}
            autohide
          >
            <Toast.Body
              className={`d-flex align-items-center justify-content-between gap-3 ${
                toast.variant === "light" ? "" : "text-white"
              }`}
            >
              <span className="d-flex align-items-center gap-2">
                <i className={`bi ${VARIANT_ICONS[toast.variant] ?? "bi-info-circle-fill"}`} />
                {toast.message}
              </span>
              {toast.action && (
                <Button
                  size="sm"
                  variant={toast.variant === "light" ? "outline-secondary" : "light"}
                  onClick={() => {
                    toast.action.onClick();
                    dismiss(toast.id);
                  }}
                >
                  {toast.action.label}
                </Button>
              )}
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </NotificationContext.Provider>
  );
};
