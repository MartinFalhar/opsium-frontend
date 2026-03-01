import { apiCall } from "../../utils/api";

async function SaveOptometryItemsToDB(newExamDataSet) {
  try {
    const data = await apiCall(
      "/client/save_examination",
      "POST",
      newExamDataSet,
    );

    console.log("Data from save_examination:", data);
    console.log("Examination saved successfully.");

    return data;
  } catch (err) {
    console.error("Chyba při načítání:", err);
    throw new Error("Nepodařilo se připojit k serveru.");
  }
}
export default SaveOptometryItemsToDB;
