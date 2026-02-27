import React, { useMemo, useState } from "react";
import "./Settings.css";
import Modal from "../../components/modal/Modal.jsx";
import { useUser } from "../../context/UserContext.jsx";

const API_URL = import.meta.env.VITE_API_URL;

function SettingsAccount() {
  const { user, setUser } = useUser();
  const [showModal, setShowModal] = useState(false);

  const fields = [
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

  const initialValues = useMemo(
    () => ({
      name: user?.name ?? "",
      surname: user?.surname ?? "",
      email: user?.email ?? "",
      oldPassword: "",
      newPassword: "",
      newPasswordCheck: "",
    }),
    [user],
  );

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (values) => {
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

    try {
      const payload = {
        id: user?.id,
        name: values.name,
        surname: values.surname,
        email: values.email,
        organization_id: user?.organization_id,
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      };

      const res = await fetch(`${API_URL}/admin/update_user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        setUser((prev) => ({
          ...prev,
          name: values.name,
          surname: values.surname,
          email: values.email,
        }));
        window.showToast("Účet byl úspěšně upraven!");
        handleCloseModal();
      } else {
        window.showToast(data?.message || "Chyba při odesílání.");
      }
    } catch (error) {
      console.error(error);
      window.showToast("Server je nedostupný.");
    }
  };

  return (
    <div className="container">
      <div className="left-container-2">
        <div className="input-panel">
          <button onClick={() => setShowModal(true)} disabled={!user?.id}>
            Upravit přihlášený účet
          </button>
        </div>

        {showModal && (
          <Modal
            fields={fields}
            title={"Upravit účet"}
            initialValues={initialValues}
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

export default SettingsAccount;
