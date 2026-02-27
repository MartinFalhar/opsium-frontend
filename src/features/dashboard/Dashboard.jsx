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
          throw new Error(
            data?.message || "Nepodařilo se načíst dashboard data.",
          );
        }

        setDashboardData({
          closedOrdersCount: Number(data.closedOrdersCount ?? 0),
          latestOrders: Array.isArray(data.latestOrders)
            ? data.latestOrders
            : [],
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
    <div className="container">
      <div className="dashboard-info">
        <div className="info-box-3">
          <div className="info-box-header">
            <h3>Informace o organizaci:</h3>
          </div>
          <div className="info-box-content">
            <h1 className="dark">{`${user.organization_name}`}</h1>
            <h1 className="dark">{`Ulice: ${user.organization_street}`}</h1>
            <h1 className="dark">{`Město: ${user.organization_city}`}</h1>
            <h1 className="dark">{`PSČ: ${user.organization_postal_code}`}</h1>
          </div>
        </div>
        <div className="info-box-3">
          <div className="info-box-header">
            <h3>Identifikace organizace:</h3>
          </div>
          <div className="info-box-content">
            <h1 className="dark">{`IČO: ${user.organization_ico}`}</h1>
            <h1 className="dark">{`DIČ: ${user.organization_dic}`}</h1>
          </div>
        </div>
        <div className="info-box-3">
          <div className="info-box-header">
            <h3>Členové organizace:</h3>
          </div>
          <div className="info-box-content">
            {members.map((member) => (
              <div key={member.id}>
                <p>{`${member.name} ${member.surname} (${member.nick}) #${member.pin}`}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="info-box-3">
          <div className="info-box-header">
            <h3>Spravovaná pobočka:</h3>
          </div>
          <div className="info-box-content">
            {user.branch_id === 0 ? (
              <p>
                K tomuto účtu není přiřazena žádná pobočka, jedná se o ADMIN
                účet.
              </p>
            ) : (
              <div>
                <h1 className="dark">{`${user.branch_name}`}</h1>
                <h1 className="dark">{`${user.branch_street}`}</h1>
                <h1 className="dark">{`${user.branch_postal_code} ${user.branch_city} `}</h1>
                <h1 className="dark">{`${user?.open_hours?.["pondělí"] || `closed`}`}</h1>
              </div>
            )}
          </div>
        </div>

        <div className="info-box-3">
          <div className="info-box-header">
            <h3>Zakázky</h3>
          </div>
          <div className="info-box-content">
            <h1 className="dark">{`Uzavřené zakázky: ${dashboardData.closedOrdersCount}`}</h1>
            {dashboardLoading && <p>Načítám...</p>}
            {dashboardError && <p>{dashboardError}</p>}
            {!dashboardLoading &&
              !dashboardError &&
              dashboardData.latestOrders.map((order) => (
                <p
                  key={order.id}
                >{`${formatDate(order.created_at)} | ${order.name || "Neznámý"} ${order.surname || "zákazník"} | ${order.status || "-"}`}</p>
              ))}
          </div>
        </div>

        <div className="info-box-3">
          <div className="info-box-header">
            <h3>Transakce</h3>
          </div>
          <div className="info-box-content">
            <h1 className="dark">{`${dashboardData.transactionsTotal.toFixed(2)} Kč`}</h1>
            <p>Celková cena transakcí</p>
          </div>
        </div>

        <div className="info-box-3">
          <div className="info-box-header">
            <h3>Naskladněné položky</h3>
          </div>
          <div className="info-box-content">
            <p>{`store_frames: ${dashboardData.stockCounts.store_frames}`}</p>
            <p>{`store_sunglasses: ${dashboardData.stockCounts.store_sunglasses}`}</p>
            <p>{`store_lens: ${dashboardData.stockCounts.store_lens}`}</p>
            <p>{`store_cl: ${dashboardData.stockCounts.store_cl}`}</p>
            <p>{`store_goods: ${dashboardData.stockCounts.store_goods}`}</p>
          </div>
        </div>
        <div className="info-box-3"></div>
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
