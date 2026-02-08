import { useState, useEffect } from "react";
import Pagination from "../../components/pagination/Pagination.jsx";
import Modal from "../../components/modal/Modal.jsx";
import ModalMultipleItemCatalog from "../../components/modal/ModalMultipleItemCatalog.jsx";
import PuffLoaderSpinnerLarge from "../../components/loader/PuffLoaderSpinnerLarge.jsx";
import { useStoreSearch } from "../../hooks/useStoreSearch.js";
import { useStoreUpdate } from "../../hooks/useStoreUpdate.js";
import { useStorePutIn } from "../../hooks/useStorePutIn.js";
import { useStorePutInMultipleItems } from "../../hooks/useStorePutInMultipleItems.js";
import { useStoreGetSuppliers } from "../../hooks/useStoreGetSuppliers.js";
import { formatValue } from "../../hooks/useFormatValue.js";

const API_URL = import.meta.env.VITE_API_URL;

function StoreLens() {
  //******************************
  // ID skladu
  const storeId = 3;
  //******************************

  const fieldsForStockInputMultiple = [
            {
      varName: "supplier_id",
      label: "Dodavatel",
      options: {},
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
      varName: "text01",
      input: "message",
      hidden: true,
    },
    {
      varName: "plu",
      label: "PLU kód",
      input: "number",
      required: false,
    },
    {
      varName: "code",
      label: "Kód",
      input: "input",
      required: false,
    },
    {
      varName: "name",
      label: "Název čočky",
      input: "message",
      required: false,
    },
    {
      varName: "supplier_id",
      label: "Dodavatel",
      input: "message",
      required: false,
    },
    {
      varName: "price_buy",
      label: "Nákupní cena [bez DPH]",
      input: "number",
      required: false,
      readOnly: true,
    },
    {
      varName: "price",
      label: "Prodejní cena [Kč s DPH]",
      input: "number",
      required: false,
    },
    {
      varName: "sph",
      label: "SPH",
      input: "number",
      required: false,
    },
    {
      varName: "cyl",
      label: "CYL",
      input: "number",
      required: false,
    },
    {
      varName: "ax",
      label: "Osa",
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
      varName: "id",
      label: "ID katalogové položky",
      input: "number",
      required: false,
      hidden: true,
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
      varName: "supplier_id",
      label: "Dodavatel",
      options: { field: "brýlové čočky" },
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
      varName: "supplier_id",
      label: "Dodavatel",
      required: true,
      readOnly: true,
    },

    { varName: "sph", label: "SPH", input: "number", required: false },
    { varName: "cyl", label: "CYL", input: "number", required: false },
    { varName: "ax", label: "Osa", input: "number", required: false },
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
      varName: "code",
      label: "Kód",
      input: "text",
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
  const [showModalMultipleItemCatalog, setShowModalMultipleItemCatalog] =
    useState(false);
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
  const { loading: putInMultipleLoading, putInMultipleItems } =
    useStorePutInMultipleItems(storeId);
  const { suppliers } = useStoreGetSuppliers("brýlové čočky");

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
        supplier_id: Number(item.supplier_id),
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
      sph: item.sph,
      cyl: item.cyl,
      ax: item.ax,
      price: Number(item.price),
      code: item.code,
      supplier_id: Number(item.supplier_id) || null,
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
      supplier_id: selectedItem.supplier_id,
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
        supplier_id: 146,
        date: new Date().toISOString().split("T")[0],
        delivery_note: "XL-654456321",
      },
      {
        plu: "",
        quantity: 1,
        price_buy: 990,
        price: 1990,
        type: "",
        sph: 300,
        cyl: -100,
        ax: 90,
        code: "",
        name: "",
        catalog_lens_id: "",
      },
    ];

    setIsPutInStoreMultiple(true);
    setSelectedMultiItem(predefinedValues);
    setShowModalMultipleItemCatalog(true);
  };

  //Odeslání více položek na backend
  const handleSubmitMultipleItems = async (values) => {
    console.log("Odesílám více položek na backend:", values);
    const result = await putInMultipleItems(values);
    if (result.success) {
      searchItems(page, limit, inputSearch);
      setShowModalMultipleItemCatalog(false);
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
          <button onClick={() => handleOpenMultipleItemsModal()}>
            Nové zboží
          </button>
        </div>

        <div className="show-items-panel">
          <div className="items-panel-label">
            <h2>Brýlové čočky</h2>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
            <p>
              Položek: {items?.length} ks (strana {page}/{totalPages})
            </p>
          </div>
          <div className="items-panel-table-header five-columns">
            <h3>PLU</h3>
            <h3>Brýlová čočka</h3>
            <h3>SPH / CYL @ AX</h3>
            <h3>Množství</h3>
            <h3>Prodejní cena</h3>
          </div>

          <div className="items-list">
            {!items.length > 0 && (
              <PuffLoaderSpinnerLarge
                active={
                  searchLoading ||
                  updateLoading ||
                  putInLoading ||
                  putInMultipleLoading
                }
              />
            )}

            {items?.length > 0 &&
              items.map((item) => (
                <div
                  key={item.id}
                  className="item five-columns"
                  // onMouseEnter={() => setHoveredItemId(item.id)}
                  // onMouseLeave={() => setHoveredItemId(null)}
                  onClick={() => {
                    handleClick(item.id);
                  }}
                >
                  <div className="item-plu">{item.plu}</div>

                  <div className="item-name label">
                    <h2>{`${item.catalog_lens_name}`}</h2>
                  </div>
                  <div className="item-name">
                    <h2>{`${formatValue(item.sph)} / ${formatValue(item.cyl)} @ ${item.ax}°`}</h2>
                  </div>

                  <div className="item-name">
                    <h2>{`${item.quantity_available} ks`}</h2>
                  </div>
                  <div className="item-name">
                    <h2>{`${Math.round(item.price)} Kč`}</h2>
                  </div>
                  {/* Druhý řádek s kategoriemi */}
                  <div className="item-note">
                    {item.sph && (
                      <div
                        className="item-category"
                        style={{
                          background: "var(--color-grd-g11)",
                        }}
                      >
                        <h3>{`${item.supplier_nick}`}</h3>
                      </div>
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
        {showModalMultipleItemCatalog && (
          <ModalMultipleItemCatalog
            fields={fieldsForStockInputMultiple}
            predefinedValues={selectedMultiItem}
            suppliers={suppliers}
            onSubmit={handleSubmitMultipleItems}
            onClose={() => setShowModalMultipleItemCatalog(false)}
            onCancel={() => setShowModalMultipleItemCatalog(false)}
            firstButton={"Připsat zboží"}
            secondButton={"Zavřít"}
            thirdButton={null}
            storeName="StoreLens"
          />
        )}
      </div>
    </div>
  );
}

export default StoreLens;
