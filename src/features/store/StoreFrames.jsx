import React from "react";
import { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import Pagination from "../../components/pagination/Pagination.jsx";
import Modal from "../../components/modal/Modal.jsx";
import PuffLoaderSpinnerLarge from "../../components/loader/PuffLoaderSpinnerLarge.jsx";
import SearchInStore from "../../components/store/SearchInStore.jsx";
import DeleteFromStore from "../../components/store/DeleteFromStore.jsx";

const API_URL = import.meta.env.VITE_API_URL;

function StoreFrames() {
   // ID skladu, může být dynamické podle potřeby   
  const storeId = 1;

  const fields = [
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
    {
      varName: "plu",
      label: "PLU kód",
      input: "number",
      readOnly: true,
      required: true,
    },
    {
      varName: "collection",
      label: "Kolekce",
      input: "text",
      required: true,
    },
    { varName: "product", label: "Model", input: "text", required: true },
    { varName: "color", label: "Barva", input: "text", required: true },
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
      required: true,
    },
    {
      varName: "price",
      label: "Prodejní cena",      
      input: "number",
      required: true,
    },
    {
      varName: "gender",
      label: "Gender",
      options: [`Pánská`, `Dámská`, `Uni`, `Dětská`],
      required: true,
    },
    {
      varName: "material",
      label: "Materiál obruby",
      options: [`plastová`, `kovová`, `kovová s klipem`, `ultem s klipem`],
      required: true,
    },
    {
      varName: "type",
      label: "Typ obruby",
      options: [`Dioptrická`, `Typ 2`, `Typ 3`, `Typ 4`],
      required: true,
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
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // const [hoveredItemId, setHoveredItemId] = useState(null);

  // Stav pro vyhledávací vstup a položky skladu
  const [inputSearch, setInputSearch] = useState("");
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  // Triggery pro vyhledávání a mazání
  const [searchTrigger, setSearchTrigger] = useState("");
  const [deleteTrigger, setDeleteTrigger] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  // Paginace
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  const handleSearchResult = (result) => {
    setItems(result.items);
    setTotalPages(result.totalPages);
    if (result.error) {
      setError(result.error);
    }
  };

  const handleSearchInStore = (value) => {
    setSearchTrigger(value || "");
  };

  const handleDeleteResult = (result) => {
    if (result.success) {
      handleSearchInStore(searchTrigger); // Obnovení seznamu
      setShowModal(false);
    } else if (result.error) {
      setError(result.error);
    }
  };

  const deleteItem = () => {
    setItemToDelete({ plu: selectedItem.plu, storeId });
    setDeleteTrigger(prev => !prev);
  };
  
  const handleChangeItem = async (values) => {
    console.log("Changed item values:", values);

    // Převod vat_type ze stringu zpět na index
    const vatIndex = vat.findIndex((v) => `${v.rate} %` === values.vat_type);

    //Příprava dat pro odeslání na backend
    const changedItem = {
      date: values.date,
      delivery_note: values.delivery_note,
      plu: selectedItem.plu,
      collection: values.collection,
      product: values.product,
      color: values.color,
      quantity: Number(values.quantity),
      price_buy: Number(values.price_buy),
      price: Number(values.price),
      gender: values.gender,
      material: values.material,
      type: values.type,
    };
  };
        //   const res = await fetch(
        //   `${API_URL}/store/search?store=1&page=${page}&limit=${limit}&value=${searchValue}`,
        //   {
        //     method: "GET",
        //     headers: {
        //       "Content-Type": "application/json",
        //       Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        //     },
        //   },
        // );

  const handleAddNewItem = async () => {
    // Nastavení prázdných výchozích hodnot pro novou položku
    const newItem = {
      collection: "",
      product: "",
      color: "",
      supplier: "",
      quantity: "",
      price: "",
      note: "",
      size: "",
      gender: "",
      material: "",
      type: "",
    };
    setSelectedItem(newItem);
    setShowModal(true);
  };

  const handleClick = (itemId) => {
    const item = items.find((itm) => itm.id === itemId);
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
          <button onClick={() => handleAddNewItem()}>Nová obruba</button>
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
                    <h2>{`${item.supplier}`}</h2>
                  </div>
                  <div className="item-name">
                    <h2>{`${item.quantity}`}</h2>
                  </div>
                  <div className="item-name">
                    <h2>{`${Math.round(item.price)} Kč`}</h2>
                  </div>
                  {/* Druhý řádek s kategoriemi */}
                  <div className="item-note">
                    {item.note && (
                      <div
                        className="item-category"
                        style={{
                          background: "var(--color-grd-g5)",
                        }}
                      >{`Poznámka`}</div>
                    )}
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
        onResult={handleSearchResult}
      />
      {itemToDelete && (
        <DeleteFromStore
          plu={itemToDelete.plu}
          storeId={itemToDelete.storeId}
          trigger={deleteTrigger}
          onResult={handleDeleteResult}
        />
      )}
      <div>
        {showModal && (
          <Modal
            fields={fields}
            initialValues={selectedItem}
            onSubmit={handleChangeItem}
            onClose={() => setShowModal(false)}
            onCancel={() => setShowModal(false)}
            onDelete={deleteItem}
          />
        )}
      </div>
    </div>
  );
}

export default StoreFrames;
