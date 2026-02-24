import React from "react";
import { useEffect, useState } from "react";
import "./Dashboard.css";
import Modal from "../../components/modal/Modal.jsx";

import { useUser } from "../../context/UserContext";

const API_URL = import.meta.env.VITE_API_URL;

function Dashboard() {
  const { user, members } = useUser();
  const [dashboardData, setDashboardData] = useState({
    closedOrdersCount: 0,
    latestOrders: [],
    transactionsTotal: 0,
    stockCounts: {
      store_frames: 0,
      store_sunglasses: 0,
      store_lens: 0,
      store_cl: 0,
      store_goods: 0,
    },
  });
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setDashboardLoading(true);
        setDashboardError(null);

        const res = await fetch(`${API_URL}/agenda/dashboard`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        const data = await res.json();

        if (!res.ok || !data?.success) {
          throw new Error(data?.message || "Nepodařilo se načíst dashboard data.");
        }

        setDashboardData({
          closedOrdersCount: Number(data.closedOrdersCount ?? 0),
          latestOrders: Array.isArray(data.latestOrders) ? data.latestOrders : [],
          transactionsTotal: Number(data.transactionsTotal ?? 0),
          stockCounts: {
            store_frames: Number(data?.stockCounts?.store_frames ?? 0),
            store_sunglasses: Number(data?.stockCounts?.store_sunglasses ?? 0),
            store_lens: Number(data?.stockCounts?.store_lens ?? 0),
            store_cl: Number(data?.stockCounts?.store_cl ?? 0),
            store_goods: Number(data?.stockCounts?.store_goods ?? 0),
          },
        });
      } catch (error) {
        console.error("Dashboard loading error:", error);
        setDashboardError(
          error?.message || "Nepodařilo se načíst data na dashboardu.",
        );
      } finally {
        setDashboardLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const formatDate = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "-";
    }
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="clients-container"> 
      <div className="clients-left-column">
        <div className="clients-search-container"></div>
        <div className="clients-list-container">

        <div className="dashboard-info-grid">

        <div className="info-box-2">
          <h6>Informace o organizaci:</h6>
          <h1>{`${user.organization_name}`}</h1>
          <h1>{`Ulice: ${user.organization_street}`}</h1>
          <h1>{`Město: ${user.organization_city}`}</h1>
          <h1>{`PSČ: ${user.organization_postal_code}`}</h1>
        </div>
        <div className="info-box-2">
          <h1>{`IČO: ${user.organization_ico}`}</h1>
          <h1>{`DIČ: ${user.organization_dic}`}</h1>
        </div>
        <div className="info-box-2">
          <h6>Členové organizace:</h6>
          {members.map((member) => (
              <div key={member.id}>
              <p>{`${member.name} ${member.surname} (${member.nick}) #${member.pin}`}</p>
            </div>
          ))}
        </div>
        <div className="info-box-2">
          <h6>Spravovaná pobočka:</h6>
          {user.branch_id === 0 ? (
              <p>
              K tomuto účtu není přiřazena žádná pobočka, jedná se o ADMIN účet.
            </p>
          ) : (
              <div>              
              <h1>{`${user.branch_name}`}</h1>
              <h1>{`${user.branch_street}`}</h1>
              <h1>{`${user.branch_postal_code} ${user.branch_city} `}</h1>
              <h1>{`${user?.open_hours?.['pondělí'] || `closed`}`}</h1>
            </div>
          )}
          </div>

          <div className="info-box-2">
            <h6>Zakázky</h6>
            <h1>{`Uzavřené zakázky: ${dashboardData.closedOrdersCount}`}</h1>
            {dashboardLoading && <p>Načítám...</p>}
            {dashboardError && <p>{dashboardError}</p>}
            {!dashboardLoading &&
              !dashboardError &&
              dashboardData.latestOrders.map((order) => (
                <p key={order.id}>{`${formatDate(order.created_at)} | ${order.name || "Neznámý"} ${order.surname || "zákazník"} | ${order.status || "-"}`}</p>
              ))}
          </div>

          <div className="info-box-2">
            <h6>Transakce</h6>
            <h1>{`${dashboardData.transactionsTotal.toFixed(2)} Kč`}</h1>
            <p>Celková cena transakcí</p>
          </div>

          <div className="info-box-2">
            <h6>Naskladněné položky</h6>
            <p>{`store_frames: ${dashboardData.stockCounts.store_frames}`}</p>
            <p>{`store_sunglasses: ${dashboardData.stockCounts.store_sunglasses}`}</p>
            <p>{`store_lens: ${dashboardData.stockCounts.store_lens}`}</p>
            <p>{`store_cl: ${dashboardData.stockCounts.store_cl}`}</p>
            <p>{`store_goods: ${dashboardData.stockCounts.store_goods}`}</p>
          </div>
        </div>

        </div>
      </div>
      <div>
        {/* {showModal && (
          <Modal
            fields={fields}
            onSubmit={handleSubmit}
            onClose={() => setShowModal(false)}
          />
        )} */}
      </div>

    </div>
  );
}

export default Dashboard;
