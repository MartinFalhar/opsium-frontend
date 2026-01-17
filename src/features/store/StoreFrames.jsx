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
      handleSearchInStore();
    }
  }, [user?.branch_id]);

  useEffect(() => {
    handleSearchInStore(inputSearch);
  }, [page]);

  const handleSearchInStore = async (values) => {
    setIsLoading(true);

    const loadItems = async () => {
      try {
        // Ošetření undefined hodnoty pro value parametr
        const searchValue = values || "";
        const res = await fetch(
          `${API_URL}/store/search?store=1&page=${page}&limit=${limit}&value=${searchValue}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          },
        );
        const data = await res.json();

        if (res.ok) {
          window.showToast("Úspěšně načteno");
          setItems(data.items);
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
            className="search-input-container"
            type="text"
            value={inputSearch}
            onChange={(e) => setInputSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchInStore(inputSearch);
              }
            }}
            placeholder="Zadej hledaný text"
          />
          <button onClick={() => handleSearchInStore(inputSearch)}>
            Vyhledat
          </button>
        </div>

        <div className="show-items-panel">
          <div className="items-panel-label">
            <h2>Brýlové obruby</h2>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
            <p>
              Položek: {items.length} ks (strana {page}/{totalPages})
            </p>
          </div>
          <div className="items-panel-header-services">
            <h3>PLU</h3>
          </div>
          <div className="items-list">
            {!items.length > 0 && <PuffLoaderSpinnerLarge active={isLoading} />}

            {items.length > 0 &&
              items.map((item) => (
                <div
                  key={item.id}
                  className="item"
                  onMouseEnter={() => setHoveredItemId(item.id)}
                  onMouseLeave={() => setHoveredItemId(null)}
                >
                  <div className="item-header">
                    <div className="item-plu">{item.plu}</div>
                    <div className="item-name">
                      <h1>{item.product}</h1>
                    </div>
                    <h1>{` ${item.collection}, ${item.color}`}</h1>
                    <p>s</p>
                  </div>
                  <div className="item-note">
                    <div className="item.supplier">
                      <p>{`${item.supplier} ${item.quantity}ks ${item.price} Kč DB ID: ${item.id}`}</p>
                    </div>
                    <div className="item.category">
                      <p>{`Materiál: ${item.material} Gender: ${item.gender} Typ: ${item.type}`}</p>
                    </div>
                  </div>
                  {hoveredItemId === item.id && (
                    <div className="item-actions">
                      {/* <button onClick={() => handleItemChange(item)}>
                        UPRAVIT
                      </button>
                      <button onClick={() => handleItemDelete(item)}>
                        SMAZAT
                      </button> */}
                    </div>
                  )}
                </div>
              ))}
          </div>
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
