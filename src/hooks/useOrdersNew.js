import { useCallback, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export function useOrdersNew() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrder = useCallback(async ({ client_id, branch_id, member_id }) => {
    setLoading(true);
    setError(null);

    try {

      const res = await fetch(`${API_URL}/store/new-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          client_id,
          branch_id,
          member_id,
          status: "draft",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Nepodařilo se vytvořit novou zakázku.");
      }

      return data;
    } catch (err) {
      const message = err?.message || "Nepodařilo se vytvořit novou zakázku.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createOrder, loading, error };
}
