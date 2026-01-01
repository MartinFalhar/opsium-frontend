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
    navigate("/invoice-new");
  }

  function handlePrintInvoice(invoice) {
  console.log("Tisk zakázky:", invoice.id);
  window.open(`${API_URL}/pdf/invoice/${invoice.id}`, "_blank");
  }

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const res = await fetch(`${API_URL}/store/invoices-list`, {
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
    <div className="clients-container">
      <div className="clients-left-column">
        <div className="search-container">
          <input
            className="client-search-input"
            type="text"
            value={searchInvoice}
            onChange={(e) => setSearchInvoices(e.target.value)}
            placeholder="Hledej zakázku"
          />
          <button className="admin-menu-btn" type="submit">
            Hledej
          </button>

          <button className="admin-menu-btn" onClick={() => handleNewInvoice()}>
            Přidat
          </button>

          <button
            className="admin-menu-btn"
            onClick={() => handlePrintInvoice(invoices[0])}
          >
            Tisk
          </button>
        </div>

        <div className="clients-list-container">
          <h1>Nalezeno {invoices.length} zakázek</h1>
          {invoices.length > 0 &&
            invoices.map((invoice) => (
              <div key={invoice.id} className="client-item">
                <h1>{`${JSON.stringify(invoice.attrib)}`}</h1>
                <p>{`${JSON.stringify(invoice.content)}`} </p>
                <p>{`${JSON.stringify(invoice.note)}`} </p>
              </div>
            ))}
        </div>
      </div>{" "}
      <div className="clients-right-column">
        <h1>Filtry</h1>
      </div>
    </div>
  );
}

export default Invoices;
