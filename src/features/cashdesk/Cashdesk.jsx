import React from "react";
import { useState } from "react";
import "./Cashdesk.css";
import SegmentedControl from "../../components/controls/SegmentedControl.jsx";
import { useUser } from "../../context/UserContext";
import { useEffect } from "react";


const API_URL = import.meta.env.VITE_API_URL;

function Cashdesk() {
  const timeRange = ["Dnes", "Včera", "3 dny", "Týden", "Měsíc"];
  const paymentMethod = ["Hotovost", "Karta", "Převod", "Šeky"];

  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange[0]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    paymentMethod[0]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [inputSearch, setInputSearch] = useState("");
  const [clients, setClients] = useState([]);
  const [goods, setGoods] = useState([]);
  const [error, setError] = useState(null);
  const { user, vat } = useUser();

  const [hoveredClientId, setHoveredClientId] = useState(null);
  const [hoveredGoodId, setHoveredGoodId] = useState(null);

  

  //PAGINATION HOOKS
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;



  const handleSearchInStore = async () => {
    // SEARCH CLIENTS
    try {
      const res = await fetch(`${API_URL}/client/clients_list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ branch_id: user.branch_id }),
      });
      const data = await res.json();
      if (res.ok) {
        setClients(data);
      } else {
        setError(data.message);
        console.error("Error loading users:", error);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Nepodařilo se načíst klienty.");
    }
    // SEARCH GOODS

    try {
      const res = await fetch(
        `${API_URL}/store/search?page=${page}&limit=${limit}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ searchText: "BOOM" }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        setGoods(data.items);
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
                handleSearchInStore(inputSearch);
              }
            }}
            placeholder="Zadej hledaný text"
          />

          <div className="buttons-container">
            <button
              type="submit"
              onClick={() => handleSearchInStore(inputSearch)}
            >
              Hledej
            </button>
          </div>
        </div>
        <div
          className="show-items-panel"
          style={{
            overflowY: "scroll",
          }}
        >
          <h5>Zboží</h5>
          {goods.length > 0 &&
            goods.map((good) => (
              <div
                key={good.id}
                className="cl-item"
                onMouseEnter={() => setHoveredGoodId(good.id)}
                onMouseLeave={() => setHoveredGoodId(null)}
              >
                <h1>
                  {`${good.ean} ${good.product} ${good.collection} ${good.color}`}{" "}
                </h1>
                <p>{`${good.supplier} ${good.quantity}ks ${good.price} Kč`}</p>
                {hoveredGoodId === good.id && (
                  <div className="item-actions">
                    <button onClick={() => handleGoodSale(good)}>PRODEJ</button>
                    <button onClick={() => handleGoodOrder(good)}>
                      ZAKÁZKA
                    </button>
                  </div>
                )}
              </div>
            ))}
          <h5>Klienti</h5>
          {clients.length > 0 &&
            clients.map((client) => (
              <div
                key={client.id}
                className="cl-item"
                onMouseEnter={() => setHoveredClientId(client.id)}
                onMouseLeave={() => setHoveredClientId(null)}
              >
                <h1>
                  {`${client.degree_before} ${client.name} ${client.surname}, ${client.degree_after}`}{" "}
                </h1>
                <p>{`${client.street} ${client.city} ${client.post_code} DB ID: ${client.id}`}</p>
                {hoveredClientId === client.id && (
                  <div className="item-actions">
                    <button onClick={() => handleClientSale(client)}>
                      PRODEJ
                    </button>
                    <button onClick={() => handleClientOrder(client)}>
                      ZAKÁZKA
                    </button>
                  </div>
                )}
              </div>
            ))}
          <h5>Kombinace</h5>
        </div>
      </div>
      <div className="right-container-2">
        <div className="show-items-panel">
          <h1>POKLADNA</h1>
          <div className="segmented-control-item">
            <h5>Časový rozsah</h5>
            <SegmentedControl
              items={timeRange}
              selectedValue={selectedTimeRange}
              onClick={(item) => setSelectedTimeRange(item)}
            />
          </div>
          <div className="segmented-control-item">
            <h5>Platební metoda</h5>
            <SegmentedControl
              items={paymentMethod}
              selectedValue={selectedPaymentMethod}
              onClick={(item) => setSelectedPaymentMethod(item)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cashdesk;
