import { useCallback, useState } from "react";
import { apiCall } from "../utils/api";

export function useClientCreate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createClient = useCallback(async (clientPayload) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiCall(
        "/client/create_client",
        "POST",
        clientPayload,
      );

      return data;
    } catch (err) {
      const message = err?.message || "Server je nedostupný.";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createClient, loading, error };
}
