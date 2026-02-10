import React from "react";
import { useEffect, useState } from "react";
import "./Orders.css";
import Modal from "../../components/modal/Modal.jsx";
import { useUser } from "../../context/UserContext.jsx";
import { useNavigate, Navigate } from "react-router-dom";
import PuffLoaderSpinnerLarge from "../../components/loader/PuffLoaderSpinnerLarge.jsx";
import Pagination from "../../components/pagination/Pagination.jsx";
const API_URL = import.meta.env.VITE_API_URL;

function Invoices() {
  const [searchInvoice, setSearchInvoices] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const { user, activeI, members } = useUser();

  const navigate = useNavigate();

  // Paginace
  const [page, setPage] = useState(1);
  const limit = 6;
  const [totalPages, setTotalPages] = useState(1);

  function handleNewInvoice() {
    navigate("/new-order");
  }

  function handlePrintInvoice(invoice) {
    console.log("Tisk zakázky:", invoice.id);
    window.open(`${API_URL}/pdf/invoice/${invoice.id}`, "_blank");
  }

  useEffect(() => {
    console.log("Aktivní ID z kontextu:", members);
    const loadInvoices = async () => {
      try {
        const res = await fetch(`${API_URL}/store/orders-list`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({ branch_id: user.branch_id }),
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
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
            <p>Nalezeno {invoices.length} zakázek</p>
          </div>
          <div className="items-panel-table-header"></div>

          <div className="items-panel-table-header five-columns">
            <h3>Datum</h3>
            <h3>Zákazník</h3>
            <h3>Poslední aktualizace</h3>
            <h3>Stav</h3>
            <h3>Platby</h3>
          </div>
          <div className="items-list">
                      {/* {!invoices.length > 0 && (
              <PuffLoaderSpinnerLarge
              active={
                searchLoading ||
                updateLoading ||
                putInLoading ||
                putInMultipleLoading
                }
                />
                )} */}
            {invoices.length > 0 &&
              invoices.map((invoice) => (
                <div key={invoice.id} className="item one-row five-columns">
                  <p>{new Date(invoice.created_at).toLocaleString('cs-CZ', { 
                    year: 'numeric', 
                    month: '2-digit', 
                    day: '2-digit', 
                    // hour: '2-digit', 
                    // minute: '2-digit' 
                  })}</p>
                  <h1>{`${invoice.name} ${invoice.surname}`}</h1>
                                    <p>{new Date(invoice.updated_at).toLocaleString('cs-CZ', { 
                    year: 'numeric', 
                    month: '2-digit', 
                    day: '2-digit', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}</p>
                  <p>{`${invoice.status}`} </p>
                  <p>{`${invoice.total_amount} Kč / ${invoice.paid_amount} Kč`}</p>
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
