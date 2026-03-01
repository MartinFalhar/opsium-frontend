import { useState, useCallback } from "react";
import { apiCall } from "../utils/api";

/**
 * Custom hook pro získání obruby podle PLU kódu
 * @returns {Object} - { frame, loading, error, getPluFrame }
 */

export function useStoreGetPluFrame() {
  const [frame, setFrame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getPluFrame = useCallback(async (plu, payload = null) => {
    if (!plu || plu.trim() === "") {
      setFrame(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const requestBody = {
        plu: plu.trim(),
        ...(payload || {}),
      };

      const data = await apiCall("/store/plu-frame", "POST", requestBody);

      if (data.success) {
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
