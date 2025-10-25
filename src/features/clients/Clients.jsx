import React from "react";
import { useEffect, useState } from "react";
import "./Clients.css";
import { useSetHeaderClients } from "../../context/UserContext";

const API_URL = import.meta.env.VITE_API_URL;

function Clients(props) {
  const [searchClient, setSearchClient] = useState("");

  const [clients, setClients] = useState([]);

  const { setHeaderClients } = useSetHeaderClients();

  const addClient = (newClient) => {
    setHeaderClients((prev) => {
      const exists = prev.some((client) => client.id === newClient.id);
      if (exists) return prev;
      return [...prev, newClient];
    });
  };

  useEffect(() => {
    const loadClients = async () => {
      const res = await fetch(`${API_URL}/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clients }),
      });
      const data = await res.json();
      if (res.ok) {
        setClients(data);
      } else {
        setError(data.message);
      }
    };
    loadClients();
  }, []);

  return (
    <div className="clients-container">
      <div className="clients-left-column">
        <div className="clients-search-container">
          <div className="client-search">
            <input
              className="client-search-input"
              type="text"
              value={searchClient}
              onChange={(e) => setSearchClient(e.target.value)}
              placeholder="Hledej klienta"
            />
            <button type="submit">
              Hledej
            </button>
            <div className="client-add">
              <button>Přidat klienta</button>
            </div>
          </div>
        </div>
        <div className="clients-list-container">
          <h1>Nalezeno {clients.length} klientů</h1>
          {clients.map((client) => (
            <div
              key={client.id}
              className="client-item"
              onClick={() => addClient(client)}
            >
              <h1>
                {`${client.degree_front} ${client.name} ${client.surname} ${client.degree_post}`}{" "}
              </h1>
              <p>{`${client.street} ${client.city} ${client.post_code}`}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="clients-right-column">
        <h1>Filtry</h1>
      </div>
    </div>
  );
}

export default Clients;
