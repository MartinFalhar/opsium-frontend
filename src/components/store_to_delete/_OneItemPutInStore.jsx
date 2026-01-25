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

     window.showToast("PUTIN aktivován");
     console.log("PUTIN values:", values);
     console.log("PUTIN values:",   putInStoreTrigger  );
     console.log("PUTIN values:", storeId);
     

     const updateItem = async () => {

      window.showToast("JELCIN aktivován");

      try {
        const res = await fetch(`${API_URL}/store/putin-stock`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({            
            plu: values.plu,
            supplier_id: values.supplier_id,
            delivery_note: values.delivery_note,
            quantity: values.quantity,
            price_buy: values.price_buy,
            date: values.date,
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
