import { useState, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Custom hook pro vyhledávání položek ve skladu
 * @param {number} storeId - ID skladu
 * @returns {Object} - { items, totalPages, loading, error, searchItems }
 */

export function useStoreSearch(storeId) {
  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchItems = useCallback(
    async (page, limit, searchValue = "") => {
      if (!storeId) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${API_URL}/store/search?store=${storeId}&page=${page}&limit=${limit}&value=${searchValue}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        const data = await res.json();

        if (res.ok) {
          window.showToast("Úspěšně načteno");
          setItems(data.items);
          setTotalPages(data.totalPages);
        } else {
          const errorMsg = data.message || "Nepodařilo se načíst položky.";
          setError(errorMsg);
          setItems([]);
          setTotalPages(1);
          console.error("Chyba při načítání položek:", errorMsg);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        const errorMsg = "Nepodařilo se načíst položky.";
        setError(errorMsg);
        setItems([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    },
    [storeId]
  );

  return { items, totalPages, loading, error, searchItems };
}

