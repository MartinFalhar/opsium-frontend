const API_URL = import.meta.env.VITE_API_URL;

async function LoadExaminationFromDB(id_client, id_branch, id_name) {
  const loadInfo = {
    id_clients: id_client,
    id_branches: id_branch,
    id_name: id_name,
  };

  try {
    const res = await fetch(`${API_URL}/client/load_examination`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loadInfo),
    });
    console.log("Response from load_examination:", res);

    const data = await res.json();

    console.log("Data from load_examination:", data);

    if (res.ok) {
      console.log("Examination loaded successfully.");
    } else {
      throw new Error(data?.message || "Chyba při načítání do DB");
    }

    return { ...data };
  } catch (err) {
    console.error("Chyba při načítání:", err);
    throw new Error("Nepodařilo se připojit k serveru.");
  }
}

export default LoadExaminationFromDB;
