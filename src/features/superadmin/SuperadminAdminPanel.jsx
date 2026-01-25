import React, { useState, useEffect } from "react";
import "./Superadmin.css";
import Modal from "../../components/modal/Modal.jsx";

const API_URL = import.meta.env.VITE_API_URL;

function SuperadminAdminPanel() {
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
  ];

  const [searchClient, setSearchClient] = useState("");
  const [showModal, setShowModal] = useState(false);
  //proměnné pro načtení users z DB
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUsers = async () => {
      const res = await fetch(`${API_URL}/admin/admin_list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ users }),
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

    const newAdmin = {
      name: values.name,
      surname: values.surname,
      email: values.email,
      password: values.password,
      rights: 10,
    };

    try {
      const res = await fetch(`${API_URL}/admin/create_admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAdmin),
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
      <div className="header-button-group">
        <button className="admin-menu-btn" onClick={() => setShowModal(true)}>Nový admin</button>
      </div>
      <div className="search-container">
        <input
          className="client-search-input"
          type="text"
          value={searchClient}
          onChange={(e) => setSearchClient(e.target.value)}
          placeholder="Hledej klienta"
        />
      </div>
      <div className="clients-list-container">
        <h1>Nalezeno {users.length} klientů</h1>
        {users.map((client) => (
          <div key={client.id} className="client-item" onClick={() => null}>
            <h1>{`${client.name} ${client.surname} (${client.rights})`}</h1>
              <p>{`Email: ${client.email} || ID Organizace: ${client.organization_id}`}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Nový ADMIN účet</h2>
          </div>
        </div>
      )}

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

export default SuperadminAdminPanel;
