import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function SearchInStore({
  storeId,
  page,
  limit,
  searchValue,
  refreshTrigger,
  onResult,
}) {
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const value = searchValue || "";
        const res = await fetch(
          `${API_URL}/store/search?store=${storeId}&page=${page}&limit=${limit}&value=${value}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          },
        );
        const data = await res.json();

        if (res.ok) {
          window.showToast("Úspěšně načteno");
          onResult({
            items: data.items,
            totalPages: data.totalPages,
            error: null,
          });
        } else {
          setError(data.message);
          onResult({ items: [], totalPages: 1, error: data.message });
          console.error("Chyba při načítání položek:", data.message);
        }
      } catch (err) {
        console.error("Obdržená chyba:", err);
        const errorMsg = "Nepodařilo se načíst položky.";
        setError(errorMsg);
        onResult({ items: [], totalPages: 1, error: errorMsg });
      }
    };

    if (storeId) {
      loadItems();
    }
  }, [storeId, page, limit, searchValue, refreshTrigger ]);

  return null; // Tato komponenta nevrací žádné JSX
}
