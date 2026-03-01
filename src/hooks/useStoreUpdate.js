import { useState, useCallback } from "react";
import { apiCall } from "../utils/api";

/**
 * Custom hook pro aktualizaci položky ve skladu
 * @param {number} storeId - ID skladu
 * @returns {Object} - { loading, error, updateItem }
 */
export function useStoreUpdate(storeId) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateItem = useCallback(
    async (values) => {
      if (!storeId || !values) return { success: false, error: "Chybí data" };

      setLoading(true);
      setError(null);

      try {
        await apiCall("/store/update", "POST", { values, storeId });
        window.showToast("Položka byla aktualizována.");
        return { success: true, error: null };
      } catch (err) {
        console.error("Fetch error:", err);
        const errorMsg = err?.message || "Nepodařilo se aktualizovat položku.";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [storeId],
  );

  return { loading, error, updateItem };
}
