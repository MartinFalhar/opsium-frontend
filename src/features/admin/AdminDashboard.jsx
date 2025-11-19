import React, { useState, useEffect, useContext } from "react";
import { useInsertionEffect } from "react";
import { useUser } from "../../context/UserContext";

const API_URL = import.meta.env.VITE_API_URL;

function AdminDashboard({ client }) {
  const [opsiumInfo, setOpsiumInfo] = useState({});
  const [error, setError] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    const getOpsiumInfo = async () => {
      const res = await fetch(`${API_URL}/admin/adminInfo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_organizations: user.id_organizations }),
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
      <div className="info-box-2">
        <p>
          <strong>ADMIN DATA</strong>
        </p>
        <p>{`ID users: ${user.id}`}</p>
        <p>{`Jméno: ${user.name}`}</p>
        <p>{`Příjmení: ${user.surname}`}</p>
        <p>{`Email: ${user.email}`}</p>
        <p>{`ID organizace: ${user.id_organizations}`}</p>
        <p>{`Práva: ${user.rights}`}</p>
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

export default AdminDashboard;
