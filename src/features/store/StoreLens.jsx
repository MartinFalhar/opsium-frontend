import React from "react";
import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";

const API_URL = import.meta.env.VITE_API_URL;

function StoreLens({ client }) {
  const [inputSearch, setInputSearch] = useState("");
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const { user, vat } = useUser();
  const [hoveredItemId, setHoveredItemId] = useState(null);

  // Načtení dat při prvním načtení komponenty
  useEffect(() => {
    if (user?.branch_id) {
      handleSearchFrames();
    }
  }, [user?.branch_id]);

  const handleSearchFrames = async () => {
    const searchData = {
      id_branch: user.branch_id,
      query: inputSearch,
      page: 1,
      limit: 20,
      offset: 0,
      table: "store_frames",
    };
    try {
      const res = await fetch(`${API_URL}/store/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(searchData),
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
                handleSearchFrames(inputSearch);
              }
            }}
            placeholder="Zadej hledaný text"
          />
          <button onClick={() => handleSearchFrames(inputSearch)}>
            Vyhledat
          </button>
        </div>
        <div
          className="show-items-panel"
          style={{
            overflowY: "scroll",
          }}
        >
          <h5>Brýlové obruby</h5>
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

export default StoreLens;
