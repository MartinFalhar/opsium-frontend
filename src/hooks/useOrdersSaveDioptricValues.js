import { useCallback, useState } from "react";
import { apiCall } from "../utils/api";

export function useOrdersSaveDioptricValues() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const saveOrderDioptricValues = useCallback(
    async (order_id, items = [], orderData = {}) => {
      if (!order_id) {
        throw new Error("order_id je povinné");
      }

      setLoading(true);
      setError(null);

      try {
        const data = await apiCall("/store/order-dioptric-values", "POST", {
          order_id,
          items,
          note: orderData?.note ?? "",
          delivery_address: orderData?.delivery_address ?? "",
        });

        if (!data?.success) {
          throw new Error(
            data?.message || "Nepodařilo se uložit dioptrické hodnoty.",
          );
        }

        return data;
      } catch (err) {
        const message =
          err?.message || "Nepodařilo se uložit dioptrické hodnoty.";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    saveOrderDioptricValues,
    loading,
    error,
  };
}
