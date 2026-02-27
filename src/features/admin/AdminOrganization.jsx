import React, { useState, useEffect, useCallback } from "react";
import "./Admin.css";
import Modal from "../../components/modal/Modal.jsx";
import { useUser } from "../../context/UserContext.jsx";
import PuffLoaderSpinner from "../../components/loader/PuffLoaderSpinner.jsx";

const API_URL = import.meta.env.VITE_API_URL;

function AdminOrganization() {
  const { user } = useUser();

  const fields = [
    {
      varName: "name",
      label: "Název organizace",
      input: "text",
      required: true,
    },
    { varName: "street", label: "Ulice", input: "text", required: true },
    { varName: "city", label: "Město", input: "text", required: true },
    { varName: "postal_code", label: "PSČ", input: "text", required: true },
    { varName: "ico", label: "IČO", input: "text", required: false },
    { varName: "dic", label: "DIČ", input: "text", required: false },
    { varName: "phone", label: "Telefon", input: "text", required: false },
    { varName: "email", label: "Email", input: "email", required: false },
  ];

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [organizationInfo, setOrganizationInfo] = useState({
    name: "",
    street: "",
    city: "",
    postal_code: "",
    ico: "",
    dic: "",
    phone: "",
    email: "",
  });

  const loadOrganizationInfo = useCallback(async () => {
    if (!user?.organization_id) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/organizationInfo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organization_id: user.organization_id }),
      });

      const data = await res.json();

      if (res.ok) {
        setOrganizationInfo({
          name: data?.name ?? "",
          street: data?.street ?? "",
          city: data?.city ?? "",
          postal_code: data?.postal_code ?? "",
          ico: data?.ico ?? "",
          dic: data?.dic ?? "",
          phone: data?.phone?.phone ?? "",
          email: data?.email?.email ?? "",
        });
      } else {
        window.showToast(data?.message || "Chyba při načítání organizace.");
      }
    } catch (error) {
      console.error(error);
      window.showToast("Server je nedostupný.");
    } finally {
      setIsLoading(false);
    }
  }, [user?.organization_id]);

  useEffect(() => {
    loadOrganizationInfo();
  }, [loadOrganizationInfo]);

  const handleSubmit = async (values) => {
    try {
      const payload = {
        organization_id: user?.organization_id,
        name: values.name,
        street: values.street,
        city: values.city,
        postal_code: values.postal_code,
        ico: values.ico,
        dic: values.dic,
        phone: { phone: values.phone },
        email: { email: values.email },
      };

      const res = await fetch(`${API_URL}/admin/update_organization`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        window.showToast("Organizace byla úspěšně upravena!");
        await loadOrganizationInfo();
        setShowModal(false);
      } else {
        window.showToast(data?.message || "Chyba při odesílání.");
      }
    } catch (error) {
      console.error(error);
      window.showToast("Server je nedostupný.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container">
      <div className="org-center-wrap">
        <PuffLoaderSpinner active={isLoading} />
        <div className="info-box-2 org-info-box">
          <div className="info-box-header">
            <h1 className="dark">{organizationInfo.name}</h1>
          </div>
          <h1 className="dark">{`Ulice: ${organizationInfo.street}`}</h1>
          <h1 className="dark">{`Město: ${organizationInfo.city}`}</h1>
          <h1 className="dark">{`PSČ: ${organizationInfo.postal_code}`}</h1>
          <h1 className="dark">{`IČO: ${organizationInfo.ico || "<nezadáno>"}`}</h1>
          <h1 className="dark">{`DIČ: ${organizationInfo.dic || "<nezadáno>"}`}</h1>
          <h1 className="dark">{`Telefon: ${organizationInfo.phone || "<nezadáno>"}`}</h1>
          <h1 className="dark">{`Email: ${organizationInfo.email || "<nezadáno>"}`}</h1>
        </div>
        <div className="org-edit-button-wrap">
          <button onClick={() => setShowModal(true)}>Upravit organizaci</button>
        </div>
      </div>

      <div>
        {showModal && (
          <Modal
            fields={fields}
            title={"Upravit organizaci"}
            initialValues={organizationInfo}
            onSubmit={handleSubmit}
            onClose={handleCloseModal}
            onCancel={handleCloseModal}
            secondButton={"Zrušit"}
            firstButton={"Uložit"}
          />
        )}
      </div>
    </div>
  );
}

export default AdminOrganization;
