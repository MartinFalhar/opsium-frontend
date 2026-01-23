import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function useNameList(field) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!field) return;

    const fetchNameList = async () => {

      setLoading(true);

      try {
        const value = field || "";
        const res = await fetch(`${API_URL}/store/suppliers-list?field=${value}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        const result = await res.json();

        if (res.ok) {
          window.showToast("Úspěšně načten jmenný seznam kontaktů");
          // Data zůstávají jako objekty {id, nick}
          setData(result.items || []);
        } else {
          console.error("Chyba při načítání položek:", result.message);
          setData([]);
        }
      } catch (err) {
        console.error("Obdržená chyba:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNameList();
  }, [field]);

  return { data, loading };
}
