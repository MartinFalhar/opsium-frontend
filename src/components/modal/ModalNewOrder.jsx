import React, { useState, useEffect } from "react";
import ConfirmDelete from "./ConfirmDelete";
import SegmentedControl from "../../components/controls/SegmentedControl.jsx";
import SegmentedControlMulti from "../../components/controls/SegmentedControlMulti.jsx";
import { useStoreGetPluItem } from "../../hooks/useStoreGetPluItem.js";
import { useStoreGetPluFrame } from "../../hooks/useStoreGetPluFrame.js";
import { useStoreGetPluService } from "../../hooks/useStoreGetPluService.js";
import { useStoreGetPluLenses } from "../../hooks/useStoreGetPluLenses.js";
import "./Modal.css";
import "./ModalNewOrder.css";

export default function ModalNewOrder({
  fields,
  initialValues = {},
  formattedInvoiceNumber = "",
  onSubmit,
  onClose,
  onCancel,
  firstButton,
  secondButton,
  thirdButton,
  onClickThirdButton,
  suppliers = [],
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [values, setValues] = useState(initialValues);

  // Hook pro načtení položky podle PLU
  const {
    item: pluItem,
    loading: pluLoading,
    error: pluError,
    getPluItem,
  } = useStoreGetPluItem();

  // Hook pro načtení obruby podle PLU
  const {
    frame: pluFrame,
    loading: frameLoading,
    error: frameError,
    getPluFrame,
  } = useStoreGetPluFrame();

  // Hook pro načtení služby podle PLU
  const {
    loading: serviceLoading,
    error: serviceError,
    getPluService,
  } = useStoreGetPluService();

  // Hook pro načtení brýlových čoček podle PLU
  const {
    loading: lensesLoading,
    error: lensesError,
    getPluLenses,
  } = useStoreGetPluLenses();

  //Nastavení zakázky
  const orderDates = ["SPĚCHÁ", "zítra", "3 dny", "týden", "2-3 týdny", "..."];
  const [orderDatesSelection, setOrderDatesSelection] = useState(orderDates[3]);

  const orderNotice = ["SMS", "E-mail", "Zavolat"];
  const [orderNoticeSelection, setOrderNoticeSelection] = useState([
    "SMS",
    "E-mail",
  ]);

  const glassesTypeOptions = [
    "DÁLKA",
    "BLÍZKO",
    "POČÍTAČ",
    "ÚLEVOVÉ",
    "KANCELÁŘSKÉ",
    "MULTIFOKÁLNÍ",
    "SLUNEČNÍ",
  ];

  // Seznam povinných položek zakázky
  const [obligatoryItems, setObligatoryItems] = useState([]);
  const [hoveredItemIndex, setHoveredItemIndex] = useState(null);

  // Seznam položek brýlí
  const [glassesItems, setGlassesItems] = useState([]);
  const [expandedCentration, setExpandedCentration] = useState([]);
  const [expandedDioptrie, setExpandedDioptrie] = useState([]);
  const [collapsedGlasses, setCollapsedGlasses] = useState([]);
  const [glassesType, setGlassesType] = useState([]);
  const [glassesTypeCustomMode, setGlassesTypeCustomMode] = useState([]);
  const [glassesTypeCustomValue, setGlassesTypeCustomValue] = useState([]);
  const [glassesFrameData, setGlassesFrameData] = useState([]);
  const [glassesServiceData, setGlassesServiceData] = useState([]);
  const [glassesLensesData, setGlassesLensesData] = useState([]);

  // Položky k platbě
  const [paymentItems, setPaymentItems] = useState([]);

  // Aktualizace values při změně initialValues
  useEffect(() => {
    const init = {};
    Object.keys(values).forEach((key) => {
      const val = initialValues?.[key];
      init[key] = val !== undefined && val !== null ? val : "";
    });
    setValues(init);
  }, [initialValues]);

  //Univerzální handler pro změnu hodnoty pole
  //libovolného elementu formuláře
  const handleChange = (varName, value) => {
    setValues((prev) => ({ ...prev, [varName]: value }));
  };

  // Handler pro přidání položky do obligatoryItems
  const handleAddObligatoryItem = async () => {
    if (!values.plu || values.plu.trim() === "") return;
    await getPluItem(values.plu);
  };

  // Handler pro odstranění položky z obligatoryItems
  const handleRemoveObligatoryItem = (index) => {
    setObligatoryItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Handler pro přidání brýlí
  const handleAddGlasses = () => {
    const newGlasses = {
      right: {
        sph: "",
        cyl: "",
        osa: "",
        add: "",
        prizma: "",
        baze: "",
        pd: "",
        vyska: "",
        vertex: "",
        panto: "",
      },
      left: {
        sph: "",
        cyl: "",
        osa: "",
        add: "",
        prizma: "",
        baze: "",
        pd: "",
        vyska: "",
        vertex: "",
        panto: "",
      },
      pbs: "",
      obruby: "",
      zabrus: "",
      brylove_cocky: "",
    };
    setGlassesItems((prev) => [...prev, newGlasses]);
    setExpandedCentration((prev) => [...prev, false]);
    setExpandedDioptrie((prev) => [...prev, false]);
    setCollapsedGlasses((prev) => [...prev, false]);
    setGlassesType((prev) => [...prev, "DÁLKA"]);
    setGlassesTypeCustomMode((prev) => [...prev, false]);
    setGlassesTypeCustomValue((prev) => [...prev, ""]);
    setGlassesFrameData((prev) => [...prev, null]);
    setGlassesServiceData((prev) => [...prev, null]);
    setGlassesLensesData((prev) => [...prev, null]);
  };

  // Handler pro odstranění položky brýlí
  const handleRemoveGlasses = (index) => {
    setGlassesItems((prev) => prev.filter((_, i) => i !== index));
    setExpandedCentration((prev) => prev.filter((_, i) => i !== index));
    setExpandedDioptrie((prev) => prev.filter((_, i) => i !== index));
    setCollapsedGlasses((prev) => prev.filter((_, i) => i !== index));
    setGlassesType((prev) => prev.filter((_, i) => i !== index));
    setGlassesTypeCustomMode((prev) => prev.filter((_, i) => i !== index));
    setGlassesTypeCustomValue((prev) => prev.filter((_, i) => i !== index));
    setGlassesFrameData((prev) => prev.filter((_, i) => i !== index));
    setGlassesServiceData((prev) => prev.filter((_, i) => i !== index));
    setGlassesLensesData((prev) => prev.filter((_, i) => i !== index));

    // Odebrat z paymentItems položku spojenou s tímto indexem brýlí
    setPaymentItems((prev) =>
      prev.filter((item) => item.glassesIndex !== index),
    );
  };

  // Handler pro změnu hodnot brýlí
  const handleGlassesChange = (index, eye, field, value) => {
    setGlassesItems((prev) => {
      const updated = [...prev];
      if (eye === "shared") {
        updated[index][field] = value;
      } else {
        updated[index][eye][field] = value;
      }
      return updated;
    });
  };

  // Toggle rozšířených centračních údajů
  const toggleCentration = (index) => {
    setExpandedCentration((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  // Toggle rozšířených dioptrií
  const toggleDioptrie = (index) => {
    setExpandedDioptrie((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  // Toggle sbaleného bloku brýlí
  const toggleGlassesCollapse = (index) => {
    setCollapsedGlasses((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  // Handler pro načtení obruby podle PLU
  const handleFramePluKeyDown = async (e, index) => {
    if (e.key === "Enter") {
      const plu = e.target.value.trim();
      if (plu) {
        const frameData = await getPluFrame(plu);
        if (frameData) {
          // Uložit data obruby
          setGlassesFrameData((prev) => {
            const updated = [...prev];
            updated[index] = frameData;
            return updated;
          });

          // Přidat/aktualizovat paymentItems
          setPaymentItems((prev) => {
            // Odebrat předchozí položku obruby pro tento index, pokud existuje
            const filtered = prev.filter(
              (item) =>
                !(item.glassesIndex === index && item.source === "frame"),
            );

            // Přidat novou položku
            const glassesTypeName = glassesType[index] || "DÁLKA";
            return [
              ...filtered,
              {
                glassesIndex: index,
                model: glassesTypeName,
                price: parseFloat(frameData.price) || 0,
                rate: parseFloat(frameData.rate) || 0,
                source: "frame",
              },
            ];
          });
        }
      }
    }
  };

  // Handler pro načtení služby podle PLU (ZÁBRUS)
  const handleServicePluKeyDown = async (e, index) => {
    if (e.key === "Enter") {
      const plu = e.target.value.trim();
      if (plu) {
        const serviceData = await getPluService(plu);
        if (serviceData) {
          // Uložit data služby
          setGlassesServiceData((prev) => {
            const updated = [...prev];
            updated[index] = serviceData;
            return updated;
          });

          // Přidat/aktualizovat paymentItems pro službu
          setPaymentItems((prev) => {
            const filtered = prev.filter(
              (item) =>
                !(item.glassesIndex === index && item.source === "service"),
            );

            return [
              ...filtered,
              {
                glassesIndex: index,
                model: serviceData.name || "Služba",
                price: parseFloat(serviceData.price) || 0,
                rate: parseFloat(serviceData.rate) || 0,
                source: "service",
              },
            ];
          });
        }
      }
    }
  };

  // Handler pro načtení brýlových čoček podle PLU
  const handleLensesPluKeyDown = async (e, index) => {
    if (e.key === "Enter") {
      const plu = e.target.value.trim();
      if (plu) {
        const lensesData = await getPluLenses(plu);
        if (lensesData) {
          // Uložit data brýlových čoček
          setGlassesLensesData((prev) => {
            const updated = [...prev];
            updated[index] = lensesData;
            return updated;
          });

          // Přidat/aktualizovat paymentItems pro brýlové čočky
          setPaymentItems((prev) => {
            const filtered = prev.filter(
              (item) =>
                !(item.glassesIndex === index && item.source === "lenses"),
            );

            return [
              ...filtered,
              {
                glassesIndex: index,
                model: lensesData.code || "Brýlové čočky",
                price: parseFloat(lensesData.price) || 0,
                rate: parseFloat(lensesData.rate) || 0,
                source: "lenses",
              },
            ];
          });
        }
      }
    }
  };

  // UseEffect pro přidání položky po načtení
  useEffect(() => {
    if (pluItem && values.plu) {
      const newItem = {
        plu: values.plu,
        ...pluItem,
      };
      setObligatoryItems((prev) => [...prev, newItem]);
      handleChange("plu", ""); // Vyčistit PLU input
    }
  }, [pluItem]);

  // UseEffect pro aktualizaci paymentItems ze obligatoryItems
  useEffect(() => {
    const items = obligatoryItems.map((item) => ({
      model: item.model,
      price: parseFloat(item.price) || 0,
      rate: parseFloat(item.rate) || 0,
    }));

    // Přidat položky z glassesItems (ty mají glassesIndex)
    setPaymentItems((prevItems) => {
      const glassesPayments = prevItems.filter(
        (item) => item.glassesIndex !== undefined,
      );
      return [...items, ...glassesPayments];
    });
  }, [obligatoryItems]);

  const handleClose = () => {
    if (onCancel) {
      onCancel(); // Zavolej callback pro zrušení
    }
    onClose(); // Zavři modal
  };

  // Handler pro třetí tlačítko
  // Má hlídat stavy, kvůli zobrazení
  // konfirmačního formuláře (Smazat atd.)
  const handleThirdButtonClick = () => {
    if (thirdButton === "Smazat") {
      setShowConfirm(true);
    } else {
      // Pro jiné akce než smazání
      // vyvolá příslušný callback
      // který změní fields a values
      if (thirdButton === "Naskladnit" && onClickThirdButton) {
        onClickThirdButton();
      }
    }
  };

  const handleConfirmDelete = () => {
    if (onClickThirdButton) {
      onClickThirdButton();
    }
    setShowConfirm(false);
    onClose();
  };

  const handleCancelConfirm = () => {
    setShowConfirm(false);
  };

  if (showConfirm) {
    return (
      <ConfirmDelete
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelConfirm}
      />
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal new-order-modal">
        <div className="order-container">
          <div className="order-information">
            <div className="order-information-client box">
              <h2>Údaje klienta</h2>
              <div className="data-box">
                <input
                  className="tiny-input"
                  type="text"
                  value={values.degree_before}
                  onChange={(e) =>
                    handleChange("degree_before", e.target.value)
                  }
                  placeholder="."
                />
                <input
                  type="text"
                  value={values.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Jméno"
                />
                <input
                  type="text"
                  value={values.surname}
                  onChange={(e) => handleChange("surname", e.target.value)}
                  placeholder="Příjmení"
                />

                <input
                  className="tiny-input"
                  type="text"
                  value={values.degree_after}
                  onChange={(e) => handleChange("degree_after", e.target.value)}
                  placeholder="."
                />
              </div>
              <div className="data-box">
                <input
                  type="text"
                  value={values.street}
                  onChange={(e) => handleChange("street", e.target.value)}
                  placeholder="Ulice"
                />
                <input
                  type="text"
                  value={values.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="Město"
                />{" "}
                <input
                  className="input-post-code"
                  type="text"
                  value={values.post_code}
                  onChange={(e) => handleChange("post_code", e.target.value)}
                  placeholder="PSČ"
                />{" "}
              </div>
              <div className="data-box">
                <input
                  type="text"
                  value={values.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Email klienta"
                />
                <input
                  type="text"
                  value={values.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="Telefon klienta"
                />
              </div>
            </div>

            <div className="order-information-attributes box">
              <h2>Nastavení zakázky</h2>
              <h3>Číslo zakázky: {formattedInvoiceNumber || "—"}</h3>
              <SegmentedControl
                items={orderDates}
                selectedValue={orderDatesSelection}
                onClick={(item) => setOrderDatesSelection(item)}
              />
              <SegmentedControlMulti
                items={orderNotice}
                selectedValues={orderNoticeSelection}
                onChange={setOrderNoticeSelection}
              />
              <h3>Poslat poštou na:</h3>
              <input
                type="text"
                value={values.address_for_delivery}
                onChange={(e) =>
                  handleChange("address_for_delivery", e.target.value)
                }
                placeholder="Adresa pro doručení"
              />
            </div>
          </div>

          <div className="order-obligatory-items">
            <div className="plu-buttons-container">
              <input
                type="text"
                value={values.plu}
                onChange={(e) => handleChange("plu", e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddObligatoryItem();
                  }
                }}
                placeholder="PLU"
              />
              <button
                type="button"
                onClick={handleAddGlasses}
                className="btn-add-item"
              >
                + BRÝLE
              </button>
              <button type="button" className="btn-add-item">
                + KONTAKTNÍ ČOČKY
              </button>
              <button type="button" className="btn-add-item">
                + SERVIS
              </button>
            </div>
            <h1>Položky zakázky</h1>
            
            {pluLoading && <span>Načítám...</span>}
            {pluError && <span className="error-message">{pluError}</span>}
            {obligatoryItems.length === 0 && <span>Nejsou žádné položky</span>}
            {/* Seznam přidaných položek */}
            {obligatoryItems.length > 0 && (
              <div className="obligatory-items-list">
                {obligatoryItems.map((item, index) => (
                  <div
                    key={index}
                    className="obligatory-item"
                    onMouseEnter={() => setHoveredItemIndex(index)}
                    onMouseLeave={() => setHoveredItemIndex(null)}
                  >
                    <span>
                      <strong>PLU:</strong> {item.plu}
                    </span>
                    <span>
                      <strong>Model:</strong> {item.model}
                    </span>
                    <span>
                      <strong>Velikost:</strong> {item.size}
                    </span>
                    <span>
                      <strong>Barva:</strong> {item.color}
                    </span>
                    <span>
                      <strong>MJ:</strong> {item.uom}
                    </span>
                    <span>
                      <strong>Cena:</strong> {item.price} Kč
                    </span>
                    <span className="obligatory-item-rate">
                      <strong>DPH:</strong> {item.rate}%
                    </span>
                    {hoveredItemIndex === index && (
                      <button
                        onClick={() => handleRemoveObligatoryItem(index)}
                        className="btn-remove-item"
                      >
                        −
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {glassesItems.length > 0 && <h1>Brýle</h1>}
          <div className="order-items">
            {glassesItems.length > 0 && (
              <div className="glasses-items-list">
                {glassesItems.map((glasses, index) => {
                  const framePrice =
                    parseFloat(glassesFrameData[index]?.price) || 0;
                  const servicePrice =
                    parseFloat(glassesServiceData[index]?.price) || 0;
                  const lensesPrice =
                    parseFloat(glassesLensesData[index]?.price) || 0;
                  const glassesTotal = framePrice + servicePrice + lensesPrice;
                  const isCollapsed = collapsedGlasses[index];
                  const currentSelection = glassesType[index] || "DÁLKA";
                  const isCustomMode = glassesTypeCustomMode[index];

                  return (
                    <div key={index} className="glasses-item-wrapper">
                      <div
                        className={`header${
                          isCollapsed ? " header-compact" : ""
                        }`}
                        onClick={() => toggleGlassesCollapse(index)}
                      >
                        <span className="header-title">
                          {isCustomMode ? (
                            <input
                              type="text"
                              value={glassesTypeCustomValue[index] || ""}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                const customValue = e.target.value;
                                const newCustomValues = [
                                  ...glassesTypeCustomValue,
                                ];
                                const newTypes = [...glassesType];

                                newCustomValues[index] = customValue;
                                newTypes[index] = customValue;

                                setGlassesTypeCustomValue(newCustomValues);
                                setGlassesType(newTypes);
                              }}
                              placeholder="Dálka"
                            />
                          ) : (
                            <select
                              value={
                                glassesTypeOptions.includes(currentSelection)
                                  ? currentSelection
                                  : "DÁLKA"
                              }
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                const newTypes = [...glassesType];

                                newTypes[index] = e.target.value;
                                setGlassesType(newTypes);
                              }}
                            >
                              {glassesTypeOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setGlassesTypeCustomMode((prev) => {
                                const updated = [...prev];
                                const nextMode = !updated[index];
                                updated[index] = nextMode;

                                if (!nextMode) {
                                  setGlassesType((prevTypes) => {
                                    const nextTypes = [...prevTypes];
                                    nextTypes[index] =
                                      glassesTypeOptions.includes(
                                        nextTypes[index],
                                      )
                                        ? nextTypes[index]
                                        : "DÁLKA";
                                    return nextTypes;
                                  });
                                } else {
                                  setGlassesTypeCustomValue((prevValues) => {
                                    const nextValues = [...prevValues];
                                    nextValues[index] =
                                      prevValues[index] || currentSelection;
                                    return nextValues;
                                  });
                                }

                                return updated;
                              });
                            }}
                            className="btn-glasses-type-toggle"
                          >
                            ...
                          </button>
                        </span>
                        <span className="header-total">
                          <h1 className="glasses-total-h1">
                            {glassesTotal.toFixed(2)} Kč
                          </h1>
                        </span>
                        <button
                          type="button"
                          className="header-action-delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveGlasses(index);
                          }}
                        >
                          −
                        </button>
                      </div>
                      {!isCollapsed && (
                        <div className="glasses-content">
                          <div className="glasses-main-content">
                            {/* Dioptrie */}
                            <div>
                              <div className="dioptrie-header">
                                <h2>Dioptrie</h2>
                                <button
                                  type="button"
                                  onClick={() => toggleDioptrie(index)}
                                  className="btn-toggle-expand"
                                >
                                  +
                                </button>
                              </div>
                              <div className="dioptrie-grid">
                                <strong className="eyes-label">
                                  Pravé oko:
                                </strong>
                                <div className="eyes-inputs">
                                  <input
                                    type="text"
                                    value={glasses.right.sph}
                                    onChange={(e) =>
                                      handleGlassesChange(
                                        index,
                                        "right",
                                        "sph",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="SPH"
                                    className="input-dioptrie"
                                  />
                                  <input
                                    type="text"
                                    value={glasses.right.cyl}
                                    onChange={(e) =>
                                      handleGlassesChange(
                                        index,
                                        "right",
                                        "cyl",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="CYL"
                                    className="input-dioptrie"
                                  />
                                  <input
                                    type="text"
                                    value={glasses.right.osa}
                                    onChange={(e) =>
                                      handleGlassesChange(
                                        index,
                                        "right",
                                        "osa",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="OSA"
                                    className="input-dioptrie"
                                  />
                                  <input
                                    type="text"
                                    value={glasses.right.add}
                                    onChange={(e) =>
                                      handleGlassesChange(
                                        index,
                                        "right",
                                        "add",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="ADD"
                                    className="input-dioptrie"
                                  />
                                  {expandedDioptrie[index] && (
                                    <>
                                      <input
                                        type="text"
                                        value={glasses.right.prizma}
                                        onChange={(e) =>
                                          handleGlassesChange(
                                            index,
                                            "right",
                                            "prizma",
                                            e.target.value,
                                          )
                                        }
                                        placeholder="PRIZMA"
                                        className="input-dioptrie"
                                      />
                                      <input
                                        type="text"
                                        value={glasses.right.baze}
                                        onChange={(e) =>
                                          handleGlassesChange(
                                            index,
                                            "right",
                                            "baze",
                                            e.target.value,
                                          )
                                        }
                                        placeholder="BÁZE"
                                        className="input-dioptrie"
                                      />
                                    </>
                                  )}
                                </div>
                                <strong className="eyes-label">
                                  Levé oko:
                                </strong>
                                <div className="eyes-inputs">
                                  <input
                                    type="text"
                                    value={glasses.left.sph}
                                    onChange={(e) =>
                                      handleGlassesChange(
                                        index,
                                        "left",
                                        "sph",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="SPH"
                                    className="input-dioptrie"
                                  />
                                  <input
                                    type="text"
                                    value={glasses.left.cyl}
                                    onChange={(e) =>
                                      handleGlassesChange(
                                        index,
                                        "left",
                                        "cyl",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="CYL"
                                    className="input-dioptrie"
                                  />
                                  <input
                                    type="text"
                                    value={glasses.left.osa}
                                    onChange={(e) =>
                                      handleGlassesChange(
                                        index,
                                        "left",
                                        "osa",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="OSA"
                                    className="input-dioptrie"
                                  />
                                  <input
                                    type="text"
                                    value={glasses.left.add}
                                    onChange={(e) =>
                                      handleGlassesChange(
                                        index,
                                        "left",
                                        "add",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="ADD"
                                    className="input-dioptrie"
                                  />
                                  {expandedDioptrie[index] && (
                                    <>
                                      <input
                                        type="text"
                                        value={glasses.left.prizma}
                                        onChange={(e) =>
                                          handleGlassesChange(
                                            index,
                                            "left",
                                            "prizma",
                                            e.target.value,
                                          )
                                        }
                                        placeholder="PRIZMA"
                                        className="input-dioptrie"
                                      />
                                      <input
                                        type="text"
                                        value={glasses.left.baze}
                                        onChange={(e) =>
                                          handleGlassesChange(
                                            index,
                                            "left",
                                            "baze",
                                            e.target.value,
                                          )
                                        }
                                        placeholder="BÁZE"
                                        className="input-dioptrie"
                                      />
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Oddělovač */}
                            <div className="separator-vertical"></div>

                            {/* Centrační údaje */}
                            <div
                              className={`centration-container ${
                                expandedCentration[index]
                                  ? "centration-container-expanded"
                                  : "centration-container-normal"
                              }`}
                            >
                              <div>
                                <div className="dioptrie-header">
                                  <h2>Centrační údaje</h2>
                                  <button
                                    type="button"
                                    onClick={() => toggleCentration(index)}
                                    className="btn-toggle-expand"
                                  >
                                    +
                                  </button>
                                </div>
                                <div className="eyes-inputs-mb">
                                  <input
                                    type="text"
                                    value={glasses.right.pd}
                                    onChange={(e) =>
                                      handleGlassesChange(
                                        index,
                                        "right",
                                        "pd",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="PD"
                                    className="input-dioptrie"
                                  />
                                  <input
                                    type="text"
                                    value={glasses.right.vyska}
                                    onChange={(e) =>
                                      handleGlassesChange(
                                        index,
                                        "right",
                                        "vyska",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="Výška"
                                    className="input-dioptrie"
                                  />
                                  {expandedCentration[index] && (
                                    <>
                                      <input
                                        type="text"
                                        value={glasses.right.vertex}
                                        onChange={(e) =>
                                          handleGlassesChange(
                                            index,
                                            "right",
                                            "vertex",
                                            e.target.value,
                                          )
                                        }
                                        placeholder="Vertex"
                                        className="input-dioptrie"
                                      />
                                      <input
                                        type="text"
                                        value={glasses.right.panto}
                                        onChange={(e) =>
                                          handleGlassesChange(
                                            index,
                                            "right",
                                            "panto",
                                            e.target.value,
                                          )
                                        }
                                        placeholder="Panto"
                                        className="input-dioptrie"
                                      />
                                    </>
                                  )}
                                </div>
                                <div className="eyes-inputs">
                                  <input
                                    type="text"
                                    value={glasses.left.pd}
                                    onChange={(e) =>
                                      handleGlassesChange(
                                        index,
                                        "left",
                                        "pd",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="PD"
                                    className="input-dioptrie"
                                  />
                                  <input
                                    type="text"
                                    value={glasses.left.vyska}
                                    onChange={(e) =>
                                      handleGlassesChange(
                                        index,
                                        "left",
                                        "vyska",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="Výška"
                                    className="input-dioptrie"
                                  />
                                  {expandedCentration[index] && (
                                    <>
                                      <input
                                        type="text"
                                        value={glasses.left.vertex}
                                        onChange={(e) =>
                                          handleGlassesChange(
                                            index,
                                            "left",
                                            "vertex",
                                            e.target.value,
                                          )
                                        }
                                        placeholder="Vertex"
                                        className="input-dioptrie"
                                      />
                                      <input
                                        type="text"
                                        value={glasses.left.panto}
                                        onChange={(e) =>
                                          handleGlassesChange(
                                            index,
                                            "left",
                                            "panto",
                                            e.target.value,
                                          )
                                        }
                                        placeholder="Panto"
                                        className="input-dioptrie"
                                      />
                                    </>
                                  )}
                                </div>
                              </div>
                              {/* PBS - přes oba řádky */}
                              {expandedCentration[index] && (
                                <div className="pbs-container">
                                  <input
                                    type="text"
                                    value={glasses.pbs}
                                    onChange={(e) =>
                                      handleGlassesChange(
                                        index,
                                        "shared",
                                        "pbs",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="PBS"
                                    className="input-dioptrie"
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Obruby, Zábrus, Brýlové čočky */}
                          <div className="frame-section">
                            <div>
                              <input
                                type="text"
                                value={glasses.obruby}
                                onChange={(e) =>
                                  handleGlassesChange(
                                    index,
                                    "shared",
                                    "obruby",
                                    e.target.value,
                                  )
                                }
                                onKeyDown={(e) =>
                                  handleFramePluKeyDown(e, index)
                                }
                                placeholder="OBRUBA"
                                className="input-frame-full"
                              />
                              {glassesFrameData[index] && (
                                <div className="frame-data-display">
                                  <div>
                                    <strong>Kolekce:</strong>{" "}
                                    {glassesFrameData[index].collection}
                                  </div>
                                  <div>
                                    <strong>Produkt:</strong>{" "}
                                    {glassesFrameData[index].product}
                                  </div>
                                  <div>
                                    <strong>Barva:</strong>{" "}
                                    {glassesFrameData[index].color}
                                  </div>
                                  <div>
                                    <strong>Velikost:</strong>{" "}
                                    {glassesFrameData[index].size}
                                  </div>
                                  <div>
                                    <strong>Pohlaví:</strong>{" "}
                                    {glassesFrameData[index].gender}
                                  </div>
                                  <div>
                                    <strong>Materiál:</strong>{" "}
                                    {glassesFrameData[index].material}
                                  </div>
                                  <div>
                                    <strong>Typ:</strong>{" "}
                                    {glassesFrameData[index].type}
                                  </div>
                                  <div>
                                    <strong>Cena:</strong>{" "}
                                    {glassesFrameData[index].price} Kč
                                  </div>
                                  <div>
                                    <strong>Sazba DPH:</strong>{" "}
                                    {glassesFrameData[index].rate}%
                                  </div>
                                  {glassesFrameData[index].supplier_nick && (
                                    <div>
                                      <strong>Dodavatel:</strong>{" "}
                                      {glassesFrameData[index].supplier_nick}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            <input
                              type="text"
                              value={glasses.zabrus}
                              onChange={(e) =>
                                handleGlassesChange(
                                  index,
                                  "shared",
                                  "zabrus",
                                  e.target.value,
                                )
                              }
                              onKeyDown={(e) =>
                                handleServicePluKeyDown(e, index)
                              }
                              placeholder="ZÁBRUS"
                              className="input-frame-item"
                            />
                            {serviceLoading && <span>Načítám službu...</span>}
                            {serviceError && (
                              <span className="error-message">
                                {serviceError}
                              </span>
                            )}
                            {glassesServiceData[index] && (
                              <div className="frame-data-display">
                                <div>
                                  <strong>Název:</strong>{" "}
                                  {glassesServiceData[index].name}
                                </div>
                                <div>
                                  <strong>Množství:</strong>{" "}
                                  {glassesServiceData[index].amount}
                                </div>
                                <div>
                                  <strong>MJ:</strong>{" "}
                                  {glassesServiceData[index].uom}
                                </div>
                                <div>
                                  <strong>Cena:</strong>{" "}
                                  {glassesServiceData[index].price} Kč
                                </div>
                                <div>
                                  <strong>Sazba DPH:</strong>{" "}
                                  {glassesServiceData[index].rate}%
                                </div>
                                {glassesServiceData[index].category && (
                                  <div>
                                    <strong>Kategorie:</strong>{" "}
                                    {glassesServiceData[index].category}
                                  </div>
                                )}
                                {glassesServiceData[index].note && (
                                  <div>
                                    <strong>Poznámka:</strong>{" "}
                                    {glassesServiceData[index].note}
                                  </div>
                                )}
                              </div>
                            )}
                            <input
                              type="text"
                              value={glasses.brylove_cocky}
                              onChange={(e) =>
                                handleGlassesChange(
                                  index,
                                  "shared",
                                  "brylove_cocky",
                                  e.target.value,
                                )
                              }
                              onKeyDown={(e) =>
                                handleLensesPluKeyDown(e, index)
                              }
                              placeholder="BRÝLOVÉ ČOČKY"
                              className="input-frame-item"
                            />
                            {lensesLoading && (
                              <span>Načítám brýlové čočky...</span>
                            )}
                            {lensesError && (
                              <span className="error-message">
                                {lensesError}
                              </span>
                            )}
                            {glassesLensesData[index] && (
                              <div className="frame-data-display">
                                <div>
                                  <strong>PLU:</strong>{" "}
                                  {glassesLensesData[index].plu}
                                </div>
                                <div>
                                  <strong>Kód:</strong>{" "}
                                  {glassesLensesData[index].code}
                                </div>
                                <div>
                                  <strong>SPH:</strong>{" "}
                                  {glassesLensesData[index].sph}
                                </div>
                                <div>
                                  <strong>CYL:</strong>{" "}
                                  {glassesLensesData[index].cyl}
                                </div>
                                <div>
                                  <strong>AX:</strong>{" "}
                                  {glassesLensesData[index].ax}
                                </div>
                                <div>
                                  <strong>Cena:</strong>{" "}
                                  {glassesLensesData[index].price} Kč
                                </div>
                                <div>
                                  <strong>Sazba DPH:</strong>{" "}
                                  {glassesLensesData[index].rate}%
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className="payment-container">
          <h2 className="payment-header-title">Platby</h2>

          {/* Seznam položek k platbě */}
          <div className="payment-information payment-information-full">
            {paymentItems.length > 0 ? (
              <>
                <div className="payment-items-scroll">
                  {paymentItems.map((item, index) => (
                    <div key={index} className="payment-item-row">
                      <span>{item.model}</span>
                      <span>
                        {item.price.toFixed(2)} Kč{" "}
                        <span className="payment-item-rate">
                          (DPH: {item.rate}%)
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
                <div className="payment-total-row">
                  <span>Celkem:</span>
                  <span>
                    {paymentItems
                      .reduce((sum, item) => sum + item.price, 0)
                      .toFixed(2)}{" "}
                    Kč
                  </span>
                </div>
              </>
            ) : (
              <h3>Vyberte zboží do zakázky...</h3>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit(values);
              setTimeout(onClose, 2);
            }}
          >
            <div></div>
            {/* Tlačítka pro uložení, zrušení a případně další akci (smazat, naskladnit atd.) */}
            <div className="modal-actions">
              {thirdButton !== null && values.name !== "" && (
                <button
                  className={
                    thirdButton === "Smazat" ? "button-warning" : "button"
                  }
                  type="button"
                  onClick={handleThirdButtonClick}
                >
                  {thirdButton}
                </button>
              )}
              <button type="button" onClick={handleClose}>
                {secondButton}
              </button>
              <button type="submit">{firstButton}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
