import { useState, useCallback } from "react";
import { apiCall } from "../utils/api";

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
        const data = await apiCall(
          `/store/search?store=${storeId}&page=${page}&limit=${limit}&value=${searchValue}`,
          "GET",
        );

        window.showToast("Úspěšně načteno");
        setItems(data.items);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Fetch error:", err);
        const errorMsg = err?.message || "Nepodařilo se načíst položky.";
        setError(errorMsg);
        setItems([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    },
    [storeId],
  );

  return { items, totalPages, loading, error, searchItems };
}
