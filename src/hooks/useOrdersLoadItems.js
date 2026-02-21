import { useCallback, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export function useOrdersLoadItems() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadOrderItems = useCallback(async (order_id) => {
    if (!order_id) {
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/store/order-items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ order_id }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Nepodařilo se načíst položky zakázky.");
      }

      return Array.isArray(data.items) ? data.items : [];
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
