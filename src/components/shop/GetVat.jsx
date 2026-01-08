
const API_URL = import.meta.env.VITE_API_URL;

export async function getVatAtDate(date, setVatAtDate) {
      try {
        const response = await fetch(`${API_URL}/agenda/vat?date=${date}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        if (data) {
          setVatAtDate(data);
        }
      } catch (error) {
        console.error("Chyba při načítání DPH:", error);
      }
}

export default getVatAtDate;