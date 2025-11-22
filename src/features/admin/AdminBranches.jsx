import React, { useState, useEffect} from "react";
import "./Admin.css";
import Modal from "../../components/modal/Modal.jsx";
import { useUser } from "../../context/UserContext.jsx";

const API_URL = import.meta.env.VITE_API_URL;

function AdminBranches() {
  const { user } = useUser();
  const fields = [
    { varName: "name", label: "Jméno", input: "text", required: true },
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
      const res = await fetch(`${API_URL}/admin/branches_list`, {
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

    const newBranch = {
      name: values.name,
      street: values.street,
      city: values.city,
      postal_code: values.postal_code,
      //zde je USER organization z CONTEXTu, což je organization ADMINA, který uživatele vytváří
      id_organizations: user.id_organizations,  
      
    };
    try {
      const res = await fetch(`${API_URL}/admin/create_branch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBranch),
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
    <div className="superadmin-content-container ">
      <div className="header-button-group">
        {/* <button className="admin-menu-btn" onClick={() => setShowModal(true)}>Nová pobočka</button> */}
      </div>
      <div className="search-container">
        <input
          className="client-search-input"
          type="text"
          value={searchClient}
          onChange={(e) => setSearchClient(e.target.value)}
          placeholder="Hledej uživatele"
        />
      </div>
      <div className="clients-list-container">
        
        <h1>Nalezeno {users.length} uživatel{users.length  == 0 ? "ů" : (users.length === 1 ? "" : (users.length in [2,3,4] ? "é" : "ů"))}</h1>

        {users?.length > 0 && (users?.map((client) => (
          <div key={client.id} className="client-item" onClick={() => null}>
            <h1>{`${client.name}, ${client.street}, ${client.postal_code} ${client.city}`}</h1>
            <p>{`Email: ${JSON.stringify(client.email)} | Telefon: ${JSON.stringify(client.phone)} | Otevírací doba: ${JSON.stringify(client.open_hours)} | ID Organizace: ${client.id_organizations}`}</p>
          </div>
        )))}
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

export default AdminBranches;
