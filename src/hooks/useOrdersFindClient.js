import { useCallback, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export function useOrdersFindClient() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const findClient = useCallback(async ({ surname }) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/client/find_client`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ surname }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Nepodařilo se najít klienta.");
      }

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
