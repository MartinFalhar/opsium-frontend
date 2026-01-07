import React from "react";
import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";

const API_URL = import.meta.env.VITE_API_URL;

function CatalogServices({ client }) {
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
    // SEARCH CLIENTS
    try {
      const res = await fetch(`${API_URL}/catalog/services-search`, {
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
        <div
          className="show-items-panel"
          style={{
            overflowY: "scroll",
          }}
        >
          <h5>Výkony a služby</h5>
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
    </div>
  );
}

export default CatalogServices
