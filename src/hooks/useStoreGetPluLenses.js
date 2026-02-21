import { useState, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Custom hook pro získání brýlových čoček podle PLU kódu
 * @returns {Object} - { lenses, loading, error, getPluLenses }
 */

export function useStoreGetPluLenses() {
  const [lenses, setLenses] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getPluLenses = useCallback(async (plu, payload = null) => {
    if (!plu || plu.trim() === "") {
      setLenses(null);
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const requestBody = {
        plu: plu.trim(),
        ...(payload || {}),
      };

      const res = await fetch(`${API_URL}/store/plu-lenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setLenses(data.lenses);
        setError(null);
        return data.lenses;
      } else {
        const errorMsg = data.message || "Brýlové čočky nebyly nalezeny.";
        setError(errorMsg);
        setLenses(null);
        return null;
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Chyba při komunikaci se serverem.");
      setLenses(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { lenses, loading, error, getPluLenses };
}
