import React, { useState, useEffect, useCallback } from "react";
import "./Admin.css";
import Modal from "../../components/modal/Modal.jsx";
import { useUser } from "../../context/UserContext.jsx";
import PuffLoaderSpinner from "../../components/loader/PuffLoaderSpinner.jsx";

const API_URL = import.meta.env.VITE_API_URL;

function AdminAccounts() {
  const { user } = useUser();
  const fields = [
    { varName: "name", label: "Jméno", input: "text", required: true },
    { varName: "surname", label: "Příjmení", input: "text", required: true },
    { varName: "email", label: "Email", input: "email", required: true },
    { varName: "password", label: "Heslo", input: "password", required: true },
    {
      varName: "passwordCheck",
      label: "Znovu heslo",
      input: "password",
      required: true,
    },
    {
      varName: "branch_name",
      label: "Název nové pobočky, která se bude tímto účtem spravovat",
      input: "text",
      required: true,
    },
    { varName: "street", label: "Ulice", input: "text", required: true },
    { varName: "city", label: "Město", input: "text", required: true },
    { varName: "postal_code", label: "PSČ", input: "text", required: true },
  ];

  const [searchClient, setSearchClient] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  //proměnné pro načtení users z DB
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/users_list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organization: user?.organization_id }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
        setFilteredUsers(data);
      } else {
        console.error("Error loading users:", data.message);
      }
    } catch (err) {
      console.error("Chyba při načítání:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.organization_id]);

  //načtení uživatelů z DB
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSubmit = async (values) => {
    if (values.password !== values.passwordCheck) {
      alert("Hesla se neshodují");
      return;
    }

    const newUser = {
      name: values.name,
      surname: values.surname,
      email: values.email,
      password: values.password,
      //zde je USER organization z CONTEXTu, což je organization ADMINA, který uživatele vytváří
      organization_id: user.organization_id,
      rights: 1,
      branch_name: values.branch_name,
      street: values.street,
      city: values.city,
      postal_code: values.postal_code,
    };
    try {
      const res = await fetch(`${API_URL}/admin/create_user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (res.ok) {
        window.showToast("Úspěšně odesláno!");
        await loadUsers();
        setShowModal(false);
      } else {
        window.showToast("Chyba při odesílání.");
      }
    } catch (error) {
      console.error(error);
      window.showToast("Server je nedostupný.");
    }
  };

  const handleSearchUsers = () => {
    const query = searchClient.trim().toLowerCase();

    if (!query) {
      setFilteredUsers(users);
      return;
    }

    const result = users.filter((item) => {
      const userName = `${item?.name ?? ""}`.toLowerCase();
      const userSurname = `${item?.surname ?? ""}`.toLowerCase();
      const userEmail = `${item?.email ?? ""}`.toLowerCase();

      return (
        userName.includes(query) ||
        userSurname.includes(query) ||
        userEmail.includes(query)
      );
    });

    setFilteredUsers(result);
  };

  const handleClearSearch = () => {
    setSearchClient("");
    setFilteredUsers(users);
  };

  const renderHighlightedText = (text) => {
    const value = `${text ?? ""}`;
    const query = searchClient.trim();

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

  const userCount = Number.isFinite(filteredUsers?.length)
    ? filteredUsers.length
    : 0;
  const isFewUsers =
    userCount >= 2 && userCount <= 4 && !(userCount >= 12 && userCount <= 14);

  const foundVerb =
    userCount === 1 ? "Nalezen" : isFewUsers ? "Nalezeni" : "Nalezeno";
  const userNoun =
    userCount === 1 ? "uživatel" : isFewUsers ? "uživatelé" : "uživatelů";

  return (
    <div className="container ">
      <div className="left-container-2">
        <div className="input-panel">
          <div className="search-input-container">
            <div className="search-input-wrapper">
              {searchClient.trim() ? (
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
                type="text"
                value={searchClient}
                onChange={(e) => setSearchClient(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchUsers();
                  }
                  if (e.key === "Escape") {
                    handleClearSearch();
                  }
                }}
                placeholder="Hledej uživatele"
              />
            </div>
            <button onClick={handleSearchUsers}>Hledej</button>
            <button onClick={() => setShowModal(true)}>Nový účet</button>
          </div>
        </div>

        <div className="show-items-panel">
          <div className="items-panel-label">
            <h4>
              {foundVerb} {userCount} {userNoun}
            </h4>
          </div>
          <PuffLoaderSpinner active={isLoading} />
          <div className="items-list">
            {filteredUsers?.length > 0 &&
              filteredUsers?.map((client) => (
                <div key={client.id} className="item" onClick={() => null}>
                  <h1>
                    {renderHighlightedText(client.name)} {renderHighlightedText(client.surname)} ({client.rights})
                  </h1>
                  <p>
                    Email: {renderHighlightedText(client.email)} | ID Organizace: {client.organization_id}
                  </p>
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
            onCancel={() => setShowModal(false)}
            secondButton={"Zrušit"}
            firstButton={"Uložit"}
          />
        )}
      </div>
    </div>
  );
}

export default AdminAccounts;
