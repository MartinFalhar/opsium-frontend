import React, { useState, useEffect, useCallback } from "react";
import "./Superadmin.css";
import Modal from "../../components/modal/Modal.jsx";
import PuffLoaderSpinner from "../../components/loader/PuffLoaderSpinner.jsx";

const API_URL = import.meta.env.VITE_API_URL;

function SuperadminAdminPanel() {
  const createFields = [
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
  ];
  const editFields = [
    { varName: "name", label: "Jméno", input: "text", required: true },
    { varName: "surname", label: "Příjmení", input: "text", required: true },
    { varName: "email", label: "Email", input: "email", required: true },
    {
      varName: "oldPassword",
      label: "Staré heslo",
      input: "password",
      required: false,
    },
    {
      varName: "newPassword",
      label: "Nové heslo",
      input: "password",
      required: false,
    },
    {
      varName: "newPasswordCheck",
      label: "Znovu nové heslo",
      input: "password",
      required: false,
    },
  ];

  const [searchClient, setSearchClient] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  //proměnné pro načtení adminů z DB
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/admin_list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
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
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSubmit = async (values) => {
    try {
      if (selectedUser?.id) {
        const hasAnyPasswordField =
          values.oldPassword || values.newPassword || values.newPasswordCheck;

        if (hasAnyPasswordField) {
          if (
            !values.oldPassword ||
            !values.newPassword ||
            !values.newPasswordCheck
          ) {
            alert("Pro změnu hesla vyplň staré heslo, nové heslo i potvrzení.");
            return;
          }

          if (values.newPassword !== values.newPasswordCheck) {
            alert("Nová hesla se neshodují");
            return;
          }
        }

        const userPayload = {
          id: selectedUser.id,
          name: values.name,
          surname: values.surname,
          email: values.email,
          organization_id: selectedUser.organization_id,
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        };

        const res = await fetch(`${API_URL}/admin/update_user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userPayload),
        });

        const data = await res.json().catch(() => null);

        if (res.ok) {
          window.showToast("Admin byl úspěšně upraven!");
          await loadUsers();
          handleCloseModal();
        } else {
          window.showToast(data?.message || "Chyba při odesílání.");
        }

        return;
      }

      if (values.password !== values.passwordCheck) {
        alert("Hesla se neshodují");
        return;
      }

      const newAdmin = {
        name: values.name,
        surname: values.surname,
        email: values.email,
        password: values.password,
        rights: 10,
      };

      const res = await fetch(`${API_URL}/admin/create_admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAdmin),
      });

      if (res.ok) {
        window.showToast("Úspěšně odesláno!");
        await loadUsers();
        handleCloseModal();
      } else {
        window.showToast("Chyba při odesílání.");
      }
    } catch (error) {
      console.error(error);
      window.showToast("Server je nedostupný.");
    }
  };

  const handleOpenNewUserModal = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleOpenUserModal = (account) => {
    setSelectedUser({
      id: account.id,
      name: account.name,
      surname: account.surname,
      email: account.email,
      organization_id: account.organization_id,
      oldPassword: "",
      newPassword: "",
      newPasswordCheck: "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleSearchUsers = () => {
    const query = searchClient.trim().toLowerCase();

    if (!query) {
      setFilteredUsers(users);
      return;
    }

    const result = users.filter((user) => {
      const userName = `${user?.name ?? ""}`.toLowerCase();
      const userSurname = `${user?.surname ?? ""}`.toLowerCase();
      const userEmail = `${user?.email ?? ""}`.toLowerCase();

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
        <React.Fragment key={`${value}-${part}-${index}`}>
          {part}
        </React.Fragment>
      ),
    );
  };

  const adminCount = Number.isFinite(filteredUsers?.length)
    ? filteredUsers.length
    : 0;
  const isFewAdmins =
    adminCount >= 2 &&
    adminCount <= 4 &&
    !(adminCount >= 12 && adminCount <= 14);

  const foundVerb =
    adminCount === 1 ? "Nalezen" : isFewAdmins ? "Nalezeni" : "Nalezeno";
  const adminNoun =
    adminCount === 1 ? "admin" : isFewAdmins ? "admini" : "adminů";

  return (
    <div className="container ">
      <div className="left-container-2">
        <div className="input-panel">
          <div className="search-input-container">

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
                placeholder="Hledej admina"
              />

            <button onClick={handleSearchUsers}>Hledej</button>
            <button onClick={handleOpenNewUserModal}>Nový admin</button>
          </div>
        </div>

        <div className="show-items-panel">
          <div className="items-panel-label">
            <h4>
              {foundVerb} {adminCount} {adminNoun}
            </h4>
          </div>
          <div className="items-panel-table-header six-columns-2 one-row">
            <h3>ID</h3>
            <h3 className="left">Jméno</h3>
            <h3 className="left">Příjmení</h3>
            <h3>Práva</h3>
            <h3>Email</h3>
            <h3>ID ORG</h3>
          </div>
          <PuffLoaderSpinner active={isLoading} />
          <div className="items-list">
            {filteredUsers?.length > 0 &&
              filteredUsers.map((client) => (
                <div
                  key={client.id}
                  className="item six-columns-2 one-row"
                  onClick={() => handleOpenUserModal(client)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleOpenUserModal(client);
                    }
                  }}
                >
                  <div className="item-plu  ">
                    {renderHighlightedText(client.id)}
                  </div>
                  <div className="item-name  left">
                    <h1>{renderHighlightedText(client.name)}</h1>
                  </div>

                  <div className="item-name  left">
                    <h1>{renderHighlightedText(client.surname)}</h1>
                  </div>
                  <div className="item-name  ">
                    <p>{client.rights}</p>
                  </div>
                  <div className="item-name  ">
                    <p>{renderHighlightedText(client.email)}</p>
                  </div>
                  <div className="item-name  ">
                    <p>{client.organization_id}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div>
        {showModal && (
          <Modal
            fields={selectedUser?.id ? editFields : createFields}
            title={selectedUser?.id ? "Upravit admina" : "Nový admin"}
            initialValues={selectedUser ?? {}}
            onSubmit={handleSubmit}
            onClose={handleCloseModal}
            onCancel={handleCloseModal}
            secondButton={"Zrušit"}
            firstButton={selectedUser?.id ? "Upravit" : "Uložit"}
          />
        )}
      </div>
    </div>
  );
}

export default SuperadminAdminPanel;
