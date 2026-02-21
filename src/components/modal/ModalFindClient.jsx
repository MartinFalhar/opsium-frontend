import React, { useEffect, useMemo, useState } from "react";
import { useOrdersFindClient } from "../../hooks/useOrdersFindClient.js";
import { useClientCreate } from "../../hooks/useClientCreate.js";
import { useUser } from "../../context/UserContext";
import Modal from "./Modal.jsx";
import "./Modal.css";

export default function ModalFindClient({ onClose, onCancel, onClientSelected }) {
  const [surname, setSurname] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showCreateClientModal, setShowCreateClientModal] = useState(false);
  const { user } = useUser();
  const { findClient, error } = useOrdersFindClient();
  const { createClient, loading: creatingClient, error: createClientError } =
    useClientCreate();

  const createClientFields = [
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
    { varName: "email", label: "Email", input: "email", required: false },
    { varName: "phone", label: "Telefon", input: "text", required: false },
  ];

  const hasSuggestions = useMemo(
    () => showPreview && suggestions.length > 0,
    [showPreview, suggestions.length],
  );

  const formatFullName = (client) => {
    return [
      client?.degree_before,
      client?.name,
      client?.surname,
      client?.degree_after,
    ]
      .filter((part) => part && String(part).trim())
      .join(" ");
  };

  const formatAddress = (client) => {
    const parts = [client?.street, client?.city, client?.post_code].filter(
      (part) => part && String(part).trim(),
    );
    return parts.length > 0 ? parts.join(", ") : "Adresa není uvedena";
  };

  const getBirthYear = (client) => {
    const date = new Date(client?.birth_date);
    if (Number.isNaN(date.getTime())) {
      return "-";
    }
    return date.getFullYear();
  };

  const mapClientForOrder = (client) => ({
    id: client?.id ?? "",
    name: client?.name ?? "",
    surname: client?.surname ?? "",
    degree_before: client?.degree_before ?? "",
    degree_after: client?.degree_after ?? "",
    email: client?.email ?? "",
    phone: client?.phone ?? "",
    street: client?.street ?? "",
    city: client?.city ?? "",
    post_code: client?.post_code ?? "",
  });

  const selectClient = (client) => {
    setSelectedClient(client);
    setSurname(formatFullName(client));
    setShowPreview(false);

    if (typeof onClientSelected === "function") {
      onClientSelected(mapClientForOrder(client));
    }
  };

  useEffect(() => {
    const query = surname.trim();

    if (!query) {
      setSuggestions([]);
      setHighlightedIndex(-1);
      setShowPreview(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        const data = await findClient({ surname: query });
        const clients = Array.isArray(data?.clients) ? data.clients.slice(0, 5) : [];
        setSuggestions(clients);
        setHighlightedIndex(clients.length > 0 ? 0 : -1);
        setShowPreview(true);
      } catch {
        setSuggestions([]);
        setHighlightedIndex(-1);
        setShowPreview(false);
      }
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [surname, findClient]);

  const handleClose = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  const handleCreateClient = async (values) => {
    const newClient = {
      degree_before: values.degree_before,
      name: values.name,
      surname: values.surname,
      degree_after: values.degree_after,
      birth_date: values.birth_date,
      email: values.email,
      phone: values.phone,
      organization_id: user.organization_id,
    };

    try {
      const createdClient = await createClient(newClient);

      const clientForOrder = mapClientForOrder({
        ...newClient,
        id: createdClient?.id ?? "",
      });

      setSelectedClient(clientForOrder);
      setSurname(formatFullName(clientForOrder));
      setShowCreateClientModal(false);

      if (typeof onClientSelected === "function") {
        onClientSelected(clientForOrder);
      }

      window.showToast("Klient byl úspěšně vytvořen.");
    } catch (err) {
      console.error(err);
      alert("Server je nedostupný.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!surname.trim()) {
      return;
    }

    try {
      const data = await findClient({ surname: surname.trim() });
      const clients = Array.isArray(data?.clients) ? data.clients.slice(0, 5) : [];
      setSuggestions(clients);
      setHighlightedIndex(clients.length > 0 ? 0 : -1);
      setShowPreview(true);
    } catch {
      setSuggestions([]);
      setHighlightedIndex(-1);
      setShowPreview(false);
    }
  };

  const handleKeyDown = (e) => {
    if (!hasSuggestions) {
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0,
      );
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1,
      );
      return;
    }

    if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      selectClient(suggestions[highlightedIndex]);
      return;
    }

    if (e.key === "Escape") {
      setShowPreview(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Vytvoření nové zakázky</h2>
        <form onSubmit={handleSubmit}>
          <div className="modal-content">
            <div className="modal-field">
              <label>Zadejte příjmení nebo číslo věrnostní karty již existujícího klienta</label>
              <input
                type="text"
                value={surname}
                onChange={(e) => {
                  setSurname(e.target.value);
                  setSelectedClient(null);
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowPreview(true)}
                onBlur={() => {
                  setTimeout(() => setShowPreview(false), 120);
                }}
                required
                autoFocus
              />

              {hasSuggestions && (
                <div className="modal-client-preview" role="listbox">
                  {suggestions.map((client, index) => (
                    <div
                      key={`${client.id}-${index}`}
                      role="option"
                      aria-selected={index === highlightedIndex}
                      className={`modal-client-preview-item ${
                        index === highlightedIndex ? "active" : ""
                      }`}
                      onMouseDown={() => selectClient(client)}
                    >
                      <p className="modal-client-preview-name">
                        {formatFullName(client)}
                      </p>
                      <p>{formatAddress(client)}</p>
                      <p>Rok narození: {getBirthYear(client)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedClient && (
              <div className="modal-selected-client">
                <h3>Vybraný klient</h3>
                <p>{formatFullName(selectedClient)}</p>
                <p>{formatAddress(selectedClient)}</p>
                <p>Rok narození: {getBirthYear(selectedClient)}</p>
              </div>
            )}

            {error && <p>{error}</p>}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={handleClose}>
              Zavřít
            </button>
            <button
              type="button"
              onClick={() => setShowCreateClientModal(true)}
              disabled={creatingClient}
            >
              {creatingClient ? "Zakládám..." : "Nový klient"}
            </button>
          </div>
        </form>

        {showCreateClientModal && (
          <Modal
            fields={createClientFields}
            onSubmit={handleCreateClient}
            onClose={() => setShowCreateClientModal(false)}
            onCancel={() => setShowCreateClientModal(false)}
            firstButton={"Přidat klienta"}
            secondButton={"Zrušit"}
            thirdButton={null}
          />
        )}

        {createClientError && <p>{createClientError}</p>}
      </div>
    </div>
  );
}
