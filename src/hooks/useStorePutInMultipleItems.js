import { useState, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL;

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
        const res = await fetch(`${API_URL}/store/putin-multiple`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            storeId,
            items: values,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          window.showToast(
            `Bylo naskladněno ${data.count || values.length} položek.`,
          );
          return { success: true, error: null, count: data.count };
        } else {
          const errorMsg = data.message || "Nepodařilo se naskladnit položky.";
          console.error("Chyba při naskladnění položek:", errorMsg);
          return { success: false, error: errorMsg };
        }
      } catch (err) {
        console.error("Fetch error:", err);
        const errorMsg = "Nepodařilo se naskladnit položky.";
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [storeId],
  );

  return { loading, putInMultipleItems };
}
