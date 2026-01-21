//Ryze datová komponenta pro aktualizaci položky ve skladu
//Neposktuje žádné JSX, pouze efektivně volá API a vrací výsledek přes onResult callback
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function OneItemPutInStore({
  values,
  storeId,
  putInStoreTrigger,
  onResult,
}) {
  const [error, setError] = useState(null);

  useEffect(() => {
    const updateItem = async () => {
      try {
        const res = await fetch(`${API_URL}/store/putin-stock`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            store_item,
            plu,
            supplier,
            delivery_note,
            quantity,
            price_buy,
            date,
          }),
        });
        const data = await res.json();

        if (res.ok) {
          window.showToast("Položka byla aktualizována.");
          onResult({ success: true, error: null });
        } else {
          setError(data.message);
          onResult({ success: false, error: data.message });
          console.error("Chyba při aktualizaci položky:", data.message);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        const errorMsg = "Nepodařilo se aktualizovat položku.";
        setError(errorMsg);
        onResult({ success: false, error: errorMsg });
      }
    };

    if (values && storeId && putInStoreTrigger > 0) {
      updateItem();
    }
  }, [putInStoreTrigger, values, storeId]);

  return null;
}
