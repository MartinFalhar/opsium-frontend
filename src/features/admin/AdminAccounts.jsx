import React, { useState, useEffect } from "react";
import "./Admin.css";
import Modal from "../../components/modal/Modal.jsx";
import { useUser } from "../../context/UserContext.jsx";

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
  //proměnné pro načtení users z DB
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  //načtení uživatelů z DB
  useEffect(() => {
    const loadUsers = async () => {
      const res = await fetch(`${API_URL}/admin/users_list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organization: user.id_organizations }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      } else {
        setError(data.message);
        console.error("Error loading users:", error);
      }
    };
    loadUsers();
  }, []);

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
      id_organizations: user.id_organizations,
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
    <div className="admin-content-container ">

      <div className="search-container">
        <input
          className="client-search-input"
          type="text"
          value={searchClient}
          onChange={(e) => setSearchClient(e.target.value)}
          placeholder="Hledej uživatele"
        />
        <button className="admin-menu-btn" onClick={() => setShowModal(true)}>
          Nový účet
        </button>
      </div>
      <div className="clients-list-container">
        <h1>
          Nalezeno {users.length} uživatel
          {users.length == 0
            ? "ů"
            : users.length === 1
            ? ""
            : users.length in [2, 3, 4]
            ? "é"
            : "ů"}
        </h1>

        {users?.length > 0 &&
          users?.map((client) => (
            <div key={client.id} className="client-item" onClick={() => null}>
              <h1>{`${client.name} ${client.surname} (${client.rights})`}</h1>
              <p>{`Email: ${client.email} | ID Organizace: ${client.id_organizations}`}</p>
            </div>
          ))}
      </div>
      <div>
        {showModal && (
          <Modal
            fields={fields}
            onSubmit={handleSubmit}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
}

export default AdminAccounts;
