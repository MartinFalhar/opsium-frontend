import { useCallback, useState } from "react";
import { apiCall } from "../utils/api";

export function useOrdersLoadItems() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadOrderItems = useCallback(async (order_id) => {
    if (!order_id) {
      return { items: [], transactions: [] };
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiCall("/store/order-items", "POST", { order_id });

      if (!data?.success) {
        throw new Error(
          data?.message || "Nepodařilo se načíst položky zakázky.",
        );
      }

      return {
        items: Array.isArray(data.items) ? data.items : [],
        transactions: Array.isArray(data.transactions) ? data.transactions : [],
      };
    } catch (err) {
      const message = err?.message || "Nepodařilo se načíst položky zakázky.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loadOrderItems, loading, error };
}
