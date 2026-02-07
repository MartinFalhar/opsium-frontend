import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function useStoreGetCatalog() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCatalogInfo = async (plu, catalogType) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/store/getlens`, {
        method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        body: JSON.stringify({ plu, catalogType }),
      });
      const data = await res.json();


      if (res.ok) {
        setIsLoading(false);
        return { success: true, data };
      } else {
        // Backend vrátil error status (404, 500, atd.)
        setError(data.message || "Chyba při načítání informací o čočce");
        setIsLoading(false);
        return { success: false, message: data.message, data };
      }
    } catch (err) {
      console.error("Chyba při volání getCatalogInfo:", err);
      setError("Chyba sítě nebo serveru");
      setIsLoading(false);
      return { success: false, message: err.message };
    }
  };

  return { getCatalogInfo, isLoading, error };
}
