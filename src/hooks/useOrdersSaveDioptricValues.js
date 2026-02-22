import { useCallback, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export function useOrdersSaveDioptricValues() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveOrderDioptricValues = useCallback(async (order_id, items = [], orderData = {}) => {
    if (!order_id) {
      throw new Error("order_id je povinné");
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/store/order-dioptric-values`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          order_id,
          items,
          note: orderData?.note ?? "",
          delivery_address: orderData?.delivery_address ?? "",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Nepodařilo se uložit dioptrické hodnoty.");
      }

      return data;
    } catch (err) {
      const message = err?.message || "Nepodařilo se uložit dioptrické hodnoty.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    saveOrderDioptricValues,
    loading,
    error,
  };
}
