import React, { useEffect } from "react";
import { useState } from "react";
import "./Store.css";
import Modal from "../../components/modal/Modal.jsx";
import PuffLoaderSpinnerLarge from "../../components/loader/PuffLoaderSpinnerLarge.jsx";
import Pagination from "../../components/pagination/Pagination.jsx";

const API_URL = import.meta.env.VITE_API_URL;

function Store() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fields = [
    {
      varName: "degree_front",
      label: "Titul před",
      input: "text",
      required: false,
    },
    { varName: "name", label: "Jméno", input: "text", required: true },
    { varName: "surname", label: "Příjmení", input: "text", required: true },
    {
      varName: "degree_post",
      label: "Titul za",
      input: "text",
      required: false,
    },
    {
      varName: "birth_date",
      label: "Datum narození",
      input: "date",
      required: true,
    },
  ];

  const [searchInStore, setSearchInStore] = useState("");
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  //PAGINATION HOOKS
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  useEffect(() => {
    handleSearchInStore(searchInStore);
  }, [page]);

  const handleSearchInStore = async (values) => {
    setIsLoading(true);
    const loadItems = async () => {
      try {
        const res = await fetch(
          `${API_URL}/store/search?page=${page}&limit=${limit}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ searchText: values }),
          }
        );
        const data = await res.json();

        if (res.ok) {
          setClients(data.items);
          setTotalPages(data.totalPages);
          setIsLoading(false);
        } else {
          setError(data.message);
          console.error("Error loading items:", error);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Nepodařilo se načíst klienty.");
      }
    };
    loadItems();
  };

  return (
    <div className="clients-container">
      <div className="store-left-column">
        <div className="button-group">
          <button onClick={() => setShowModal(true)}>Přidat položku</button>
        </div>
        <div className="clients-search-container">
          <div className="client-search">
            <input
              className="client-search-input"
              type="text"
              value={searchInStore}
              onChange={(e) => setSearchInStore(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchInStore(searchInStore);
                }
              }}
              placeholder="Hledej klienta"
            />
            <button
              type="submit"
              onClick={() => handleSearchInStore(searchInStore)}
            >
              Hledej
            </button>
          </div>
        </div>
        <div className="store-list-container">
          <div className="store-list-header">
            <div className="store-info-box">
              <h2>STORE EXTERNAL MODULE</h2>
            </div>
            <h1>Zobrazeno položek: {clients.length} ks</h1>
            <h1>
              Klienti (strana {page}/{totalPages})
            </h1>
          </div>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
          {!clients.length > 0 && <PuffLoaderSpinnerLarge active={isLoading} />}
          {clients.length > 0 &&
            clients.map((client) => (
              <div key={client.id} className="client-item">
                <h1>
                  {`${client.ean} ${client.product} ${client.collection} ${client.color}`}{" "}
                </h1>
                <p>{`${client.supplier} ${client.quantity}ks ${client.price} Kč`}</p>
              </div>
            ))}
        </div>
      </div>
      <div>
        {showModal && (
          <Modal
            fields={fields}
            onSubmit={handleSubmit}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
      <div className="clients-right-column">
        <h1>Filtry</h1>
      </div>
    </div>
  );
}

export default Store;
