import React, { useEffect, useState, useCallback } from "react";
import { useUser } from "../../context/UserContext";
import PuffLoaderSpinner from "../../components/loader/PuffLoaderSpinner.jsx";

function AgendaContacts() {
  const [inputSearch, setInputSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [hoveredClientId, setHoveredClientId] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const { user } = useUser();

  const handleClientSale = () => {};
  const handleClientOrder = () => {};

  const loadContacts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/agenda/contacts-search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          organization_id: user?.organization_id,
          value: "",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setContacts(data);
        setFilteredContacts(data);
      } else {
        console.error("Error loading contacts:", data.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, user?.organization_id]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const handleSearchInContacts = () => {
    const query = inputSearch.trim().toLowerCase();

    if (!query) {
      setFilteredContacts(contacts);
      return;
    }

    const result = contacts.filter((contact) => {
      const company = `${contact?.company ?? ""}`.toLowerCase();
      const field = `${contact?.field ?? ""}`.toLowerCase();
      const regNumber = `${contact?.reg_number ?? ""}`.toLowerCase();
      const phone1 = `${contact?.phone1 ?? ""}`.toLowerCase();
      const phone2 = `${contact?.phone2 ?? ""}`.toLowerCase();
      const phone3 = `${contact?.phone3 ?? ""}`.toLowerCase();
      const street = `${contact?.street ?? ""}`.toLowerCase();
      const city = `${contact?.city ?? ""}`.toLowerCase();
      const postCode = `${contact?.post_code ?? ""}`.toLowerCase();

      return (
        company.includes(query) ||
        field.includes(query) ||
        regNumber.includes(query) ||
        phone1.includes(query) ||
        phone2.includes(query) ||
        phone3.includes(query) ||
        street.includes(query) ||
        city.includes(query) ||
        postCode.includes(query)
      );
    });

    setFilteredContacts(result);
  };

  const handleClearSearch = () => {
    setInputSearch("");
    setFilteredContacts(contacts);
  };

  const renderHighlightedText = (text) => {
    const value = `${text ?? ""}`;
    const query = inputSearch.trim();

    if (!query) {
      return value;
    }

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedQuery})`, "ig");
    const parts = value.split(regex);

    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={`${value}-${part}-${index}`}>{part}</mark>
      ) : (
        <React.Fragment key={`${value}-${part}-${index}`}>{part}</React.Fragment>
      ),
    );
  };

  const contactCount = Number.isFinite(filteredContacts?.length)
    ? filteredContacts.length
    : 0;
  const isFewContacts =
    contactCount >= 2 &&
    contactCount <= 4 &&
    !(contactCount >= 12 && contactCount <= 14);

  const foundVerb =
    contactCount === 1 ? "Nalezen" : isFewContacts ? "Nalezeny" : "Nalezeno";
  const contactNoun =
    contactCount === 1 ? "kontakt" : isFewContacts ? "kontakty" : "kontaktů";

  return (
    <div className="left-container">
      <div className="input-panel">
        <div className="search-input-container">
          <div className="search-input-wrapper">
            {inputSearch.trim() ? (
              <button
                type="button"
                className="search-clear-button"
                onClick={handleClearSearch}
                aria-label="Vymazat hledání"
                title="Vymazat"
              >
                ×
              </button>
            ) : null}
            <input
              className="client-search-input"
              type="text"
              value={inputSearch}
              onChange={(e) => setInputSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchInContacts();
                }
                if (e.key === "Escape") {
                  handleClearSearch();
                }
              }}
              placeholder="Zadej hledaný text"
            />
          </div>
          <button onClick={handleSearchInContacts}>Hledej</button>
        </div>
      </div>
      <div className="show-items-panel">
        <div className="items-panel-label">
          <h4>
            {foundVerb} {contactCount} {contactNoun}
          </h4>
        </div>
        <PuffLoaderSpinner active={isLoading} />
        {filteredContacts.length > 0 &&
          filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="cl-item"
              onMouseEnter={() => setHoveredClientId(contact.id)}
              onMouseLeave={() => setHoveredClientId(null)}
            >
              <h1>
                {renderHighlightedText(contact.company)} {renderHighlightedText(contact.field)}
              </h1>{" "}
              <p>registrační číslo {renderHighlightedText(contact.reg_number)}</p>
              <p>
                Tel1 {renderHighlightedText(contact.phone1)}, Tel2 {renderHighlightedText(contact.phone2)}, {contact.phone3 != null ? `Tel3 ${contact.phone3}` : ""}
              </p>
              <p>
                {renderHighlightedText(contact.street)} {renderHighlightedText(contact.city)} {renderHighlightedText(contact.post_code)} DB ID: {contact.id}
              </p>
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
