import React, { useState, useEffect } from "react";
import "./Admin.css";
import Modal from "../../components/modal/Modal.jsx";
import { useUser } from "../../context/UserContext.jsx";
import PuffLoaderSpinner from "../../components/loader/PuffLoaderSpinner.jsx";

const API_URL = import.meta.env.VITE_API_URL;

function AdminMembers() {
  const { user } = useUser();
  const fields = [
    { varName: "name", label: "Jméno", input: "text", required: true },
    { varName: "surname", label: "Příjmení", input: "text", required: true },
    { varName: "nick", label: "Nick", input: "text", required: false },
    { varName: "pin", label: "PIN", input: "password", required: true },
  ];

  const [searchClient, setSearchClient] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //proměnné pro načtení users z DB
  const [members, setMembers] = useState([]);
  const [error, setError] = useState(null);

  //načtení uživatelů z DB
  useEffect(() => {
    const loadMembers = async () => {
      setIsLoading(true); // 👈 zapneme loader
      try {
        const res = await fetch(`${API_URL}/admin/members_list`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ organization: user?.id_organizations }),
        });
        const data = await res.json();

        if (res.ok) {
          setMembers(data);
        } else {
          setError(data.message);
          console.error("Error loading users:", error);
        }
      } catch (err) {
        console.error("Chyba při načítání:", err);
        setError("Chyba při načítání dat.");
      } finally {
        setIsLoading(false); // 👈 vypneme loader
      }
    };
    loadMembers();
  }, []);

  const handleSubmit = async (values) => {
    if (values.password !== values.passwordCheck) {
      alert("Hesla se neshodují");
      return;
    }

    const newUser = {
      name: values.name,
      surname: values.surname,
      nick: values.nick,
      pin: values.pin,
      //zde je USER organization z CONTEXTu, což je organization ADMINA, který uživatele vytváří
      id_user: user.id,
    };
    try {
      const res = await fetch(`${API_URL}/admin/create_member`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (res.ok) {
        alert("Úspěšně odesláno!");
        // setIsLoading(false);
      } else {
        alert("Chyba při odesílání.");
      }
    } catch (error) {
      console.error(error);
      alert("Server je nedostupný.");
    } finally {
      // setIsLoading(false);
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
        <button className="admin-menu-btn" onClick={() => setShowModal(true)}>Nový člen</button>
      </div>
      <div className="clients-list-container">
        <h1>
          Nalezeno {members.length === undefined ? "0" : members.length} uživatel
          {members.length == 0
            ? "ů"
            : members.length === 1
            ? ""
            : members.length in [2, 3, 4]
            ? "é"
            : "ů"}
        </h1>
        <PuffLoaderSpinner active={isLoading} />
        {members?.length > 0 &&
          members?.map((member) => (
            <div key={member.id} className="client-item" onClick={() => null}>
              <h1>{`${member.name} ${member.surname}`}</h1>
              <p>{`Nick: ${member.nick} #${member.pin} | ID Organizace: ${member.id_organizations}`}</p>
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

export default AdminMembers;
