import { useCallback, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export function useClientCreate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createClient = useCallback(async (clientPayload) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/client/create_client`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(clientPayload),
      });

      const responseText = await res.text();
      let data = null;

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          data = null;
        }
      }

      if (!res.ok) {
        throw new Error(data?.message || "Chyba při odesílání.");
      }

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