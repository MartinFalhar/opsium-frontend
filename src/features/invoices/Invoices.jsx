import React from "react";
import { useEffect, useState } from "react";
import "./Invoices.css";
import Modal from "../../components/modal/Modal.jsx";
import { useUser } from "../../context/UserContext";
import { useNavigate, Navigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function Invoices() {
  const [searchInvoice, setSearchInvoices] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const { user, activeId } = useUser();

  const navigate = useNavigate();

  function handleNewInvoice() {
    navigate("/new-order");
  }

  function handlePrintInvoice(invoice) {
    console.log("Tisk zakázky:", invoice.id);
    window.open(`${API_URL}/pdf/invoice/${invoice.id}`, "_blank");
  }

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const res = await fetch(`${API_URL}/store/orders-list`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_branch: user.branch_id }),
        });
        const data = await res.json();
        if (res.ok) {
          setInvoices(data);
        } else {
          setError(data.message);
          console.error("Error loading users:", error);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Nepodařilo se načíst klienty.");
      }
    };
    loadInvoices();
  }, []);

  return (
    <div className="container">
      <div className="left-container-2">
        <div className="input-panel">
          <div className="search-input-container">
            <input
              type="text"
              value={searchInvoice}
              onChange={(e) => setSearchInvoices(e.target.value)}
              placeholder="Hledej zakázku"
            />
            <button type="submit">Hledej</button>
          </div>
          <button onClick={() => handleNewInvoice()}>Přidat</button>
          <button onClick={() => handlePrintInvoice(invoices[0])}>Tisk</button>
        </div>
        <div className="show-items-panel">
          <div className="items-panel-label">
            <h2>Zakázky</h2>
            <p>...přidat paginaci...</p>
            <p>Nalezeno {invoices.length} zakázek</p>
          </div>
          <div className="items-panel-header-services">
            <p>a</p>
          </div>
          <div className="items-list">
            {invoices.length > 0 &&
              invoices.map((invoice) => (
                <div key={invoice.id} className="item">
                  <h1>{`${JSON.stringify(invoice.attrib)}`}</h1>
                  <p>{`${JSON.stringify(invoice.content)}`} </p>
                  <p>{`${JSON.stringify(invoice.note)}`} </p>
                </div>
              ))}
          </div>{" "}
          {/* <div className="clients-right-column">
            <h1>Filtry</h1>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Invoices;
