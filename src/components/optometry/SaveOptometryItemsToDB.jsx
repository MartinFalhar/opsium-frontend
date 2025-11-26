
const API_URL = import.meta.env.VITE_API_URL;

async function SaveOptometryItemsToDB(newExamDataSet) { 

      try {
        const res = await fetch(`${API_URL}/client/save_examination`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newExamDataSet),
        });
        console.log("Response from save_examination:", res);

        const data = await res.json();

        console.log("Data from save_examination:", data);

        if (res.ok) {
          console.log("Examination saved successfully.");
        } else {
          throw new Error(data?.message || "Chyba při ukládání do DB");
        }

        return data;
      } catch (err) {
        console.error("Chyba při načítání:", err);
        throw new Error("Nepodařilo se připojit k serveru.");
      } 

    
}
export default SaveOptometryItemsToDB;