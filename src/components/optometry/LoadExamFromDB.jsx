const API_URL = import.meta.env.VITE_API_URL;

async function LoadExamFromDB(id_client, id_branch) {
  const loadInfo = {
    id_clients: id_client,
    id_branches: id_branch,
  };

  try {
    const res = await fetch(`${API_URL}/client/load_exams_list`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loadInfo),
    });
    console.log("Response from load_examination:", res);

    const data = await res.json();

    console.log("Data from loadsave_examination:", data);

    if (res.ok) {
      console.log("Examination loaded successfully.");
    } else {
      throw new Error(data?.message || "Chyba při načítání do DB");
    }

    return data;
  } catch (err) {
    console.error("Chyba při načítání:", err);
    throw new Error("Nepodařilo se připojit k serveru.");
  }
}

export default LoadExamFromDB;
