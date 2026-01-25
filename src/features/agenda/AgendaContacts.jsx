import React, { useState } from "react";
import { useUser } from "../../context/UserContext";

function AgendaContacts() {
  const [inputSearch, setInputSearch] = useState("");
  const [error, setError] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [hoveredClientId, setHoveredClientId] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const { user } = useUser();

  const handleSearchInContacts = async () => {
    // SEARCH CONTACTS
    try {
      const res = await fetch(`${API_URL}/agenda/contacts-search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organization_id: user.organization_id,
          value: inputSearch,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setContacts(data);
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
    <div className="left-container">
      <div className="input-panel">
        <input
          className="client-search-input"
          type="text"
          value={inputSearch}
          onChange={(e) => setInputSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearchInContacts(inputSearch);
            }
          }}
          placeholder="Zadej hledaný text"
        />
      </div>
      <div className="show-items-panel">
        <h1>Nalezené položky</h1>
        {contacts.length > 0 &&
          contacts.map((contact) => (
            <div
              key={contact.id}
              className="cl-item"
              onMouseEnter={() => setHoveredClientId(contact.id)}
              onMouseLeave={() => setHoveredClientId(null)}
            >
              <h1>{`${contact.company} ${contact.field}`} </h1>{" "}
              <p>{`registrační číslo ${contact.reg_number}`}</p>
              {`Tel1 ${contact.phone1}, Tel2 ${contact.phone1}, ${contact.phone3 != null ? `Tel3 ${contact.phone3}`:""}`}{" "}
              <p>{`${contact.street} ${contact.city} ${contact.post_code} DB ID: ${contact.id}`}</p>
              {hoveredClientId === contact.id && (
                <div className="item-actions">
                  <button onClick={() => handleClientSale(contact)}>
                    ZMĚNIT
                  </button>
                  <button onClick={() => handleClientOrder(contact)}>
                    POZDRAVIT
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default AgendaContacts;
