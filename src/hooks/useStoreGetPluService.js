import { useState, useCallback } from "react";
import { apiCall } from "../utils/api";

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

      const data = await apiCall("/store/plu-service", "POST", requestBody);

      if (data.success) {
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
