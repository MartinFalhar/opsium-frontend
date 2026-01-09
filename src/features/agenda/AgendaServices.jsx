import React from "react";
import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";

const API_URL = import.meta.env.VITE_API_URL;

function AgendaServices({ client }) {
  const [inputSearch, setInputSearch] = useState("");
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const { user, vat } = useUser();
  const [hoveredItemId, setHoveredItemId] = useState(null);

  // Načtení dat při prvním načtení komponenty
  useEffect(() => {
    if (user?.branch_id) {
      handleSearchInCatalog();
    }
  }, [user?.branch_id]);

  const handleSearchInCatalog = async () => {
    // SEARCH SERVICES IN AGENDA
    try {
      const res = await fetch(`${API_URL}/agenda/services-search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_branch: user.branch_id }),
      });
      const data = await res.json();

      if (res.ok) {
        setItems(data);
      } else {
        setError(data.message);
        console.error("Error loading users:", error);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Nepodařilo se načíst klienty.");
    }
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
        <div className="show-items-panel">
          <div className="items-panel-label">
            <h2>Výkony a služby</h2>
            <p>Nalezeno {items.length} položek</p>
          </div>
          <div className="items-panel-header-services">
            <p>PLU</p>
            <p>Název služby</p>
            <p>Množství</p>
            <p>Cena s DPH</p>
          </div>
          <div className="items-list">
            {items.length === 0 && <p>Žádné položky k zobrazení</p>}
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
                      <h1>{`${item.name}`}</h1>
                    </div>
                    <div className="item-amount">{`${item.amount} ${item.uom}`}</div>

                    <div className="item-price-vat">
                      <h2>{`${Math.round(item.price)} Kč`}</h2>
                      <p>{`DPH ${Math.round(vat[item.vat_type].rate)}% `}</p>
                    </div>
                  </div>
                  <div className="item-body">
                    <p></p>

                    <p>{`${item.note}`}</p>
                  </div>

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
      </div>
    </div>
  );
}

export default AgendaServices;
