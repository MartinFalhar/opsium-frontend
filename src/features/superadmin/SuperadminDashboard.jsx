import React, { useState, useEffect } from "react";
import { useInsertionEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function SuperadminDashboard({ userData }) {
  const [opsiumInfo, setOpsiumInfo] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const getOpsiumInfo = async () => {
      const res = await fetch(`${API_URL}/admin/opsiumInfo`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const info = await res.json();
      console.log(info);

      if (res.ok) {
        setOpsiumInfo(info);
      } else {
        setError(data.message);
        console.error("Error loading users:", error);
      }
    };
    getOpsiumInfo();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="info-box">
        <h2>Počet admin účtů:</h2>
        <h1>{opsiumInfo.countAdmin}</h1>
      </div>
      <div className="info-box">
        <h3>Počet všech účtů:</h3>
        <h1>{opsiumInfo.countTotal}</h1>
      </div>
      <div className="info-box">
        <h4>Počet poboček:</h4>
        <h1>{opsiumInfo.countTotalBranches}</h1>
      </div>
      <div className="info-box">
        <h5>Počet členů:</h5>
        <h1>{opsiumInfo.countTotalMembers}</h1>
      </div>
      <div className="info-box">
        <h6>Počet klientů:</h6>
        <h1>{opsiumInfo.countTotalClients}</h1>
      </div>
    </div>
  );
}

export default SuperadminDashboard;
