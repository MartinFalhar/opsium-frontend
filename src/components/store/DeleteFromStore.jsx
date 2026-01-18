import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function DeleteFromStore({ plu, storeId, trigger, onResult }) {
  const [error, setError] = useState(null);

  useEffect(() => {
    const deleteItem = async () => {
      try {
        const res = await fetch(`${API_URL}/store/delete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({ plu, storeId }),
        });
        const data = await res.json();

        if (res.ok) {
          window.showToast("Položka byla smazána.");
          onResult({ success: true, error: null });
        } else {
          setError(data.message);
          onResult({ success: false, error: data.message });
          console.error("Chyba při mazání položky:", data.message);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        const errorMsg = "Nepodařilo se smazat položku.";
        setError(errorMsg);
        onResult({ success: false, error: errorMsg });
      }
    };

    if (trigger && plu && storeId) {
      deleteItem();
    }
  }, [trigger, plu, storeId]);

  return null; // Tato komponenta nevrací žádné JSX
}
