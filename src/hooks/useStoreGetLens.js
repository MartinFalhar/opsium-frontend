import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function useStoreGetLens() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getLensInfo = async (plu) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/store/getlens`, {
        method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        body: JSON.stringify({ plu }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsLoading(false);
        return { success: true, data };
      } else {
        setError(data.message || "Chyba při načítání informací o čočce");
        setIsLoading(false);
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error("Chyba při volání getLensInfo:", err);
      setError("Chyba sítě nebo serveru");
      setIsLoading(false);
      return { success: false, message: err.message };
    }
  };

  return { getLensInfo, isLoading, error };
}
