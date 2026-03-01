import { useCallback, useState } from "react";
import { apiCall } from "../utils/api";

export function useOrdersNew() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrder = useCallback(
    async ({ client_id, branch_id, member_id }) => {
      setLoading(true);
      setError(null);

      try {
        console.log("Creating order with payload:", {
          client_id,
          branch_id,
          member_id,
        });
        const data = await apiCall("/store/new-order", "POST", {
          client_id,
          branch_id,
          member_id,
          status: "draft",
        });

        if (!data?.id || !data?.year || !data?.number) {
          throw new Error(
            data?.message || "Nepodařilo se vytvořit novou zakázku.",
          );
        }

        return data;
      } catch (err) {
        const message = err?.message || "Nepodařilo se vytvořit novou zakázku.";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { createOrder, loading, error };
}
