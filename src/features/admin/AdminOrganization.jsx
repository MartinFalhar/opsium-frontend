import React, { useState, useEffect } from "react";
import "./Admin.css";
import Modal from "../../components/modal/Modal.jsx";
import { useUser } from "../../context/UserContext.jsx";
import PuffLoaderSpinner from "../../components/loader/PuffLoaderSpinner.jsx";

const API_URL = import.meta.env.VITE_API_URL;

function AdminOrganization () {

  const { user, members } = useUser();
  const fields = [
    { varName: "name", label: "Jméno", input: "text", required: true },
    { varName: "surname", label: "Příjmení", input: "text", required: true },
    { varName: "nick", label: "Nick", input: "text", required: false },
    { varName: "pin", label: "PIN", input: "password", required: true },
  ];


  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState(null);


  const handleSubmit = async (values) => {
    console.log("Submitted values:", values);
  };

  return (
    <div className="admin-dashboard-container">
      <div className="header-button-group">
<p>
  :: No buttons yet ::
  </p>
      </div>
        <div className="clients-list-container">

        <div className="info-box-2">
          <h6>Informace o organizaci:</h6>
          <h1>{`${user.organization_name}`}</h1>
          <h1>{`Ulice: ${user.organization_street}`}</h1>
          <h1>{`Město: ${user.organization_city}`}</h1>
          <h1>{`PSČ: ${user.organization_postal_code}`}</h1>
        </div>
        <div className="info-box-2">
          <h1>{`IČO: ${user.organization_ico}`}</h1>
          <h1>{`DIČ: ${user.organization_dic}`}</h1>
        </div>
        <div className="info-box-2">
          <h6>Členové organizace:</h6>
          {members.map((member) => (
              <div key={member.id}>
              <p>{`${member.name} ${member.surname} (${member.nick}) #${member.pin}`}</p>
            </div>
          ))}
        </div>
        <div className="info-box-2">
          <h6>Spravovaná pobočka tímto účtem:</h6>
          {user.branch_id === 0 ? (
              <p>
              K tomuto účtu není přiřazena žádná pobočka, jedná se o ADMIN účet.
            </p>
          ) : (
              <div>              
              <h1>{`${user.branch_name}`}</h1>
              <h1>{`${user.branch_street}`}</h1>
              <h1>{`${user.branch_postal_code} ${user.branch_city} `}</h1>
              <h1>{`${user?.open_hours?.['pondělí'] || `closed`}`}</h1>
            </div>
          )}
          </div>
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

export default AdminOrganization;
