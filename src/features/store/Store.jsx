import React from "react";
import { useEffect, useState } from "react";
import "./Store.css";
import Modal from "../../components/modal/Modal.jsx";

import { useUser } from "../../context/UserContext";
import PuffLoaderSpinnerLarge from "../../components/loader/PuffLoaderSpinnerLarge.jsx";

const API_URL = import.meta.env.VITE_API_URL;

function Store() {
  const { user, setHeaderClients } = useUser();
  const [error, setError] = useState(null);
   const [isLoading, setIsLoading] = useState(false);

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

    const [searchClient, setSearchClient] = useState("");



  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const addClient = (newClient) => {
    setHeaderClients((prev) => {
      const exists = prev.some((client) => client.id === newClient.id);
      if (exists) return prev;
      return [...prev, newClient];
    });
  };

  useEffect(() => {
       setIsLoading(true);
    const loadClients = async () => {
      try {
        const res = await fetch(`${API_URL}/client/clients`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
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
    console.log(user.id);
    loadClients();
  }, []);

  const handleSubmit = async (values) => {
    const newClient = {
      degree_front: values.degree_front,
      name: values.name,
      surname: values.surname,
      degree_post: values.degree_post,
      birth_date: values.birth_date,
      id_user: user.id,
    };
    console.log("New client to add:", newClient);

    try {
      const res = await fetch(`${API_URL}/client/create_client`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClient),
      });

      if (res.ok) {
        alert("Úspěšně odesláno!");
      } else {
        alert("Chyba při odesílání.");
      }
    } catch (error) {
      console.error(error);
      alert("Server je nedostupný.");
    }
  };

  return (
    <div className="clients-container">
      <div className="clients-left-column">
        <div className="button-group">
          <button onClick={() => setShowModal(true)}>Přidat klienta</button>
        </div>
        <div className="clients-search-container">
          <div className="client-search">
            <input
              className="client-search-input"
              type="text"
              value={searchClient}
              onChange={(e) => setSearchClient(e.target.value)}
              placeholder="Hledej klienta"
            />
            <button type="submit">Hledej</button>
          </div>
        </div>
        <div className="clients-list-container">
          <h1>Nalezeno {clients.length} klientů</h1>
          {clients.length > 0 && clients.map((client) => (
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
        <div className="info-box">
            <h2>STORE EXTERNAL MODULE</h2>
        </div>
                <PuffLoaderSpinnerLarge active={isLoading} />
      </div>{" "}
      <div>
        {showModal && (
          <Modal
            fields={fields}
            onSubmit={handleSubmit}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
      <div className="clients-right-column">
        <h1>Filtry</h1>
      </div>
    </div>
  );
}

export default Store;
