import { useCallback, useState } from "react";
import { apiCall } from "../utils/api";

export function useOrdersFindClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const findClient = useCallback(async ({ surname }) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiCall("/client/find_client", "POST", { surname });

      return data;
    } catch (err) {
      const message = err?.message || "Nepodařilo se najít klienta.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { findClient, loading, error };
}
