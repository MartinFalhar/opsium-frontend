import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Custom hook pro načtení seznamu sazeb DPH
 * @returns {Object} - { vatRates }
 */
export function useStoreGetVat() {
  const [vatRates, setVatRates] = useState([]);

  useEffect(() => {
    const fetchVatRates = async () => {
      try {
        const res = await fetch(`${API_URL}/store/vat-list`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        const result = await res.json();

        if (res.ok) {
          setVatRates(result.items || []);
        } else {
          console.error("Chyba při načítání sazeb DPH:", result.message);
          setVatRates([]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setVatRates([]);
      }
    };

    fetchVatRates();
  }, []);

  return { vatRates };
}
