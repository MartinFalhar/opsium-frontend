import { useState, useEffect } from "react";
import Pagination from "../../components/pagination/Pagination.jsx";
import Modal from "../../components/modal/Modal.jsx";
import ModalMultipleItem from "../../components/modal/ModalMultipleItem.jsx";
import PuffLoaderSpinnerLarge from "../../components/loader/PuffLoaderSpinnerLarge.jsx";
import { useStoreSearch } from "../../hooks/useStoreSearch.js";
import { useStoreUpdate } from "../../hooks/useStoreUpdate.js";
import { useStorePutIn } from "../../hooks/useStorePutIn.js";
import { useStorePutInMultipleItems } from "../../hooks/useStorePutInMultipleItems.js";
import { useStoreGetSuppliers } from "../../hooks/useStoreGetSuppliers.js";

const API_URL = import.meta.env.VITE_API_URL;

function StoreFrames() {
  //******************************
  // ID skladu
  const storeId = 1;
  //******************************

  const fieldsForStockInputMultiple = [
    {
      varName: "id_supplier",
      label: "Dodavatel",
      options: { field: "brýle" },
      required: true,
    },
    {
      varName: "date",
      label: "Datum příjmu",
      input: "date",
      required: true,
    },
    {
      varName: "delivery_note",
      label: "Dodací list",
      input: "text",
      required: true,
    },
    {
      varName: "plu",
      label: "PLU kód",
      input: "hidden",
      required: false,
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
      varName: "price_buy",
      label: "Nákupní cena [bez DPH]",
      input: "number",
      required: false,
    },
    {
      varName: "price_sold",
      label: "Prodejní cena [Kč s DPH]",
      input: "number",
      required: false,
    },
    {
      varName: "quantity",
      label: "Množství",
      input: "number",
      required: false,
    },
    {
      varName: "size",
      label: "Velikost",
      input: "text",
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

  const fieldsForStockInput = [
    {
      varName: "plu",
      input: "hidden", // Skryté pole
    },
    {
      varName: "text01",
      input: "message",
    },
    {
      varName: "text02",
      input: "message",
    },
    {
      varName: "id_supplier",
      label: "Dodavatel",
      options: { field: "brýle" },
      required: true,
      readOnly: true,
    },
    {
      varName: "date",
      label: "Datum příjmu",
      input: "date",
      required: true,
    },
    {
      varName: "delivery_note",
      label: "Dodací list",
      input: "text",
      required: true,
    },
    {
      varName: "quantity",
      label: "Počet",
      input: "number",
      required: false,
    },
    {
      varName: "price_buy",
      label: "Nákupní cena [Kč bez DPH]",
      input: "number",
      required: false,
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
      readOnly: true,
    },
    {
      varName: "collection",
      label: "Kolekce",
      input: "text",
      required: false,
    },
    { varName: "product", label: "Model", input: "text", required: false },
    { varName: "color", label: "Barva", input: "text", required: false },
    { varName: "size", label: "Velikost", input: "text", required: false },
    {
      varName: "price",
      label: "Prodejní cena [Kč s DPH]",
      input: "number",
      required: false,
    },
    {
      varName: "quantity",
      label: "Množství",
      input: "number",
      required: false,
      readOnly: true,
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
  const [showModal, setShowModal] = useState(false);
  const [showModalMultipleItem, setShowModalMultipleItem] = useState(false);
  const [isNewItem, setIsNewItem] = useState(false);
  const [isPutInStore, setIsPutInStore] = useState(false);
  const [isPutInStoreMultiple, setIsPutInStoreMultiple] = useState(false);

  // Stav pro vyhledávací vstup a položky skladu
  const [inputSearch, setInputSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedMultiItem, setSelectedMultiItem] = useState(null);

  // Custom hooky pro práci se skladem
  const {
    items,
    totalPages,
    loading: searchLoading,
    searchItems,
  } = useStoreSearch(storeId);
  const { loading: updateLoading, updateItem } = useStoreUpdate(storeId);
  const { loading: putInLoading, putInItem } = useStorePutIn(storeId);
  const { loading: putInMultipleLoading, putInMultipleItems } = useStorePutInMultipleItems(storeId);
  const { suppliers } = useStoreGetSuppliers("brýle");

  // Paginace
  const [page, setPage] = useState(1);
  const limit = 6;

  // Effect pro automatické načtení položek při změně stránky nebo inputu
  useEffect(() => {
    searchItems(page, limit, inputSearch);
  }, [page, inputSearch, searchItems]);

  //HANDLE SEARCH IN STORE
  const handleSearchInStore = (value) => {
    setInputSearch(value || "");
    setPage(1); // Reset na první stránku při novém vyhledávání
  };

  //HANDLE UPDATE IN STORE
  const handleUpdateItem = async (item) => {
    // Pokud je režim naskladnění jedné položky, použij putInItem hook
    if (isPutInStore) {
      const putInData = {
        plu: Number(item.plu),
        id_supplier: Number(item.id_supplier),
        delivery_note: item.delivery_note,
        quantity: Number(item.quantity),
        price_buy: Number(item.price_buy),
        date: item.date,
      };
      console.log("putInData:", putInData);
      const result = await putInItem(putInData);
      if (result.success) {
        searchItems(page, limit, inputSearch);
        setShowModal(false);
        setIsPutInStore(false);
      }
      return;
    }
    const changedItem = {
      plu: item.plu,
      collection: item.collection,
      product: item.product,
      color: item.color,
      price: Number(item.price),
      gender: item.gender,
      material: item.material,
      type: item.type,
      id_supplier: Number(item.id_supplier) || null,
    };
    
    const result = await updateItem(changedItem);
    if (result.success) {
      searchItems(page, limit, inputSearch);
      setShowModal(false);
    }
  };

  //HANDLE CLICK ITEM IN LIST
  const handleClick = (itemId) => {
    //podle ID najde položku a otevři modal s jejími daty
    const item = items.find((itm) => itm.id === itemId);
    //vypnout režim nové položky a naskladnění
    setIsNewItem(false);
    setIsPutInStore(false);
    setIsPutInStoreMultiple(false);
    //nastaví vybranou položku a otevře modal
    setSelectedItem(item);
    setShowModal(true);
  };

  //HANDLE PUT IN STORE JUST ONE ITEM
  const handleClickOnThirdButton = () => {
    //aktivuje režim naskladnění jedné položky
    //přehodí tlačítka a definuje nové initialValues pro Modal
    const today = new Date();
    const onStockValues = {
      text01: "plu " + selectedItem.plu,
      text02:
        selectedItem.collection +
        " " +
        selectedItem.product +
        " " +
        selectedItem.color,
      plu: selectedItem.plu,
      id_supplier: selectedItem.id_supplier,
      quantity: 1,
      price_buy: Math.floor(Math.random() * 10000),
      date: today.toISOString().split("T")[0],
      delivery_note: "XL-123456",
    };

    //Aktivuje režim připsání jedné položky
    setIsPutInStore(true);

    //Načítá položky do modalu pro naskladnění
    setSelectedItem((prev) => ({ ...prev, ...onStockValues }));
    setShowModal(true);
  };

  //Otevření modalu pro naskladnění více položek
  const handleOpenMultipleItemsModal = () => {
    window.showToast("HAF HAF - Přepínám do režimu naskladnění položky.");

    const predefinedValues = [
      {
        id_supplier: 146,
        date: new Date().toISOString().split("T")[0],
        delivery_note: "XL-654321",
      },
      {
        plu: "",
        collection: "NOVA",
        product: "OPTIC",
        color: "Funny RED",
        quantity: 1,
        price_buy: 990,
        price_sold: 1990,
        size: "54/18-140",
        gender: "",
        material: "",
        type: "",
      },
    ];

    setIsPutInStoreMultiple(true);
    setSelectedMultiItem(predefinedValues);
    setShowModalMultipleItem(true);
  };

  //Odeslání více položek na backend
  const handleSubmitMultipleItems = async (values) => {
    console.log("Odesílám více položek na backend:", values);
    const result = await putInMultipleItems(values);
    if (result.success) {
      searchItems(page, limit, inputSearch);
      setShowModalMultipleItem(false);
      setIsPutInStoreMultiple(false);
    }
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
          <button onClick={() => handleOpenMultipleItemsModal()}>Nové zboží</button>
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
              Položek: {items?.length} ks (strana {page}/{totalPages})
            </p>
          </div>
          <div className="items-panel-table-header six-columns">
            <h3>PLU</h3>
            <h3>Model obruby</h3>
            <h3>Barva</h3>
            <h3>Dodavatel</h3>
            <h3>Množství (ks)</h3>
            <h3>Prodejní cena</h3>
          </div>

          <div className="items-list">
            {!items.length > 0 && (
              <PuffLoaderSpinnerLarge
                active={searchLoading || updateLoading || putInLoading || putInMultipleLoading}
              />
            )}

            {items?.length > 0 &&
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
                    <h2>{`${item.quantity_available}`}</h2>
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
                </div>
              ))}
          </div>
        </div>
      </div>

      <div>
        {showModal && (
          <Modal
            fields={
              isNewItem
                ? fieldsForStockInput
                : isPutInStore
                  ? fieldsForStockInput
                  : fieldsBasic
            }
            initialValues={selectedItem}
            suppliers={suppliers}
            onSubmit={handleUpdateItem}
            onClose={() => setShowModal(false)}
            onCancel={() => setShowModal(false)}
            firstButton={
              isNewItem || isPutInStore ? "Připsat zboží" : "Uložit změny"
            }
            secondButton={"Zavřít"}
            thirdButton={!isNewItem && !isPutInStore ? "Naskladnit" : null}
            //Pokud bylo stisknuto třetí tlačítko zprava provede se redesign modalu na naskladnění jedné položky
            //Načtou se jiné fields a initialValues
            onClickThirdButton={handleClickOnThirdButton}
          />
        )}
        {showModalMultipleItem && (
          <ModalMultipleItem
            fields={fieldsForStockInputMultiple}
            predefinedValues={selectedMultiItem}
            suppliers={suppliers}
            onSubmit={handleSubmitMultipleItems}
            onClose={() => setShowModalMultipleItem(false)}
            onCancel={() => setShowModalMultipleItem(false)}
            firstButton={"Připsat zboží"}
            secondButton={"Zavřít"}
            thirdButton={null}
          />
        )}
      </div>
    </div>
  );
}

export default StoreFrames;
