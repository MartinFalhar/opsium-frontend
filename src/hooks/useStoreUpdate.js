import { useState, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL;

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
        const res = await fetch(`${API_URL}/store/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({ values, storeId }),
        });

        const data = await res.json();

        if (res.ok) {
          window.showToast("Položka byla aktualizována.");
          return { success: true, error: null };
        } else {
          const errorMsg = data.message || "Nepodařilo se aktualizovat položku.";
          setError(errorMsg);
          console.error("Chyba při aktualizaci položky:", errorMsg);
          return { success: false, error: errorMsg };
        }
      } catch (err) {
        console.error("Fetch error:", err);
        const errorMsg = "Nepodařilo se aktualizovat položku.";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [storeId]
  );

  return { loading, error, updateItem };
}
