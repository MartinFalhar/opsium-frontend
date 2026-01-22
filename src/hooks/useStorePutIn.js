import { useState, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL;

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
        const res = await fetch(`${API_URL}/store/putin-stock`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            plu: values.plu,
            id_supplier: values.id_supplier,
            delivery_note: values.delivery_note,
            quantity: values.quantity,
            price_buy: values.price_buy,
            date: values.date,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          window.showToast("Položka byla naskladněna.");
          return { success: true, error: null };
        } else {
          const errorMsg = data.message || "Nepodařilo se naskladnit položku.";
          console.error("Chyba při naskladnění položky:", errorMsg);
          return { success: false, error: errorMsg };
        }
      } catch (err) {
        console.error("Fetch error:", err);
        const errorMsg = "Nepodařilo se naskladnit položku.";
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [storeId]
  );

  return { loading, putInItem };
}
