import { useState } from "react";
import { apiCall } from "../utils/api";

export default function useStoreGetCatalog() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCatalogInfo = async (plu, catalogType) => {
    setIsLoading(true);
    setError(null);
    console.log(
      "Volám getCatalogInfo s PLU:",
      plu,
      "a typem katalogu:",
      catalogType,
    );
    try {
      const data = await apiCall("/store/getlens", "POST", {
        plu,
        catalogType,
      });
      setIsLoading(false);
      return { success: true, data };
    } catch (err) {
      console.error("Chyba při volání getCatalogInfo:", err);
      setError("Chyba sítě nebo serveru");
      setIsLoading(false);
      return { success: false, message: err.message };
    }
  };

  return { getCatalogInfo, isLoading, error };
}
