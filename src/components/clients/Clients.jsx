import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Clients.css";

const API_URL = import.meta.env.VITE_API_URL;

function Clients(props) {
  const [clients, setClients] = useState([]);
  const [searchClient, setSearchClient] = useState("");

  useEffect(() => {
    const loadClients = async () => {
      console.log("Loading clients...");
      const res = await fetch(`${API_URL}/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clients }),
      });
      const data = await res.json();
      if (res.ok) {
        setClients(data);
        console.log("Clients data:", data);
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
          <h1>Najdi klienta</h1>
          <div className="client-search">
            <input
              type="text"
              value={searchClient}
              onChange={(e) => setSearchClient(e.target.value)}
              placeholder="Hledej klienta"
            />
            <button type="submit" style={{ marginTop: "30px" }}>
              Hledej
            </button>
          </div>
          <div className="client-add">
            <button>Přidat klienta</button>
          </div>
        </div>
        <div className="clients-list-container">
          Seznam klientů
          {clients.map((client) => (
            <div key={client.id} className="client-item">
              <h2>
                {`${client.degree_front} ${client.name} ${client.surname} ${client.degree_post}`}{" "}
              </h2>
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
