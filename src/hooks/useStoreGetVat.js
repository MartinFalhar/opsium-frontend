import { useEffect, useState } from "react";
import { apiCall } from "../utils/api";

/**
 * Custom hook pro načtení seznamu sazeb DPH
 * @returns {Object} - { vatRates }
 */
export function useStoreGetVat() {
  const [vatRates, setVatRates] = useState([]);

  useEffect(() => {
    const fetchVatRates = async () => {
      try {
        const result = await apiCall("/store/vat-list", "GET");
        setVatRates(result.items || []);
      } catch (err) {
        console.error("Fetch error:", err);
        setVatRates([]);
      }
    };

    fetchVatRates();
  }, []);

  return { vatRates };
}
