import { useState, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Custom hook pro získání položky podle PLU kódu
 * @returns {Object} - { item, loading, error, getPluItem }
 */

export function useStoreGetPluItem() {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getPluItem = useCallback(
    async (
      plu,
      orderId,
      {
        quantity = 1,
        item_type = "goods",
        group = 0,
        specification_id = null,
        movement_type = "SALE",
        item_status = "ON_STOCK",
      } = {},
    ) => {
    if (!plu || plu.trim() === "") {
      setItem(null);
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/store/plu-item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          plu: plu.trim(),
          order_id: orderId,
          quantity,
          item_type,
          group,
          specification_id,
          movement_type,
          item_status,
        }),
      });

      const data = await res.json();

      console.log("Fetched PLU item data:", data);

      if (res.ok && data.success) {
        setItem(data.item);
        setError(null);
        return data.item;
      } else {
        const errorMsg = data.message || "Položka nebyla nalezena.";
        setError(errorMsg);
        setItem(null);
        return null;
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Chyba při komunikaci se serverem.");
      setItem(null);
      return null;
    } finally {
      setLoading(false);
    }
    },
    [],
  );

  return { item, loading, error, getPluItem };
}
