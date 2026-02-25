import React, { useState, useEffect } from "react";
import "./Admin.css";
import Modal from "../../components/modal/Modal.jsx";
import { useUser } from "../../context/UserContext.jsx";
import PuffLoaderSpinner from "../../components/loader/PuffLoaderSpinner.jsx";

const API_URL = import.meta.env.VITE_API_URL;

function AdminMembers() {
  const { user } = useUser();
  const normalizeNameDateForDb = (value) => {
    if (!value) {
      return "";
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [, month, day] = value.split("-");
      return `${day}.${month}.`;
    }

    const textMatch = value.match(/^(\d{1,2})\.(\d{1,2})\.?$/);
    if (!textMatch) {
      return "";
    }

    const day = textMatch[1].padStart(2, "0");
    const month = textMatch[2].padStart(2, "0");
    return `${day}.${month}.`;
  };

  const normalizeNameDateForInput = (value) => {
    if (!value) {
      return "";
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }

    const textMatch = value.match(/^(\d{1,2})\.(\d{1,2})\.?$/);
    if (!textMatch) {
      return "";
    }

    const day = textMatch[1].padStart(2, "0");
    const month = textMatch[2].padStart(2, "0");
    return `2000-${month}-${day}`;
  };

  const normalizeBirthDateForInput = (value) => {
    if (!value) {
      return "";
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }

    const datePartMatch = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!datePartMatch) {
      return "";
    }

    const [, year, month, day] = datePartMatch;
    return `${year}-${month}-${day}`;
  };

  const formatBirthDateDisplay = (value) => {
    const normalized = normalizeBirthDateForInput(value);
    if (!normalized) {
      return "";
    }

    const [year, month, day] = normalized.split("-");
    const shortYear = year.slice(-2);
    return `${day}.${month}.${shortYear}`;
  };

  const fields = [
    { varName: "name", label: "Jméno", input: "text", required: true },
    { varName: "surname", label: "Příjmení", input: "text", required: true },
    { varName: "nick", label: "Nick", input: "text", required: false },
    { varName: "pin", label: "PIN", input: "text", required: true },
    {
      varName: "birth_date",
      label: "Datum narození",
      input: "date",
      required: true,
    },
    { varName: "name_date", label: "Svátek", input: "date", required: true },
  ];

  const [searchClient, setSearchClient] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  //proměnné pro načtení users z DB
  const [members, setMembers] = useState([]);
  const [error, setError] = useState(null);

  const loadMembers = async () => {
    setIsLoading(true); // 👈 zapneme loader
    try {
      const res = await fetch(`${API_URL}/admin/members_list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organization: user?.organization_id }),
      });
      const data = await res.json();

      if (res.ok) {
        setMembers(data);
      } else {
        setError(data.message);
        console.error("Error loading users:", data.message);
      }
    } catch (err) {
      console.error("Chyba při načítání:", err);
      setError("Chyba při načítání dat.");
    } finally {
      setIsLoading(false); // 👈 vypneme loader
    }
  };

  //načtení uživatelů z DB
  useEffect(() => {
    loadMembers();
  }, [user?.organization_id]);

  const handleSubmit = async (values) => {
    if (values.password !== values.passwordCheck) {
      alert("Hesla se neshodují");
      return;
    }

    const normalizedNameDate = normalizeNameDateForDb(values.name_date);
    if (!normalizedNameDate) {
      alert("Svátek musí být platné datum.");
      return;
    }

    const memberPayload = {
      id: selectedMember?.id,
      name: values.name,
      surname: values.surname,
      nick: values.nick,
      pin: values.pin,
      birth_date: values.birth_date,
      name_date: normalizedNameDate,
      //zde je USER organization z CONTEXTu, což je organization ADMINA, který uživatele vytváří
      organization_id: user?.organization_id,
    };
    try {
      const endpoint = selectedMember?.id
        ? `${API_URL}/admin/update_member`
        : `${API_URL}/admin/create_member`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(memberPayload),
      });

      if (res.ok) {
        window.showToast(
          selectedMember?.id
            ? "Člen byl úspěšně upraven!"
            : "Úspěšně odesláno!",
        );
        await loadMembers();
        handleCloseModal();
        // setIsLoading(false);
      } else {
        window.showToast("Chyba při odesílání.");
      }
    } catch (error) {
      console.error(error);
      window.showToast("Server je nedostupný.");
    } finally {
      // setIsLoading(false);
    }
  };

  const handleOpenNewMemberModal = () => {
    setSelectedMember(null);
    setShowModal(true);
  };

  const handleOpenMemberModal = (member) => {
    setSelectedMember({
      ...member,
      birth_date: normalizeBirthDateForInput(member.birth_date),
      name_date: normalizeNameDateForInput(member.name_date),
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMember(null);
  };

  return (
    <div className="container ">
      <div className="left-container-2">
        <div className="input-panel">
          <input
            className="search-input-container"
            type="text"
            value={searchClient}
            onChange={(e) => setSearchClient(e.target.value)}
            placeholder="Hledej uživatele"
          />
          <button onClick={handleOpenNewMemberModal}>Nový člen</button>
        </div>

        <div className="show-items-panel">
          <div className="items-panel-label">
            <h1>
              Nalezeno {members.length === undefined ? "0" : members.length}{" "}
              člen
              {members.length == 0
                ? "ů"
                : members.length === 1
                  ? ""
                  : members.length in [2, 3, 4]
                    ? "i"
                    : "ů"}
            </h1>
          </div>
          <div className="items-panel-table-header six-columns-2 one-row">
            <h3>ID#PIN</h3>
            <h3>Jméno</h3>
            <h3>Příjmení</h3>
            <h3>Nick</h3>
            <h3>Narozeniny</h3>
            <h3>Svátek</h3>
          </div>
          <PuffLoaderSpinner active={isLoading} />
          <div className="items-list">
            {members?.length > 0 &&
              members?.map((member) => (
                <div
                  key={member.id}
                  className="item six-columns-2 one-row"
                  onClick={() => handleOpenMemberModal(member)}
                >
                  {" "}
                  <div className="item-plu  ">{`${member.id}#${member.pin}`}</div>
                  <div className="item-name">
                    <h1>{`${member.name} `}</h1>
                  </div>
                  <div className="item-name">
                    <h1>{`${member.surname}`}</h1>
                  </div>
                  <div className="item-name">
                    <p>{`${member.nick}`}</p>
                  </div>
                  <div className="item-name">
                    <p>{formatBirthDateDisplay(member.birth_date)}</p>
                  </div>
                  <div className="item-name">
                    <p>{`${member.name_date}`}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div>
          {showModal && (
            <Modal
              fields={fields}
              title={selectedMember?.id ? "Upravit člena" : "Nový člen"}
              initialValues={selectedMember ?? {}}
              onSubmit={handleSubmit}
              onClose={handleCloseModal}
              onCancel={handleCloseModal}
              secondButton={"Zrušit"}
              firstButton={selectedMember?.id ? "Upravit" : "Uložit"}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminMembers;
