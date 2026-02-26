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
      organization_id: user.organization_id,
    };
    try {
      const res = await fetch(`${API_URL}/admin/create_branch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBranch),
      });

      if (res.ok) {
        window.showToast("Úspěšně odesláno!");
        await loadBranches();
        setShowModal(false);
      } else {
        window.showToast("Chyba při odesílání.");
      }
    } catch (error) {
      console.error(error);
      window.showToast("Server je nedostupný.");
    }
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
        <React.Fragment key={`${value}-${part}-${index}`}>{part}</React.Fragment>
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
            <button onClick={() => setShowModal(true)}>Nová pobočka</button>
          </div>
        </div>

        <div className="show-items-panel">
          <div className="items-panel-label">
            <h4>
              {foundVerb} {branchCount} {branchNoun}
            </h4>
          </div>
          <PuffLoaderSpinner active={isLoading} />
          <div className="items-list">
            {filteredBranches?.length > 0 &&
              filteredBranches?.map((branch) => (
                <div key={branch.id} className="item" onClick={() => null}>
                  <h1>
                    {renderHighlightedText(branch.name)}, {renderHighlightedText(branch.street)}, {" "}
                    {renderHighlightedText(branch.postal_code)} {renderHighlightedText(branch.city)}
                  </h1>
                  <p>
                    Email: {`${branch?.email ?? ""}`} | Telefon: {`${branch?.phone ?? ""}`} | Otevírací doba: {`${branch?.open_hours ?? ""}`} | ID Organizace: {branch.organization_id}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div>
        {showModal && (
          <Modal
            fields={fields}
            onSubmit={handleSubmit}
            onClose={() => setShowModal(false)}
            onCancel={() => setShowModal(false)}
            secondButton={"Zrušit"}
            firstButton={"Uložit"}
          />
        )}
      </div>
    </div>
  );
}

export default AdminBranches;
