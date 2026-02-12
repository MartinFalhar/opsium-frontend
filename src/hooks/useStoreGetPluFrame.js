import { useState, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Custom hook pro získání obruby podle PLU kódu
 * @returns {Object} - { frame, loading, error, getPluFrame }
 */

export function useStoreGetPluFrame() {
  const [frame, setFrame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getPluFrame = useCallback(async (plu) => {
    if (!plu || plu.trim() === "") {
      setFrame(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/store/plu-frame?plu=${plu}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFrame(data.frame);
        setError(null);
        return data.frame;
      } else {
        const errorMsg = data.message || "Obruba nebyla nalezena.";
        setError(errorMsg);
        setFrame(null);
        return null;
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Chyba při komunikaci se serverem.");
      setFrame(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { frame, loading, error, getPluFrame };
}
