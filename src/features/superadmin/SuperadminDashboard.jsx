import React, { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function SuperadminDashboard( ) {
  const [opsiumInfo, setOpsiumInfo] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const getOpsiumInfo = async () => {
      const res = await fetch(`${API_URL}/admin/superadminInfo`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const info = await res.json();
      console.log(info);

      if (res.ok) {
        setOpsiumInfo(info);
      } else {
        setError(info.message);
        console.error("Error loading users:", error);
      }
    };
    getOpsiumInfo();
  }, []);

  return (
    <div className="admin-dashboard-container">
      <div className="info-box">
        <div className="info-box-header">
          <h2>Adminů</h2>
        </div>
        <div className="info-box-content">
          <h5>{opsiumInfo.countAdmin}</h5>
        </div>
      </div>
      <div className="info-box">
        <div className="info-box-header">
          <h3>Účtů</h3>
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
          <h5>Členů</h5>
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

export default SuperadminDashboard;
