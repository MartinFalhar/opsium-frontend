import React from "react";
import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import Pagination from "../../components/pagination/Pagination.jsx";
import Modal from "../../components/modal/Modal.jsx";
import PuffLoaderSpinnerLarge from "../../components/loader/PuffLoaderSpinnerLarge.jsx";

const API_URL = import.meta.env.VITE_API_URL;

function StoreFrames({ client }) {
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
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [inputSearch, setInputSearch] = useState("");
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const { user, vat } = useUser();
  const [hoveredItemId, setHoveredItemId] = useState(null);

  //PAGINATION HOOKS
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  // Načtení dat při prvním načtení komponenty
  useEffect(() => {
    if (user?.branch_id) {
      handleSearchInCatalog();
    }
  }, [user?.branch_id]);

  useEffect(() => {
    handleSearchInStore(searchInStore);
  }, [page]);

  const handleSearchInStore = async (values) => {
    setIsLoading(true);
    const searchData = {
      id_branch: user.branch_id,
      query: values,
      page: page,
      limit: limit,
      offset: (page - 1) * limit,
      table: "store_frames",
    };

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
    <div className="container">
      <div className="left-container-2">
        <div className="input-panel">
          <input
            className="client-search-input"
            type="text"
            value={inputSearch}
            onChange={(e) => setInputSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchInCatalog(inputSearch);
              }
            }}
            placeholder="Zadej hledaný text"
          />
          <button onClick={() => handleSearchInCatalog(inputSearch)}>
            Vyhledat
          </button>
        </div>
        <div
          className="show-items-panel"
          style={{
            overflowY: "scroll",
          }}
        >
          <h5>Roztoky a kapky</h5>
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />

          <div className="store-list-container">
            <div className="store-list-header">
              <div className="store-info-box">
                <h2>STORE EXTERNAL MODULE</h2>
              </div>
              <h1>Zobrazeno položek: {clients.length} ks</h1>
              <h1>
                Položek (strana {page}/{totalPages})
              </h1>
            </div>

            {!clients.length > 0 && (
              <PuffLoaderSpinnerLarge active={isLoading} />
            )}
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
          {items.length > 0 &&
            items.map((item) => (
              <div
                key={item.id}
                className="cl-item"
                onMouseEnter={() => setHoveredItemId(item.id)}
                onMouseLeave={() => setHoveredItemId(null)}
              >
                <h1>
                  {`${item.plu} ${item.name} ${item.amount}, ${item.uom}`}{" "}
                </h1>
                <p>{`${item.price} ${item.vat_type} ${item.description} DB ID: ${item.id}`}</p>
                {hoveredItemId === item.id && (
                  <div className="item-actions">
                    <button onClick={() => handleItemChange(item)}>
                      UPRAVIT
                    </button>
                    <button onClick={() => handleItemDelete(item)}>
                      SMAZAT
                    </button>
                  </div>
                )}
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
    </div>
  );
}

export default StoreFrames;
