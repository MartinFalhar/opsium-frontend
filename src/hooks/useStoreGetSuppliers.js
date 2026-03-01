import { useEffect, useState } from "react";
import { apiCall } from "../utils/api";

/**
 * Custom hook pro načtení seznamu dodavatelů
 * @param {string} field - Typ pole (např. "brýle") nebo null pro všechny dodavatele
 * @returns {Object} - { suppliers }
 */
export function useStoreGetSuppliers(field) {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        // Pokud je field null nebo undefined, pošleme prázdný parametr pro načtení všech dodavatelů
        const fieldParam = field || "";
        const result = await apiCall(
          `/store/suppliers-list?field=${fieldParam}`,
          "GET",
        );
        setSuppliers(result.items || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setSuppliers([]);
      }
    };

    fetchSuppliers();
  }, [field]);

  return { suppliers };
}
