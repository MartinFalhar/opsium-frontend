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
    <div className="admin-dashboard-container">
      <div className="info-box-2">
        <h6>
          <strong>ADMIN DATA</strong>
        </h6>
        <p>{`ID users: ${user.id}`}</p>
        <p>{`Jméno: ${user.name}`}</p>
        <p>{`Příjmení: ${user.surname}`}</p>
        <p>{`Email: ${user.email}`}</p>
        <p>{`ID organizace: ${user.id_organizations}`}</p>
        <p>{`Práva: ${user.rights}`}</p>
      </div>

      <div className="info-box">
        <div className="info-box-header">
          <h3>Počet účtů</h3>
        </div>
        <div className="info-box-content">
          <h5>{opsiumInfo.countTotal}</h5>
        </div>
      </div>

      <div className="info-box">
        <div className="info-box-header">
          <h4>Poboček</h4>
        </div>
        <div className="info-box-content">
          <h5>{opsiumInfo.countTotalBranches}</h5>
        </div>
      </div>

      <div className="info-box">
        <div className="info-box-header">
          <h5>Členové</h5>
        </div>
        <div className="info-box-content">
          <h5>{opsiumInfo.countTotalMembers}</h5>
        </div>
      </div>

      <div className="info-box">
        <div className="info-box-header">
            <h6>Klientů</h6>
        </div>
          <div className="info-box-content">

        <h5>{opsiumInfo.countTotalClients}</h5>
          </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
