import React, { useState, useEffect, useCallback } from "react";
import "./Admin.css";
import Modal from "../../components/modal/Modal.jsx";
import { useUser } from "../../context/UserContext.jsx";
import PuffLoaderSpinner from "../../components/loader/PuffLoaderSpinner.jsx";

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
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  //proměnné pro načtení poboček z DB
  const [branches, setBranches] = useState([]);
  const [filteredBranches, setFilteredBranches] = useState([]);

  const loadBranches = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/branches_list`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organization: user?.organization_id }),
      });
      const data = await res.json();
      if (res.ok) {
        setBranches(data);
        setFilteredBranches(data);
      } else {
        console.error("Error loading branches:", data.message);
      }
    } catch (err) {
      console.error("Chyba při načítání:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.organization_id]);

  //načtení poboček z DB
  useEffect(() => {
    loadBranches();
  }, [loadBranches]);

  const handleSubmit = async (values) => {
    const branchPayload = {
      id: selectedBranch?.id,
      user_id: selectedBranch?.user_id,
      name: values.name,
      branch_name: values.name,
      street: values.street,
      city: values.city,
      postal_code: values.postal_code,
      open_hours: selectedBranch?.open_hours || { pondělí: "08:00-17:00" },
      //zde je USER organization z CONTEXTu, což je organization ADMINA, který uživatele vytváří
      organization_id: user.organization_id,
    };

    try {
      const endpoint = selectedBranch?.id
        ? `${API_URL}/admin/update_branch`
        : `${API_URL}/admin/create_branch`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(branchPayload),
      });

      if (res.ok) {
        window.showToast(
          selectedBranch?.id
            ? "Pobočka byla úspěšně upravena!"
            : "Úspěšně odesláno!",
        );
        await loadBranches();
        handleCloseModal();
      } else {
        window.showToast("Chyba při odesílání.");
      }
    } catch (error) {
      console.error(error);
      window.showToast("Server je nedostupný.");
    }
  };

  const handleOpenNewBranchModal = () => {
    setSelectedBranch(null);
    setShowModal(true);
  };

  const handleOpenBranchModal = (branch) => {
    setSelectedBranch(branch);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBranch(null);
  };

  const handleSearchBranches = () => {
    const query = searchClient.trim().toLowerCase();

    if (!query) {
      setFilteredBranches(branches);
      return;
    }

    const result = branches.filter((branch) => {
      const branchName = `${branch?.name ?? ""}`.toLowerCase();
      const branchStreet = `${branch?.street ?? ""}`.toLowerCase();
      const branchCity = `${branch?.city ?? ""}`.toLowerCase();
      const branchPostalCode = `${branch?.postal_code ?? ""}`.toLowerCase();

      return (
        branchName.includes(query) ||
        branchStreet.includes(query) ||
        branchCity.includes(query) ||
        branchPostalCode.includes(query)
      );
    });

    setFilteredBranches(result);
  };

  const handleClearSearch = () => {
    setSearchClient("");
    setFilteredBranches(branches);
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
        <React.Fragment key={`${value}-${part}-${index}`}>
          {part}
        </React.Fragment>
      ),
    );
  };

  const branchCount = Number.isFinite(filteredBranches?.length)
    ? filteredBranches.length
    : 0;
  const isFewBranches =
    branchCount >= 2 &&
    branchCount <= 4 &&
    !(branchCount >= 12 && branchCount <= 14);

  const foundVerb =
    branchCount === 1 ? "Nalezena" : isFewBranches ? "Nalezeny" : "Nalezeno";
  const branchNoun =
    branchCount === 1 ? "pobočka" : isFewBranches ? "pobočky" : "poboček";

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
                    handleSearchBranches();
                  }
                  if (e.key === "Escape") {
                    handleClearSearch();
                  }
                }}
                placeholder="Hledej pobočku"
              />
            </div>
            <button onClick={handleSearchBranches}>Hledej</button>
            <button onClick={handleOpenNewBranchModal}>Nová pobočka</button>
          </div>
        </div>

        <div className="show-items-panel">
          <div className="items-panel-label">
            <h4>
              {foundVerb} {branchCount} {branchNoun}
            </h4>
          </div>
          <div className="items-panel-table-header six-columns-2 one-row">
            <h3>ID</h3>
            <h3 className="left">Pobočka</h3>
            <h3 className="left">Adresa</h3>
            <h3>Email</h3>
            <h3>Telefon</h3>
            <h3>Otevírací doba</h3>
          </div>
          <PuffLoaderSpinner active={isLoading} />
          <div className="items-list">
            {filteredBranches?.length > 0 &&
              filteredBranches?.map((branch) => (
                <div
                  key={branch.id}
                  className="item six-columns-2 one-row"
                  onClick={() => handleOpenBranchModal(branch)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleOpenBranchModal(branch);
                    }
                  }}
                >
                  <div className="item-plu  ">{branch.id}</div>
                  <div className="item-name  left">
                    <h1>{renderHighlightedText(branch.name)}</h1>
                  </div>
                  <div className="item-name  left">
                    <h1>
                      {renderHighlightedText(
                        `${branch.street}, ${branch.city} ${branch.postal_code}`,
                      )}
                    </h1>
                  </div>

                  <div className="item-name  ">
                    <p>{renderHighlightedText(branch?.email?.email)}</p>
                  </div>
                  <div className="item-name  ">
                    <p>{renderHighlightedText(branch?.phone?.phone)}</p>
                  </div>
                  <div className="item-name  ">
                    <p>
                      {renderHighlightedText(JSON.stringify(branch.open_hours))}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div>
        {showModal && (
          <Modal
            fields={fields}
            title={selectedBranch?.id ? "Upravit pobočku" : "Nová pobočka"}
            initialValues={selectedBranch ?? {}}
            onSubmit={handleSubmit}
            onClose={handleCloseModal}
            onCancel={handleCloseModal}
            secondButton={"Zrušit"}
            firstButton={selectedBranch?.id ? "Upravit" : "Uložit"}
          />
        )}
      </div>
    </div>
  );
}

export default AdminBranches;
