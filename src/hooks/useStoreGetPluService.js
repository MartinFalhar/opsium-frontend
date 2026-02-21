import { useState, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Custom hook pro získání služby podle PLU kódu
 * @returns {Object} - { service, loading, error, getPluService }
 */

export function useStoreGetPluService() {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getPluService = useCallback(async (plu, payload = null) => {
    if (!plu || plu.trim() === "") {
      setService(null);
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const requestBody = {
        plu: plu.trim(),
        ...(payload || {}),
      };

      const res = await fetch(`${API_URL}/store/plu-service`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setService(data.service);
        setError(null);
        return data.service;
      } else {
        const errorMsg = data.message || "Služba nebyla nalezena.";
        setError(errorMsg);
        setService(null);
        return null;
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Chyba při komunikaci se serverem.");
      setService(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { service, loading, error, getPluService };
}
