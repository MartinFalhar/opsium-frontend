import React, { useEffect, useState } from "react";
import "./Toast.css";

export default function Toast({ message, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Po 1 sekundě spustit animaci zmizení
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    // Po dokončení animace zmizení (0.5s) zavolat onClose
    const closeTimer = setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 3500);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  return (
    <div className={`toast ${isVisible ? 'toast-enter' : 'toast-exit'}`}>
      <div className="toast-message">{message}</div>
    </div>
  );
}
