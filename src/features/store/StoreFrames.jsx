import React from "react";
import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import Pagination from "../../components/pagination/Pagination.jsx";
import Modal from "../../components/modal/Modal.jsx";
import PuffLoaderSpinnerLarge from "../../components/loader/PuffLoaderSpinnerLarge.jsx";
import SearchInStore from "../../components/store/SearchInStore.jsx";
import UpdateInStore from "../../components/store/UpdateInStore.jsx";

const API_URL = import.meta.env.VITE_API_URL;

function StoreFrames() {
  //******************************
  // ID skladu
  const storeId = 1;
  //******************************

  const fieldsForStockInput = [
    {
      varName: "date",
      label: "Datum příjmu",
      input: "date",
      required: true,
    },
    {
      varName: "delivery_note",
      label: "Číslo dodacího listu",
      input: "text",
      required: true,
    },
  ];

  const fieldsBasic = [
    {
      varName: "plu",
      label: "PLU kód",
      input: "number",
      readOnly: true,
    },
    {
      varName: "id_supplier",
      label: "Dodavatel",
      options: { field: "brýle" },
      required: true,
    },
    {
      varName: "collection",
      label: "Kolekce",
      input: "text",
      required: false,
    },
    { varName: "product", label: "Model", input: "text", required: false },
    { varName: "color", label: "Barva", input: "text", required: false },
    {
      varName: "quantity",
      label: "Množství",
      input: "number",
      required: false,
    },
    {
      varName: "price_buy",
      label: "Nákupní cena",
      input: "number",
      required: false,
    },
    {
      varName: "price",
      label: "Prodejní cena",
      input: "number",
      required: false,
    },
    {
      varName: "gender",
      label: "Gender",
      options: [`Pánská`, `Dámská`, `Uni`, `Dětská`],
      required: false,
    },
    {
      varName: "material",
      label: "Materiál obruby",
      options: [`plastová`, `kovová`, `kovová s klipem`, `ultem s klipem`],
      required: false,
    },
    {
      varName: "type",
      label: "Typ obruby",
      options: [`Dioptrická`, `Typ 2`, `Typ 3`, `Typ 4`],
      required: false,
    },
  ];

  const categoryColorsGender = {
    Pánská: "var(--color-grd-g2)",
    Dámská: "var(--color-grd-g3)",
    Uni: "var(--color-grd-g4)",
    Dětská: "var(--color-grd-g5)",
  };

  const categoryColorsMaterial = {
    plastová: "var(--color-grd-g6)",
    kovová: "var(--color-grd-g7)",
    "kovová s klipem": "var(--color-grd-g8)",
    "ultem s klipem": "var(--color-grd-g9)",
  };

  const categoryColorsType = {
    Dioptrická: "var(--color-grd-g10)",
  };

  // Stavové hooky
  const { user, vat } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [isNewItem, setIsNewItem] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // const [hoveredItemId, setHoveredItemId] = useState(null);

  // Stav pro vyhledávací vstup a položky skladu
  const [inputSearch, setInputSearch] = useState("");
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  // Triggery pro vyhledávání a mazání
  const [searchTrigger, setSearchTrigger] = useState("");
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [itemToUpdate, setItemToUpdate] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Paginace
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  //HANDLE SEARCH IN STORE
  const handleSearchInStore = (value) => {
    fields = fieldsBasic;
    setSearchTrigger(value || "");
  };
  const handleSearchResult = (result) => {
    setItems(result.items);
    setTotalPages(result.totalPages);
    if (result.error) {
      setError(result.error);
    }
  };

  //HANDLE UPDATE IN STORE
  const handleUpdateItem = (item) => {
    console.log("handleUpdateItem received:", item); // Debug
    const changedItem = {
      plu: item.plu,
      collection: item.collection,
      product: item.product,
      color: item.color,
      quantity: Number(item.quantity),
      price: Number(item.price),
      gender: item.gender,
      material: item.material,
      type: item.type,
      id_supplier: Number(item.id_supplier) || null, // Převeď na number
    };
    console.log("changedItem:", changedItem); // Debug
    setItemToUpdate({ values: changedItem, storeId });
    setUpdateTrigger((prev) => prev + 1);
  };

  const handleUpdateResult = (result) => {
    if (result.success) {
      setRefreshTrigger((prev) => prev + 1); // Vynutit obnovení seznamu
      setShowModal(false);
    } else if (result.error) {
      setError(result.error);
    }
  };

  //HANDLE NEW ITEM
  const handleNewItem = async () => {
    // Nastavení prázdných výchozích hodnot pro novou položku
    const emptyValues = {
      plu: "", // prázdné plu pro novou položku
      collection: "TEST",
      product: "TEST",
      color: "Black",
      id_supplier: "", // prázdný string místo 0
      quantity: 1,
      price: 1,
      note: "",
      size: "54/18-140",
      gender: "",
      material: "",
      type: "",
      date: "",
      delivery_note: "",
    };

    setIsNewItem(true);
    setSelectedItem(emptyValues);
    setShowModal(true);
  };

  //HANDLE CLICK ITEM IN LIST
  const handleClick = (itemId) => {
    //podle ID najde položku a otevři modal s jejími daty
    const item = items.find((itm) => itm.id === itemId);
    setIsNewItem(false);
    setSelectedItem(item);
    setShowModal(true);
  };

  return (
    <div className="container">
      <div className="left-container-2">
        <div className="input-panel">
          <input
            className="search-input-container"
            type="text"
            value={inputSearch}
            onChange={(e) => setInputSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchInStore(inputSearch);
              }
            }}
            placeholder="Zadej hledaný text"
          />
          <button onClick={() => handleSearchInStore(inputSearch)}>
            Vyhledat
          </button>
          <button onClick={() => handleNewItem()}>Nová obruba</button>
        </div>

        <div className="show-items-panel">
          <div className="items-panel-label">
            <h2>Brýlové obruby</h2>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
            <p>
              Položek: {items.length} ks (strana {page}/{totalPages})
            </p>
          </div>
          <div className="items-panel-table-header six-columns">
            <h3>PLU</h3>
            <h3>Model obruby</h3>
            <h3>Barva</h3>
            <h3>Dodavatel</h3>
            <h3>Množství (ks)</h3>
            <h3>Cena</h3>
          </div>

          <div className="items-list">
            {!items.length > 0 && <PuffLoaderSpinnerLarge active={isLoading} />}

            {items.length > 0 &&
              items.map((item) => (
                <div
                  key={item.id}
                  className="item six-columns"
                  // onMouseEnter={() => setHoveredItemId(item.id)}
                  // onMouseLeave={() => setHoveredItemId(null)}
                  onClick={() => {
                    handleClick(item.id);
                  }}
                >
                  <div className="item-plu">{item.plu}</div>

                  <div className="item-name label">
                    <h1>{`${item.collection} ${item.product}`}</h1>
                  </div>
                  <div className="item-name">
                    <h2>{`${item.color}`}</h2>
                  </div>
                  <div className="item-name">
                    <h2>{`${item.supplier_nick}`}</h2>
                  </div>
                  <div className="item-name">
                    <h2>{`${item.quantity}`}</h2>
                  </div>
                  <div className="item-name">
                    <h2>{`${Math.round(item.price)} Kč`}</h2>
                  </div>
                  {/* Druhý řádek s kategoriemi */}
                  <div className="item-note">
                    {item.size && (
                      <div
                        className="item-category"
                        style={{
                          background: "var(--color-grd-g11)",
                        }}
                      >{`${item.size}`}</div>
                    )}
                    {item.gender && (
                      <div
                        className="item-category"
                        style={{
                          background:
                            categoryColorsGender[item.gender] || "#95a5a6",
                        }}
                      >{`${item.gender}`}</div>
                    )}
                    {item.material && (
                      <div
                        className="item-category"
                        style={{
                          background:
                            categoryColorsMaterial[item.material] || "#95a5a6",
                        }}
                      >{`${item.material}`}</div>
                    )}

                    {item.type && (
                      <div
                        className="item-category"
                        style={{
                          background:
                            categoryColorsType[item.type] || "#95a5a6",
                        }}
                      >{`${item.type}`}</div>
                    )}
                    {item.note && (
                      <div
                        className="item-category"
                        style={{
                          background: "var(--color-grd-g16)",
                        }}
                      >{`ID ${item.note}`}</div>
                    )}
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
                  )}*/}
                </div>
              ))}
          </div>
        </div>
      </div>
      <SearchInStore
        storeId={storeId}
        page={page}
        limit={limit}
        searchValue={searchTrigger}
        refreshTrigger={refreshTrigger}
        onResult={handleSearchResult}
      />
      {itemToUpdate && (
        <UpdateInStore
          values={itemToUpdate.values}
          storeId={itemToUpdate.storeId}
          updateTrigger={updateTrigger}
          onResult={handleUpdateResult}
        />
      )}
      <div>
        {showModal && (
          <Modal
            fields={isNewItem ? [...fieldsForStockInput, ...fieldsBasic] : fieldsBasic}
            initialValues={selectedItem}
            thirdButton={null}
            onSubmit={handleUpdateItem}
            onClose={() => setShowModal(false)}
            onCancel={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
}

export default StoreFrames;
