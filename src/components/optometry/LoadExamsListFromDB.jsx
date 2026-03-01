import { apiCall } from "../../utils/api";

async function LoadExamsListFromDB(client_id, branch_id) {
  const loadInfo = {
    client_id: client_id,
    branch_id: branch_id,
  };

  try {
    const data = await apiCall("/client/load_exams_list", "POST", loadInfo);

    console.log("Data from loadsave_examList:", data);
    console.log("Examination loaded successfully.");

    return data;
  } catch (err) {
    console.error("Chyba při načítání:", err);
    throw new Error("Nepodařilo se připojit k serveru.");
  }
}

export default LoadExamsListFromDB;
