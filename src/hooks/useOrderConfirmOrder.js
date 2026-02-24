import { useCallback, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export function useOrderConfirmOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const confirmOrder = useCallback(async (order_id) => {
    if (!order_id) {
      throw new Error("order_id je povinné");
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/store/confirm-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ order_id }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Nepodařilo se potvrdit zakázku.");
      }

      return data;
    } catch (err) {
      const message = err?.message || "Nepodařilo se potvrdit zakázku.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    confirmOrder,
    loading,
    error,
  };
}
