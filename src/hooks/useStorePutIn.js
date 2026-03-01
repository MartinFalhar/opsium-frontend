import { useState, useCallback } from "react";
import { apiCall } from "../utils/api";

/**
 * Custom hook pro připsání položky do skladu (naskladnění)
 * @param {number} storeId - ID skladu
 * @returns {Object} - { loading, putInItem }
 */
export function useStorePutIn(storeId) {
  const [loading, setLoading] = useState(false);

  const putInItem = useCallback(
    async (values) => {
      if (!storeId || !values) return { success: false, error: "Chybí data" };

      setLoading(true);
      console.log("Naskladňuji položku do skladu:", values.plu);
      try {
        await apiCall("/store/putin-stock", "POST", {
          store: storeId,
          plu: values.plu,
          supplier_id: values.supplier_id,
          delivery_note: values.delivery_note,
          quantity: values.quantity,
          price_buy: values.price_buy,
          date: values.date,
        });

        window.showToast("Položka byla naskladněna.");
        return { success: true, error: null };
      } catch (err) {
        console.error("Fetch error:", err);
        const errorMsg = err?.message || "Nepodařilo se naskladnit položku.";
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [storeId],
  );

  return { loading, putInItem };
}
