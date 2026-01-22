import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Custom hook pro načtení seznamu dodavatelů
 * @param {string} field - Typ pole (např. "brýle")
 * @returns {Object} - { suppliers }
 */
export function useStoreGetSuppliers(field) {
  const [suppliers, setSuppliers] = useState([]);


  useEffect(() => {
    if (!field) return;

    const fetchSuppliers = async () => {

      try {
        const res = await fetch(`${API_URL}/store/suppliers-list?field=${field}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        const result = await res.json();

        if (res.ok) {
          setSuppliers(result.items || []);
        } else {
          console.error("Chyba při načítání dodavatelů:", result.message);
          setSuppliers([]);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setSuppliers([]);
      } 
    };

    fetchSuppliers();
  }, [field]);

  return { suppliers,  };
}
