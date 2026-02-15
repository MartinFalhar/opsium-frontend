import React, { useState, useEffect } from "react";
import ConfirmDelete from "./ConfirmDelete";
import SegmentedControl from "../../components/controls/SegmentedControl.jsx";
import SegmentedControlMulti from "../../components/controls/SegmentedControlMulti.jsx";
import { useStoreGetPluItem } from "../../hooks/useStoreGetPluItem.js";
import { useStoreGetPluFrame } from "../../hooks/useStoreGetPluFrame.js";
import "./Modal.css";
import "./ModalNewOrder.css";

export default function ModalNewOrder({
  fields,
  initialValues = {},
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
  const handleFramePluKeyPress = async (e, index) => {
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
            // Odebrat předchozí položku pro tento index, pokud existuje
            const filtered = prev.filter((item) => item.glassesIndex !== index);

            // Přidat novou položku
            const glassesTypeName = glassesType[index] || "DÁLKA";
            return [
              ...filtered,
              {
                glassesIndex: index,
                model: glassesTypeName,
                price: parseFloat(frameData.price) || 0,
                rate: parseFloat(frameData.rate) || 0,
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
                  type="text"
                  value={values.post_code}
                  onChange={(e) => handleChange("post_code", e.target.value)}
                  placeholder="PSČ"
                  style={{
                    width: "90px",
                  }}
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
          <h1>Položky zakázky</h1>
          <div className="order-obligatory-items">
            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "10px",
                alignItems: "center",
              }}
            >
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
                style={{
                  padding: "8px 12px",
                  whiteSpace: "nowrap",
                  width: "auto",
                  height: "fit-content",
                }}
              >
                + BRÝLE
              </button>
              <button
                type="button"
                style={{
                  padding: "8px 12px",
                  whiteSpace: "nowrap",
                  width: "auto",
                  height: "fit-content",
                }}
              >
                + KONTAKTNÍ ČOČKY
              </button>
              <button
                type="button"
                style={{
                  padding: "8px 12px",
                  whiteSpace: "nowrap",
                  width: "auto",
                  height: "fit-content",
                }}
              >
                + SERVIS
              </button>
            </div>
            {pluLoading && <span>Načítám...</span>}
            {pluError && <span style={{ color: "red" }}>{pluError}</span>}

            {/* Seznam přidaných položek */}
            {obligatoryItems.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                {obligatoryItems.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      gap: "10px",
                      padding: "10px",
                      border: "1px solid #ccc",
                      marginBottom: "10px",
                      borderRadius: "5px",
                      position: "relative",
                      alignItems: "center",
                    }}
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
                    <span style={{ fontSize: "0.7em" }}>
                      <strong>DPH:</strong> {item.rate}%
                    </span>
                    {hoveredItemIndex === index && (
                      <button
                        onClick={() => handleRemoveObligatoryItem(index)}
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "red",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: "24px",
                          height: "24px",
                          cursor: "pointer",
                          fontSize: "18px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 0,
                        }}
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
              <div style={{ marginTop: "20px" }}>
                {glassesItems.map((glasses, index) => {
                  const glassesTotal = paymentItems
                    .filter((item) => item.glassesIndex === index)
                    .reduce((sum, item) => sum + (item.price || 0), 0);
                  const isCollapsed = collapsedGlasses[index];
                  const currentSelection = glassesType[index] || "DÁLKA";
                  const isCustomMode = glassesTypeCustomMode[index];

                  return (
                    <div
                      key={index}
                      style={{
                        border: "1px solid #ccc",
                        marginBottom: "10px",
                        borderRadius: "15px",
                        position: "relative",
                      }}
                    >
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
                            style={{
                              width: "16px",
                              height: "16px",
                              padding: 0,
                              border: "1px solid var(--color-bg-g13)",
                              background: "transparent",
                              cursor: "pointer",
                              fontSize: "19px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "3px",
                              marginLeft: "6px",
                              color: "var(--color-bg-g13)",
                            }}
                          >
                            ...
                          </button>
                        </span>
                        <span className="header-total">
                          <h1
                            style={{
                              color: "var(--color-bg-g13)",
                            }}
                          >
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
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              alignItems: "flex-start",
                            }}
                          >
                            {/* Dioptrie */}
                            <div>
                              <div
                                style={{
                                  fontSize: "0.8em",
                                  marginBottom: "3px",
                                  color: "#666",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "5px",
                                }}
                              >
                                <h2>Dioptrie</h2>
                                <button
                                  type="button"
                                  onClick={() => toggleDioptrie(index)}
                                  style={{
                                    width: "16px",
                                    height: "16px",
                                    padding: 0,
                                    border: "1px solid #666",
                                    background: "transparent",
                                    cursor: "pointer",
                                    fontSize: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "3px",
                                  }}
                                >
                                  +
                                </button>
                              </div>
                              <div
                                style={{
                                  display: "grid",
                                  gridTemplateColumns: "auto 1fr",
                                  gridTemplateRows: "auto auto",
                                  gap: "10px",
                                  alignItems: "center",
                                }}
                              >
                                <strong style={{ width: "80px" }}>
                                  Pravé oko:
                                </strong>
                                <div style={{ display: "flex", gap: "10px" }}>
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
                                    style={{
                                      width: "80px",
                                      fontSize: "0.9em",
                                      fontWeight: "bold",
                                      padding: "0 5px",
                                    }}
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
                                    style={{
                                      width: "80px",
                                      fontSize: "0.9em",
                                      fontWeight: "bold",
                                      padding: "0 5px",
                                    }}
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
                                    style={{
                                      width: "80px",
                                      fontSize: "0.9em",
                                      fontWeight: "bold",
                                      padding: "0 5px",
                                    }}
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
                                    style={{
                                      width: "80px",
                                      fontSize: "0.9em",
                                      fontWeight: "bold",
                                      padding: "0 5px",
                                    }}
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
                                        style={{
                                          width: "80px",
                                          fontSize: "0.9em",
                                          fontWeight: "bold",
                                          padding: "0 5px",
                                        }}
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
                                        style={{
                                          width: "80px",
                                          fontSize: "0.9em",
                                          fontWeight: "bold",
                                          padding: "0 5px",
                                        }}
                                      />
                                    </>
                                  )}
                                </div>
                                <strong style={{ width: "80px" }}>
                                  Levé oko:
                                </strong>
                                <div style={{ display: "flex", gap: "10px" }}>
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
                                    style={{
                                      width: "80px",
                                      fontSize: "0.9em",
                                      fontWeight: "bold",
                                      padding: "0 5px",
                                    }}
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
                                    style={{
                                      width: "80px",
                                      fontSize: "0.9em",
                                      fontWeight: "bold",
                                      padding: "0 5px",
                                    }}
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
                                    style={{
                                      width: "80px",
                                      fontSize: "0.9em",
                                      fontWeight: "bold",
                                      padding: "0 5px",
                                    }}
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
                                    style={{
                                      width: "80px",
                                      fontSize: "0.9em",
                                      fontWeight: "bold",
                                      padding: "0 5px",
                                    }}
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
                                        style={{
                                          width: "80px",
                                          fontSize: "0.9em",
                                          fontWeight: "bold",
                                          padding: "0 5px",
                                        }}
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
                                        style={{
                                          width: "80px",
                                          fontSize: "0.9em",
                                          fontWeight: "bold",
                                          padding: "0 5px",
                                        }}
                                      />
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Oddělovač */}
                            <div
                              style={{
                                width: "1px",
                                height: "130px",
                                backgroundColor: "#ccc",
                                margin: "20px 5px 0 5px",
                              }}
                            ></div>

                            {/* Centrační údaje */}
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: expandedCentration[index]
                                  ? "1fr auto"
                                  : "1fr",
                                gap: "10px",
                              }}
                            >
                              <div>
                                <div
                                  style={{
                                    fontSize: "0.8em",
                                    marginBottom: "3px",
                                    color: "#666",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5px",
                                  }}
                                >
                                  <h2>Centrační údaje</h2>
                                  <button
                                    type="button"
                                    onClick={() => toggleCentration(index)}
                                    style={{
                                      width: "16px",
                                      height: "16px",
                                      padding: 0,
                                      border: "1px solid #666",
                                      background: "transparent",
                                      cursor: "pointer",
                                      fontSize: "12px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      borderRadius: "3px",
                                    }}
                                  >
                                    +
                                  </button>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    gap: "10px",
                                    marginBottom: "10px",
                                  }}
                                >
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
                                    style={{
                                      width: "80px",
                                      fontSize: "0.9em",
                                      fontWeight: "bold",
                                      padding: "0 5px",
                                    }}
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
                                    style={{
                                      width: "80px",
                                      fontSize: "0.9em",
                                      fontWeight: "bold",
                                      padding: "0 5px",
                                    }}
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
                                        style={{
                                          width: "80px",
                                          fontSize: "0.9em",
                                          fontWeight: "bold",
                                          padding: "0 5px",
                                        }}
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
                                        style={{
                                          width: "80px",
                                          fontSize: "0.9em",
                                          fontWeight: "bold",
                                          padding: "0 5px",
                                        }}
                                      />
                                    </>
                                  )}
                                </div>
                                <div style={{ display: "flex", gap: "10px" }}>
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
                                    style={{
                                      width: "80px",
                                      fontSize: "0.9em",
                                      fontWeight: "bold",
                                      padding: "0 5px",
                                    }}
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
                                    style={{
                                      width: "80px",
                                      fontSize: "0.9em",
                                      fontWeight: "bold",
                                      padding: "0 5px",
                                    }}
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
                                        style={{
                                          width: "80px",
                                          fontSize: "0.9em",
                                          fontWeight: "bold",
                                          padding: "0 5px",
                                        }}
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
                                        style={{
                                          width: "80px",
                                          fontSize: "0.9em",
                                          fontWeight: "bold",
                                          padding: "0 5px",
                                        }}
                                      />
                                    </>
                                  )}
                                </div>
                              </div>
                              {/* PBS - přes oba řádky */}
                              {expandedCentration[index] && (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
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
                                    style={{
                                      width: "80px",
                                      fontSize: "0.9em",
                                      fontWeight: "bold",
                                      padding: "0 5px",
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Obruby, Zábrus, Brýlové čočky */}
                          <div
                            style={{
                              marginTop: "15px",
                              display: "flex",
                              flexDirection: "column",
                              gap: "10px",
                            }}
                          >
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
                                onKeyPress={(e) =>
                                  handleFramePluKeyPress(e, index)
                                }
                                placeholder="OBRUBA"
                                style={{
                                  fontSize: "0.9em",
                                  fontWeight: "bold",
                                  padding: "5px",
                                  width: "100%",
                                }}
                              />
                              {glassesFrameData[index] && (
                                <div
                                  style={{
                                    marginTop: "5px",
                                    padding: "10px",
                                    background: "var(--color-bg-b11)",
                                    borderRadius: "5px",
                                    fontSize: "0.85em",
                                  }}
                                >
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
                              placeholder="ZÁBRUS"
                              style={{
                                fontSize: "0.9em",
                                fontWeight: "bold",
                                padding: "5px",
                              }}
                            />
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
                              placeholder="BRÝLOVÉ ČOČKY"
                              style={{
                                fontSize: "0.9em",
                                fontWeight: "bold",
                                padding: "5px",
                              }}
                            />
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
          <h2
            style={{
              color: "var(--color-bg-b13)",
            }}
          >
            Platby
          </h2>

          {/* Seznam položek k platbě */}
          <div className="payment-information" style={{ width: "100%" }}>
            {paymentItems.length > 0 && (
              <>
                {paymentItems.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "5px 0",
                      borderBottom: "1px solid var(--color-el-e)",
                    }}
                  >
                    <span>{item.model}</span>
                    <span>
                      {item.price.toFixed(2)} Kč{" "}
                      <span style={{ fontSize: "0.7em" }}>
                        (DPH: {item.rate}%)
                      </span>
                    </span>
                  </div>
                ))}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    marginTop: "10px",
                    fontWeight: "bold",
                    fontSize: "1.2em",
                    borderTop: "2px solid var(--color-el-i)",
                  }}
                >
                  <span>Celkem:</span>
                  <span>
                    {paymentItems
                      .reduce((sum, item) => sum + item.price, 0)
                      .toFixed(2)}{" "}
                    Kč
                  </span>
                </div>
              </>
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
