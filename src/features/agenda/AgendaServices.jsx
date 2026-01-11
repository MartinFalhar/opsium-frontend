import React from "react";
import { useState, useEffect } from "react";
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

  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState(["vše"]);
  const [selectedCategory, setSelectedCategory] = useState("vše");

  // Načtení dat při prvním načtení komponenty
  useEffect(() => {
    if (user?.branch_id) {
      handleSearchInCatalog();
    }
  }, [user?.branch_id]);

  const handleSearchInCatalog = async () => {
    // SEARCH SERVICES IN AGENDA
    try {
      const res = await fetch(`${API_URL}/agenda/services-search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_branch: user.branch_id }),
      });
      const data = await res.json();

      if (res.ok) {
        setItems(data);
        setIsLoading(false);

        // Získání unikátních kategorií z načtených položek
        const uniqueCategories = [
          "vše",
          ...new Set(data.map((i) => i.category)),
        ];

        setCategoryFilter(uniqueCategories);
        console.log("Categories fetched:", uniqueCategories);
      } else {
        setError(data.message);
        console.error("Error loading users:", error);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Nepodařilo se načíst klienty.");
    }
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
      id_branch: user.branch_id,
    };

    // Odeslání změněné položky na backend
    try {
      const res = await fetch(`${API_URL}/agenda/services-update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ changedItem }),
      });
      const data = await res.json();

      if (res.ok) {
        window.showToast("Položka v databázi změněna.");

        handleSearchInCatalog(); // Obnovení seznamu položek po změně
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedItem.id, id_branch: user.branch_id }),
      });
      const data = await res.json();
      if (res.ok) {
        window.showToast("Položka byla smazána.");
        handleSearchInCatalog(); // Obnovení seznamu položek po smazání
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

  return (
    <div className="container">
      <div className="left-container-2">
        <div className="input-panel">
          <div className="search-input-container">
            <input
              type="text"
              value={inputSearch}
              onChange={(e) => setInputSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchInCatalog(inputSearch);
                }
              }}
              placeholder="Zadej hledaný text"
            />
            <button onClick={() => handleSearchInCatalog(inputSearch)}>
              Vyhledat
            </button>
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
            <p>Nalezeno {items.length} položek</p>
          </div>
          <div className="items-panel-header-services">
            <h3>PLU</h3>
            <h3>Název služby</h3>
            <h3>Množství/Kategorie</h3>
            <h3>Cena s DPH</h3>
          </div>
          <div className="items-list">
            <PuffLoaderSpinnerLarge active={isLoading} />
            {items.length === 0 && <p>Žádné položky k zobrazení</p>}
            {items.length > 0 &&
              items.map(
                (item) =>
                  (selectedCategory === "vše" ||
                    item.category === selectedCategory) && (
                    <div
                      key={item.id}
                      className="item"
                      onClick={() => handleClick(item.id)}
                    >
                      <div className="item-header">
                        <div className="item-plu">{item.plu}</div>
                        <div className="item-name">
                          <h1>{`${item.name}`}</h1>
                        </div>
                        <div className="item-amount">
                          <p>{`${item.amount} ${item.uom}`}</p>
                        </div>
                        <div className="item-price-vat">
                          <h2>{`${Math.round(item.price)} Kč`}</h2>

                          <p className="vat_info">{`DPH ${Math.round(
                            vat[item.vat_type].rate
                          )}% `}</p>
                        </div>

                        <div className="item-note">
                          <p>{item.note}</p>
                        </div>
                        <div
                          className="item-category"
                          style={{
                            background:
                              categoryColors[item.category] || "#95a5a6",
                          }}
                        >
                          {item.category}
                        </div>
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
                  )
              )}
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
