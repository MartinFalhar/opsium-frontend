import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useUser } from "../../context/UserContext";
import Modal from "../../components/modal/Modal.jsx";
import SegmentedControl from "../../components/controls/SegmentedControl.jsx";
import PuffLoaderSpinnerLarge from "../../components/loader/PuffLoaderSpinnerLarge.jsx";

const API_URL = import.meta.env.VITE_API_URL;

const categoryColors = {
  oprava: "var(--color-grd-g13)",
  "náhradní díl": "var(--color-grd-g7)",
  zábrusy: "var(--color-grd-g8)",
  optometrie: "var(--color-grd-g9)",
  letování: "var(--color-grd-g3)",
  ostatní: "var(--color-grd-g5)",
};

function AgendaServices() {
  const { user, vat } = useUser();
  const fields = [
    {
      varName: "plu",
      label: "PLU",
      input: "number",
      required: false,
      readOnly: true,
    },
    {
      varName: "name",
      label: "Název služby",
      input: "textarea",
      required: true,
      rows: 3,
    },
    { varName: "amount", label: "Množství", input: "text", required: true },
    { varName: "uom", label: "Jednotka", input: "text", required: false },
    { varName: "price", label: "Cena", input: "number", required: true },
    {
      varName: "vat_type",
      label: "Výše DPH",
      options: [`${vat[0].rate} %`, `${vat[1].rate} %`, `${vat[2].rate} %`],
      required: true,
    },
    { varName: "note", label: "Poznámka", input: "text", required: false },
    {
      varName: "category",
      label: "Kategorie",
      required: true,
      options: [
        "oprava",
        "náhradní díl",
        "zábrusy",
        "optometrie",
        "letování",
        "ostatní",
      ],
    },
  ];

  const [inputSearch, setInputSearch] = useState("");
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState(["vše"]);
  const [selectedCategory, setSelectedCategory] = useState("vše");

  // Načtení dat při prvním načtení komponenty
  useEffect(() => {
    if (user?.branch_id) {
      loadServices();
    }
  }, [user?.branch_id]);

  const loadServices = useCallback(async () => {
    // SEARCH SERVICES IN AGENDA
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/agenda/services-search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ branch_id: user.branch_id }),
      });
      const data = await res.json();

      if (res.ok) {
        setItems(data);
        setFilteredItems(data);

        // Získání unikátních kategorií z načtených položek
        const uniqueCategories = [
          "vše",
          ...new Set(data.map((i) => i.category)),
        ];

        setCategoryFilter(uniqueCategories);
        console.log("Categories fetched:", uniqueCategories);
      } else {
        setError(data.message);
        console.error("Error loading services:", data.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Nepodařilo se načíst klienty.");
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, user?.branch_id]);

  const handleSearchInCatalog = () => {
    const query = inputSearch.trim().toLowerCase();

    if (!query) {
      setFilteredItems(items);
      return;
    }

    const result = items.filter((item) => {
      const name = `${item?.name ?? ""}`.toLowerCase();
      const amount = `${item?.amount ?? ""}`.toLowerCase();
      const uom = `${item?.uom ?? ""}`.toLowerCase();
      const category = `${item?.category ?? ""}`.toLowerCase();
      const note = `${item?.note ?? ""}`.toLowerCase();
      const plu = `${item?.plu ?? ""}`.toLowerCase();

      return (
        name.includes(query) ||
        amount.includes(query) ||
        uom.includes(query) ||
        category.includes(query) ||
        note.includes(query) ||
        plu.includes(query)
      );
    });

    setFilteredItems(result);
  };

  const handleClearSearch = () => {
    setInputSearch("");
    setFilteredItems(items);
  };

  const renderHighlightedText = (text) => {
    const value = `${text ?? ""}`;
    const query = inputSearch.trim();

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

  const handleClick = (itemId) => {
    const item = items.find((i) => i.id === itemId);
    // Převod vat_type z indexu na string pro zobrazení v SELECT
    const itemWithVatString = {
      ...item,
      vat_type: `${vat[item.vat_type].rate} %`,
    };
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleChangeItem = async (values) => {
    console.log("Changed item values:", values);

    // Převod vat_type ze stringu zpět na index
    const vatIndex = vat.findIndex((v) => `${v.rate} %` === values.vat_type);

    //Příprava dat pro odeslání na backend
    const changedItem = {
      id: Number(selectedItem.id),
      plu: selectedItem.plu,
      name: values.name,
      amount: values.amount,
      uom: values.uom,
      price: Number(values.price),
      vat_type: vatIndex,
      note: values.note,
      category: values.category,
      branch_id: user.branch_id,
    };

    // Odeslání změněné položky na backend
    try {
      const res = await fetch(`${API_URL}/agenda/services-update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ changedItem }),
      });
      const data = await res.json();

      if (res.ok) {
        window.showToast("Položka v databázi změněna.");

        loadServices(); // Obnovení seznamu položek po změně
      } else {
        setError(data.message);
        console.error("Chyba při ukládání výkonu:", error);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Nepodařilo se uložit nový výkon.");
    }
    setShowModal(false);
  };

  const deleteItem = async () => {
    try {
      const res = await fetch(`${API_URL}/agenda/services-delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          id: selectedItem.id,
          branch_id: user.branch_id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        window.showToast("Položka byla smazána.");
        loadServices(); // Obnovení seznamu položek po smazání
      } else {
        setError(data.message);
        console.error("Chyba při mazání položky:", error);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Nepodařilo se smazat položku.");
    }
    setShowModal(false);
  };

  const handleAddNewItem = async () => {
    // Nastavení prázdných výchozích hodnot pro novou položku
    const newItem = {
      plu: "",
      name: "",
      amount: "",
      uom: "",
      price: "",
      vat_type: 2, // Výchozí index DPH
      note: "",
      category: "",
    };

    setSelectedItem(newItem);
    setShowModal(true);
  };

  const visibleItems = filteredItems.filter(
    (item) => selectedCategory === "vše" || item.category === selectedCategory,
  );

  const itemCount = Number.isFinite(visibleItems?.length) ? visibleItems.length : 0;
  const isFewItems =
    itemCount >= 2 && itemCount <= 4 && !(itemCount >= 12 && itemCount <= 14);
  const foundVerb =
    itemCount === 1 ? "Nalezena" : isFewItems ? "Nalezeny" : "Nalezeno";
  const itemNoun =
    itemCount === 1 ? "položka" : isFewItems ? "položky" : "položek";

  return (
    <div className="container">
      <div className="left-container-2">
        <div className="input-panel">
          <div className="search-input-container">
            <div className="search-input-wrapper">
              {inputSearch.trim() ? (
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
                value={inputSearch}
                onChange={(e) => setInputSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchInCatalog();
                  }
                  if (e.key === "Escape") {
                    handleClearSearch();
                  }
                }}
                placeholder="Zadej hledaný text"
              />
            </div>
            <button onClick={handleSearchInCatalog}>Hledej</button>
          </div>

          <SegmentedControl
            items={categoryFilter}
            selectedValue={selectedCategory}
            onClick={(item) => setSelectedCategory(item)}
            width={"550px"}
          />
          <button onClick={() => handleAddNewItem()}>Nová položka</button>
        </div>
        <div className="show-items-panel">
          <div className="items-panel-label">
            <h2>Výkony a služby</h2>
            <p>
              {foundVerb} {itemCount} {itemNoun}
            </p>
          </div>
          <div className="items-panel-table-header four-columns">
            <h3>PLU</h3>
            <h3>Název služby</h3>
            <h3>Množství/Kategorie</h3>
            <h3>Cena s DPH</h3>
          </div>
          <div className="items-list">
            <PuffLoaderSpinnerLarge active={isLoading} />
            {visibleItems.length === 0 && <p>Žádné položky k zobrazení</p>}
            {visibleItems.length > 0 &&
              visibleItems.map((item) => (
                <div
                  key={item.id}
                  className="item one-row four-columns"
                  onClick={() => handleClick(item.id)}
                >
                        <div className="item-plu">{renderHighlightedText(item.plu)}</div>

                        <div className="item-name">
                          <h1>{renderHighlightedText(item.name)}</h1>
                        </div>

                        <div className="item-amount">
                          <p>
                            {renderHighlightedText(item.amount)} {renderHighlightedText(item.uom)}
                          </p>
                        </div>

                        <div className="item-price-vat">
                          <h2>{`${Math.round(item.price)} Kč`}</h2>

                          <p className="vat_info">{`DPH ${Math.round(
                            vat[item.vat_type].rate,
                          )}% `}</p>
                        </div>

                        <div className="item-note">
                          <p>{renderHighlightedText(item.note)}</p>
                        </div>

                        <div
                          className="item-category"
                          style={{
                            background:
                              categoryColors[item.category] || "#95a5a6",
                          }}
                        >
                          {renderHighlightedText(item.category)}
                        </div>
                      

                      {/* {hoveredItemId === item.id && (
                    <div className="item-actions">
                      <button onClick={() => handleItemChange(item)}>
                        UPRAVIT
                      </button>
                      <button onClick={() => handleItemDelete(item)}>
                        SMAZAT
                      </button>
                    </div>
                  )} */}
                </div>
              ))}
          </div>
        </div>
      </div>

      {showModal && selectedItem && (
        <Modal
          fields={fields}
          initialValues={{
            ...selectedItem,
            vat_type:
              selectedItem.vat_type !== undefined
                ? `${vat[selectedItem.vat_type].rate} %`
                : "",
          }}
          onSubmit={handleChangeItem}
          onClose={() => setShowModal(false)}
          onCancel={() => setShowModal(false)}
          onDelete={deleteItem}
        />
      )}
    </div>
  );
}

export default AgendaServices;
