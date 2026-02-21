import React from "react";
import { useEffect, useState } from "react";
import "./Clients.css";
import Modal from "../../components/modal/Modal.jsx";
import { useNavigate, Navigate } from "react-router-dom";

import { useUser } from "../../context/UserContext";
import { useClientCreate } from "../../hooks/useClientCreate.js";

const API_URL = import.meta.env.VITE_API_URL;

function Clients() {
  //Z JSON formátu, který nám přijde z backendu, uděláme hezky čitelný řetězec pro zobrazení kontaktů klienta
  const formatContactValue = (value) => {
    if (value === null || value === undefined || value === "") return "—";
    if (Array.isArray(value)) {
      return value.filter(Boolean).join(", ") || "—";
    }
    if (typeof value === "object") {
      return (
        Object.entries(value)
          .filter(([, itemValue]) => itemValue !== null && itemValue !== "")
          // .map(([key, itemValue]) => `${key}: ${itemValue}`)
          .map(([key, itemValue]) => `${itemValue}`)
          .join(", ") || "—"
      );
    }

    return String(value);
  };

  const fields = [
    {
      varName: "degree_before",
      label: "Titul před",
      input: "text",
      required: false,
    },
    { varName: "name", label: "Jméno", input: "text", required: true },
    { varName: "surname", label: "Příjmení", input: "text", required: true },
    {
      varName: "degree_after",
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

  const { user, setHeaderClients } = useUser();
  const [error, setError] = useState(null);
  const [searchClient, setSearchClient] = useState("");
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { createClient } = useClientCreate();

  const addClient = (newClient) => {
    setHeaderClients((prev) => {
      const exists = prev.some((client) => client.id === newClient.id);
      if (exists) return prev;
      return [
        ...prev,
        {
          ...newClient,
          activeSecondaryButton: null,
          activeTertiaryButton: null,
        },
      ];
    });

    navigate(`/client/${newClient.id}`);
  };

  useEffect(() => {
    const loadClients = async () => {
      try {
        const res = await fetch(`${API_URL}/client/clients_list`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
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
    };
    loadClients();
  }, []);

  const handleSubmit = async (values) => {
    const newClient = {
      degree_before: values.degree_before,
      name: values.name,
      surname: values.surname,
      degree_after: values.degree_after,
      birth_date: values.birth_date,
      organization_id: user.organization_id,
    };
    console.log("New client to add:", newClient);

    try {
      await createClient(newClient);
      alert("Úspěšně odesláno!");
    } catch (err) {
      console.error(err);
      alert("Server je nedostupný.");
    }
  };

  return (
    <div className="container">
      <div className="left-container-2">
        <div className="input-panel">
          <input
            className="search-input-container"
            type="text"
            value={searchClient}
            onChange={(e) => setSearchClient(e.target.value)}
            placeholder="Hledej klienta"
          />
          <button type="submit">Hledej</button>
          <button onClick={() => setShowModal(true)}>Přidat klienta</button>
        </div>
        <div className="show-items-panel">
          <div className="items-panel-label">
            <h1>Nalezeno {clients.length} klientů</h1>
          </div>
          <div className="items-panel-table-header five-columns">
            <h3>ID</h3>
            <h3>Jméno / Adresa</h3>
            <h3>Telefon</h3>
            <h3>Email</h3>
            <h3>Zakázka</h3>
          </div>
          <div className="items-list">
            {clients.length > 0 &&
              clients.map((client) => (
                <div
                  key={client.id}
                  className="item five-columns"
                  onClick={() => addClient(client)}
                >
                  <div className="item-plu">
                    <h1>{`${client.id}`}</h1>
                  </div>
                  <div className="item-name">
                    <h1>
                      {`${client.degree_before} ${client.name} ${client.surname}, ${client.degree_after}`}{" "}
                    </h1>
                  </div>
                  <div className="item-name">
                    <p
                      style={{
                        fontSize: "14px",
                      }}
                    >
                      {formatContactValue(client.phone)}
                    </p>
                  </div>
                  <div className="item-name">
                    <p
                      style={{
                        fontSize: "14px",
                      }}
                    >
                      {formatContactValue(client.email)}
                    </p>
                  </div>
                  <div className="item-amount">číslo zakázky</div>

                  <div className="item-name">
                    <p>
                      {`${client.street}, ${client.city}, ${client.post_code}`}{" "}
                    </p>
                  </div>
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
            firstButton={"Přidat klienta"}
            secondButton={"Zrušit"}
            thirdButton={null}
          />
        )}
      </div>
    </div>
  );
}

export default Clients;
