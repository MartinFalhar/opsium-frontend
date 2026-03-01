import { apiCall } from "../../utils/api";

async function LoadExaminationFromDB(client_id, branch_id, name_id) {
  const loadInfo = {
    client_id: client_id,
    branch_id: branch_id,
    name_id: name_id,
  };

  try {
    const data = await apiCall("/client/load_examination", "POST", loadInfo);

    console.log("Data from load_examination:", data);
    console.log("Examination loaded successfully.");

    return { ...data };
  } catch (err) {
    console.error("Chyba při načítání:", err);
    throw new Error("Nepodařilo se připojit k serveru.");
  }
}

export default LoadExaminationFromDB;
