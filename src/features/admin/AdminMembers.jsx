import React, { useState, useEffect, useCallback } from "react";
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
  const [filteredMembers, setFilteredMembers] = useState([]);

  const loadMembers = useCallback(async () => {
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
        setFilteredMembers(data);
      } else {
        console.error("Error loading users:", data.message);
      }
    } catch (err) {
      console.error("Chyba při načítání:", err);
    } finally {
      setIsLoading(false); // 👈 vypneme loader
    }
  }, [user?.organization_id]);

  //načtení uživatelů z DB
  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

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

  const handleSearchMembers = () => {
    const query = searchClient.trim().toLowerCase();

    if (!query) {
      setFilteredMembers(members);
      return;
    }

    const result = members.filter((member) => {
      const memberName = `${member?.name ?? ""}`.toLowerCase();
      const memberSurname = `${member?.surname ?? ""}`.toLowerCase();
      return memberName.includes(query) || memberSurname.includes(query);
    });

    setFilteredMembers(result);
  };

  const handleClearSearch = () => {
    setSearchClient("");
    setFilteredMembers(members);
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
        <React.Fragment key={`${value}-${part}-${index}`}>{part}</React.Fragment>
      ),
    );
  };

  const memberCount = Number.isFinite(filteredMembers?.length)
    ? filteredMembers.length
    : 0;
  const isFewMembers =
    memberCount >= 2 &&
    memberCount <= 4 &&
    !(memberCount >= 12 && memberCount <= 14);

  const foundVerb =
    memberCount === 1 ? "Nalezen" : isFewMembers ? "Nalezeni" : "Nalezeno";
  const memberNoun =
    memberCount === 1 ? "člen" : isFewMembers ? "členové" : "členů";

  return (
    <div className="container ">
      <div className="left-container-2">
        <div className="input-panel">
          <div className="search-input-container">
            <div className="search-input-wrapper">
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
                    handleSearchMembers();
                  }
                  if (e.key === "Escape") {
                    handleClearSearch();
                  }
                }}
                placeholder="Hledej uživatele"
              />
            </div>
            <button onClick={handleSearchMembers}>Hledej</button>
            <button onClick={handleOpenNewMemberModal}>Nový člen</button>
          </div>
        </div>

        <div className="show-items-panel">
          <div className="items-panel-label">
            <h4>
              {foundVerb} {memberCount} {memberNoun}
            </h4>
          </div>
          <div className="items-panel-table-header six-columns-2 one-row">
            <h3>ID#PIN</h3>
            <h3 className="left">Jméno</h3>
            <h3 className="left">Příjmení</h3>
            <h3>Nick</h3>
            <h3>Narozeniny</h3>
            <h3>Svátek</h3>
          </div>
          <PuffLoaderSpinner active={isLoading} />
          <div className="items-list">
            {filteredMembers?.length > 0 &&
              filteredMembers?.map((member) => (
                <div
                  key={member.id}
                  className="item six-columns-2 one-row"
                  onClick={() => handleOpenMemberModal(member)}
                >
                  {" "}
                  <div className="item-plu  ">{`${member.id}#${member.pin}`}</div>
                  <div className="item-name left">
                    <h1>{renderHighlightedText(`${member.name} `)}</h1>
                  </div>
                  <div className="item-name left">
                    <h1>{renderHighlightedText(`${member.surname}`)}</h1>
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
