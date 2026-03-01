import { useState, useCallback } from "react";
import { apiCall } from "../utils/api";

/**
 * Custom hook pro připsání více položek do skladu (hromadné naskladnění)
 * @param {number} storeId - ID skladu
 * @returns {Object} - { loading, putInMultipleItems }
 */
export function useStorePutInMultipleItems(storeId) {
  const [loading, setLoading] = useState(false);

  const putInMultipleItems = useCallback(
    async (values) => {
      if (!storeId || !values) return { success: false, error: "Chybí data" };

      setLoading(true);
      console.log("Hromadně naskladňuji položky do skladu:", values);

      try {
        const data = await apiCall("/store/putin-multiple", "POST", {
          storeId,
          items: values,
        });

        window.showToast(
          `Bylo naskladněno ${data.count || values.length} položek.`,
        );
        return { success: true, error: null, count: data.count };
      } catch (err) {
        console.error("Fetch error:", err);
        const errorMsg = err?.message || "Nepodařilo se naskladnit položky.";
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [storeId],
  );

  return { loading, putInMultipleItems };
}
