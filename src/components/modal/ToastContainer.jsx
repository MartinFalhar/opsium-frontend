import React, { useState, useEffect } from "react";
import Toast from "./Toast";

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  // Funkce pro přidání nového toastu
  const addToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
  };

  // Funkce pro odebrání toastu
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Vystavení funkce addToast globálně
  useEffect(() => {
    window.showToast = addToast;
    return () => {
      delete window.showToast;
    };
  }, []);

  return (
    <div className="toast-container">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            position: "fixed",
            top: `${120 + index * 80}px`,
            right: "20px",
            zIndex: 10000 + index,
          }}
        >
          <Toast
            message={toast.message}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
}
