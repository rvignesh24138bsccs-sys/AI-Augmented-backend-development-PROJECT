import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  const colors = {
    success: { bg: "rgba(0,212,170,0.15)", border: "rgba(0,212,170,0.4)", color: "#00d4aa", icon: "✅" },
    error: { bg: "rgba(233,69,96,0.15)", border: "rgba(233,69,96,0.4)", color: "#e94560", icon: "❌" },
    info: { bg: "rgba(79,142,247,0.15)", border: "rgba(79,142,247,0.4)", color: "#4f8ef7", icon: "ℹ️" },
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div style={{ position: "fixed", top: 80, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10, minWidth: 280, maxWidth: 360 }}>
        {toasts.map(t => {
          const c = colors[t.type] || colors.success;
          return (
            <div key={t.id} style={{
              background: c.bg, border: `1px solid ${c.border}`,
              borderRadius: 12, padding: "14px 16px",
              display: "flex", alignItems: "center", gap: 10,
              backdropFilter: "blur(12px)",
              animation: "slideInRight 0.3s ease",
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)"
            }}>
              <span style={{ fontSize: 18 }}>{c.icon}</span>
              <span style={{ color: "var(--text-primary)", fontSize: 14, fontWeight: 500, flex: 1 }}>{t.message}</span>
              <button onClick={() => removeToast(t.id)} style={{ background: "none", border: "none", color: c.color, cursor: "pointer", fontSize: 16, padding: "0 4px" }}>✕</button>
            </div>
          );
        })}
      </div>
      <style>{`@keyframes slideInRight { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }`}</style>
    </ToastContext.Provider>
  );
}
