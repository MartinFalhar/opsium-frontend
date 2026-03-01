import { useCallback, useState } from "react";
import { apiCall } from "../utils/api";

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
      const data = await apiCall("/store/confirm-order", "POST", { order_id });

      if (!data?.success) {
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
