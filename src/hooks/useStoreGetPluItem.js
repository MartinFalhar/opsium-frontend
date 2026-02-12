import { useState, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Custom hook pro získání položky podle PLU kódu
 * @returns {Object} - { item, loading, error, getPluItem }
 */

export function useStoreGetPluItem() {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getPluItem = useCallback(async (plu) => {
    if (!plu || plu.trim() === "") {
      setItem(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/store/plu-item?plu=${plu}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setItem(data.item);
        setError(null);
      } else {
        const errorMsg = data.message || "Položka nebyla nalezena.";
        setError(errorMsg);
        setItem(null);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Chyba při komunikaci se serverem.");
      setItem(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { item, loading, error, getPluItem };
}
