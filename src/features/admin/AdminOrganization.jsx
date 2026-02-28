import React, { useState, useEffect, useCallback, useRef } from "react";
import "./Admin.css";
import Modal from "../../components/modal/Modal.jsx";
import { useUser } from "../../context/UserContext.jsx";
import PuffLoaderSpinner from "../../components/loader/PuffLoaderSpinner.jsx";
import defaultOrganizationLogo from "../../styles/images/opsium-logo-black.png";

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
  const [isLogoUploading, setIsLogoUploading] = useState(false);
  const [organizationLogoUrl, setOrganizationLogoUrl] = useState("");
  const logoInputRef = useRef(null);
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

  const loadOrganizationLogo = useCallback(
    async (forceRefresh = false) => {
      if (!user?.organization_id) {
        return;
      }

      try {
        const res = await fetch(
          `${API_URL}/admin/organization_logo/${user.organization_id}`,
        );
        const data = await res.json();

        if (!res.ok) {
          return;
        }

        const logoUrl = data?.logoUrl ? `${API_URL}${data.logoUrl}` : "";
        setOrganizationLogoUrl(
          logoUrl && forceRefresh ? `${logoUrl}?v=${Date.now()}` : logoUrl,
        );
      } catch (error) {
        console.error(error);
      }
    },
    [user?.organization_id],
  );

  useEffect(() => {
    loadOrganizationInfo();
  }, [loadOrganizationInfo]);

  useEffect(() => {
    loadOrganizationLogo();
  }, [loadOrganizationLogo]);

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

  const handleOpenLogoPicker = () => {
    logoInputRef.current?.click();
  };

  const handleUploadLogo = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (file.size > 100 * 1024) {
      window.showToast("Logo nesmí být větší než 100 kB.");
      return;
    }

    if (!user?.organization_id) {
      window.showToast("Chybí ID organizace.");
      return;
    }

    const formData = new FormData();
    formData.append("organization_id", String(user.organization_id));
    formData.append("logo", file);

    setIsLogoUploading(true);
    try {
      const res = await fetch(`${API_URL}/admin/upload_organization_logo`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        window.showToast(data?.message || "Chyba při nahrávání loga.");
        return;
      }

      await loadOrganizationLogo(true);
      window.showToast("Logo bylo úspěšně nahráno.");
    } catch (error) {
      console.error(error);
      window.showToast("Server je nedostupný.");
    } finally {
      setIsLogoUploading(false);
    }
  };

  return (
    <div className="container">
      <div className="org-center-wrap">
        <PuffLoaderSpinner active={isLoading} />
        <div className="info-box-2 org-info-box">
          <div className="info-box-header">
            <h1 className="dark">{organizationInfo.name}</h1>
          </div>
          <div className="org-logo-wrap">
            <img
              src={organizationLogoUrl || defaultOrganizationLogo}
              alt="Logo organizace"
              className="org-logo-preview"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = defaultOrganizationLogo;
              }}
            />
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
          <button onClick={handleOpenLogoPicker} disabled={isLogoUploading}>
            {isLogoUploading ? "Nahrávám logo..." : "Nahrát logo"}
          </button>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={handleUploadLogo}
            className="org-logo-input"
          />
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
