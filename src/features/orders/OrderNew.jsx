import React from "react";
import { useState } from "react";
import "./Orders.css";
import Modal from "../../components/modal/Modal.jsx";
import { useUser } from "../../context/UserContext.jsx";
import { useNavigate, Navigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

function InvoiceNew() {
  const [showModal, setShowModal] = useState(false);
  const [invoiceID, setInvoiceID] = useState(null);
  const { user, activeId } = useUser();
  const navigate = useNavigate();

  const newInvoice = {
    client_id: activeId?.client_id || 1,
    branch_id: user?.branch_id,
    member_id: activeId?.member_id,
    attrib: { attr: "OK" },
    content: {
      b: 526358,
      v: 150,
      g: "Punktulit 1.6",
    },
    note: "NOTE NUMERO UNO",
  };

  const newTransaction = {
    invoice_id: 7,
    attrib: 1,
    price_a: 111.11,
    vat_a: 11.11,
    price_b: 222.22,
    vat_b: 22.22,
    price_c: 333.33,
    vat_c: 33.33,
  };

  const handleSaveNewInvoice = async () => {
    try {
      const res = await fetch(`${API_URL}/store/new-invoice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newInvoice),
      });

      if (res.ok) {
        const data = await res.json();
        setInvoiceID(data);
      } else {
        alert("Chyba při odesílání.");
      }
    } catch (error) {
      console.error(error);
      alert("Server je nedostupný.");
    } finally {
      navigate("/invoices");
    }
  };

  const handleSaveTransaction = async () => {
    try {
      const res = await fetch(`${API_URL}/store/new-transaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTransaction),
      });
      if (res.ok) {
        alert("Úspěšně odesláno!");
      } else {
        alert("Chyba při odesílání.");
      }
    } catch (error) {
      console.error(error);
      alert("Server je nedostupný.");
    } finally {
      navigate("/invoices");
    }
  };

  return (
    <div className="clients-container">
      <div className="clients-left-column">
        <div className="clients-search-container">
          <div className="search-container">
            <h1>NOVÁ ZAKÁZKA</h1>
            <button
              className="admin-menu-btn"
              onClick={() => handleSaveNewInvoice()}
            >
              Uložit
            </button>
          </div>
        </div>
        <div className="input-area-header">
          <div className="input-panel">
            <h7>Údaje zákazníka</h7>
            <h7>ID KLIENTA</h7>
            <h7>{newInvoice.client_id}</h7>
            <h7>ID POBOČKY</h7>
            <h7>{newInvoice.branch_id}</h7>
            <h7>ID ČLENA</h7>
            <h7>{newInvoice.member_id}</h7>
            <h7>Poznámka</h7>
            <h7>{newInvoice.note}</h7>
          </div>
          <div className="input-panel">
            <h7>Atributy objednávky</h7>
            <h7>{JSON.stringify(newInvoice.attrib)}</h7>
          </div>
        </div>
        <div className="input-area-content">
          <div className="input-panel">
            <h7>Obsah nové objednávky</h7>
            <h7>{JSON.stringify(newInvoice.content)}</h7>
          </div>
        </div>
      </div>
      <div className="clients-right-column">
        <h3>Pokladna</h3>

        <button
          className="admin-menu-btn"
          onClick={() => handleSaveTransaction()}
        >
          Poslat zálohu
        </button>
      </div>
    </div>
  );
}

export default InvoiceNew;
