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

  const categoryColorsGender = {
    Pánská: "var(--color-grd-g13)",
    Dámská: "var(--color-grd-g8)",
    Uni: "var(--color-grd-g9)",
    Dětská: "var(--color-grd-g10)",
  };
  const categoryColorsMaterial = {
    plastová: "var(--color-grd-g13)",
    kovová: "var(--color-grd-g8)",
    "kovová s klipem": "var(--color-grd-g9)",
    "ultem s klipem": "var(--color-grd-g10)",
  };
  const categoryColorsType = {
    Dioptrická: "var(--color-grd-g13)",
  };

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
          <div className="items-panel-table-header six-columns">
            <h3>PLU</h3>
            <h3>Model obruby</h3>
            <h3>Barva</h3>
            <h3>Dodavatel</h3>
            <h3>Množství (ks)</h3>
            <h3>Cena</h3>
          </div>

          <div className="items-list">
            {!items.length > 0 && <PuffLoaderSpinnerLarge active={isLoading} />}

            {items.length > 0 &&
              items.map((item) => (
                <div
                  key={item.id}
                  className="item six-columns"
                  onMouseEnter={() => setHoveredItemId(item.id)}
                  onMouseLeave={() => setHoveredItemId(null)}
                >
                  <div className="item-plu">{item.plu}</div>

                  <div className="item-name">
                    <h1>{`${item.collection} ${item.product}`}</h1>
                  </div>
                  <div className="item-name">
                    <h1>{`${item.color}`}</h1>
                  </div>
                  <div className="item-name">
                    <h1>{`${item.supplier}`}</h1>
                  </div>
                  <div className="item-name">
                    <h1>{`${item.quantity}`}</h1>
                  </div>
                  <div className="item-name">
                    <h1>{`${Math.round(item.price)} Kč`}</h1>
                  </div>
                  <div className="item-note">
                    {item.note && (
                      <div
                        className="item-category"
                        style={{
                          background: "var(--color-grd-g5)",
                        }}
                      >{`Poznámka`}</div>
                    )}
                    <div
                      className="item-category"
                      style={{
                        background:
                          categoryColorsGender[item.gender] || "#95a5a6",
                      }}
                    >{`${item.gender}`}</div>
                    {item.size && (
                      <div
                        className="item-category"
                        style={{
                          background: "var(--color-grd-g12)",
                        }}
                      >{`${item.size}`}</div>
                    )}
                    <div
                      className="item-category"
                      style={{
                        background:
                          categoryColorsMaterial[item.material] || "#95a5a6",
                      }}
                    >{`${item.material}`}</div>
                    {item.type && (
                      <div
                        className="item-category"
                        style={{
                          background:
                            categoryColorsType[item.type] || "#95a5a6",
                        }}
                      >{`${item.type}`}</div>
                    )}
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
