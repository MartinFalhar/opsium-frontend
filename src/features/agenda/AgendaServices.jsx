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
    console.log("Searching services in agenda catalog...");
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
        <div
          className="show-items-panel"
          style={{
            overflowY: "scroll",
          }}
        >
          <div className="items-panel-label">
            <h3>Výkony a služby</h3>
            <p>Nalezeno {items.length} položek</p>
          </div>

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
                  <div className="plu">{item.plu}</div>
                  <div className="item-name">
                    <h1>{`${item.name}`}</h1>
                  </div>
                  <div>{`${item.amount} ${item.uom}`}</div>
                  <div>
                    {console.log("User VAT data:", user?.vat)}
                    <h2>{`${Math.round(item.price)} Kč`}</h2>
                    {/* {`${item.amount} ${item.uom} ${Math.round(item.price)} Kč ${user?.vat[item.vat_type].rate}% DPH`} */}
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
  );
}

export default AgendaServices;
