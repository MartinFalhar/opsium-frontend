import React, { useState, useEffect, useRef } from "react";
import ConfirmDelete from "./ConfirmDelete";
import SegmentedControl from "../../components/controls/SegmentedControl.jsx";
import SegmentedControlMulti from "../../components/controls/SegmentedControlMulti.jsx";
import ModalPayment from "./ModalPayment";
import { useStoreGetPluItem } from "../../hooks/useStoreGetPluItem.js";
import { useStoreGetPluFrame } from "../../hooks/useStoreGetPluFrame.js";
import { useStoreGetPluService } from "../../hooks/useStoreGetPluService.js";
import { useStoreGetPluLenses } from "../../hooks/useStoreGetPluLenses.js";
import { useOrdersLoadItems } from "../../hooks/useOrdersLoadItems.js";
import { useOrdersSaveDioptricValues } from "../../hooks/useOrdersSaveDioptricValues.js";
import "./Modal.css";
import "./ModalNewOrder.css";

const API_URL = import.meta.env.VITE_API_URL;

const paymentMethodToAttrib = {
  hotovost: 1,
  "platební karta": 2,
  "převod na účet": 3,
  "šek": 4,
  "okamžitá QR platba": 5,
};

export default function ModalNewOrder({
  initialValues = {},
  formattedInvoiceNumber = "",
  onSubmit,
  onClose,
  onCancel,
  firstButton,
  secondButton,
  thirdButton,
  onClickThirdButton,
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [values, setValues] = useState(initialValues);

  // Hook pro načtení položky podle PLU
  const {
    loading: pluLoading,
    error: pluError,
    getPluItem,
  } = useStoreGetPluItem();

  // Hook pro načtení obruby podle PLU
  const {
    frame: _pluFrame,
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

  const {
    loadOrderItems,
    loading: orderItemsLoading,
    error: orderItemsError,
  } = useOrdersLoadItems();

  const {
    saveOrderDioptricValues,
    loading: saveDioptricLoading,
    error: saveDioptricError,
  } = useOrdersSaveDioptricValues();

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
  const isAddingObligatoryItemRef = useRef(false);
  const frameRequestLocksRef = useRef({});
  const serviceRequestLocksRef = useRef({});
  const lensesRequestLocksRef = useRef({});

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
  const [expandedPaymentGlasses, setExpandedPaymentGlasses] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSaving, setPaymentSaving] = useState(false);
  const [paidTransactions, setPaidTransactions] = useState([]);
  const [loadedOrderItemsId, setLoadedOrderItemsId] = useState(null);

  // Aktualizace values při změně initialValues
  useEffect(() => {
    setValues((prev) => {
      const init = { ...prev };

      Object.keys(prev).forEach((key) => {
        const val = initialValues?.[key];
        init[key] = val !== undefined && val !== null ? val : "";
      });

      Object.keys(initialValues || {}).forEach((key) => {
        if (!(key in init)) {
          const val = initialValues?.[key];
          init[key] = val !== undefined && val !== null ? val : "";
        }
      });

      return init;
    });
  }, [initialValues]);

  //Univerzální handler pro změnu hodnoty pole
  //libovolného elementu formuláře
  const handleChange = (varName, value) => {
    setValues((prev) => ({ ...prev, [varName]: value }));
  };

  const buildGlassesSpecification = (index) => {
    const glasses = glassesItems[index];
    if (!glasses) {
      return null;
    }

    return {
      glasses_type: glassesType[index] || null,
      right: glasses.right,
      left: glasses.left,
      pbs: glasses.pbs,
      entered_plu: {
        frame: glasses.obruby,
        service: glasses.zabrus,
        lenses: glasses.brylove_cocky,
      },
    };
  };

  const buildDioptricPayload = () => {
    return glassesItems
      .map((glasses, index) => {
        const order_item_id = glassesFrameData[index]?.order_item_id;
        if (!order_item_id) {
          return null;
        }

        return {
          order_item_id,
          right: {
            sph: glasses?.right?.sph ?? "",
            cyl: glasses?.right?.cyl ?? "",
            osa: glasses?.right?.osa ?? "",
            add: glasses?.right?.add ?? "",
            prizma: glasses?.right?.prizma ?? "",
            baze: glasses?.right?.baze ?? "",
            pd: glasses?.right?.pd ?? "",
            vyska: glasses?.right?.vyska ?? "",
            vertex: glasses?.right?.vertex ?? "",
            panto: glasses?.right?.panto ?? "",
          },
          left: {
            sph: glasses?.left?.sph ?? "",
            cyl: glasses?.left?.cyl ?? "",
            osa: glasses?.left?.osa ?? "",
            add: glasses?.left?.add ?? "",
            prizma: glasses?.left?.prizma ?? "",
            baze: glasses?.left?.baze ?? "",
            pd: glasses?.left?.pd ?? "",
            vyska: glasses?.left?.vyska ?? "",
            vertex: glasses?.left?.vertex ?? "",
            panto: glasses?.left?.panto ?? "",
          },
        };
      })
      .filter(Boolean);
  };

  const handleSecondButtonClick = async () => {
    if (secondButton !== "Návrh") {
      handleClose();
      return;
    }

    const orderId = values?.order_id;
    if (!orderId) {
      handleClose();
      return;
    }

    try {
      const payload = buildDioptricPayload();
      await saveOrderDioptricValues(orderId, payload, {
        note: values?.note ?? "",
        delivery_address: values?.address_for_delivery ?? "",
      });

      if (onSubmit) {
        await onSubmit(values);
      }

      handleClose();
    } catch (error) {
      console.error("Nepodařilo se uložit údaje zakázky:", error);
      alert(saveDioptricError || "Nepodařilo se uložit údaje zakázky.");
    }
  };

  // Handler pro přidání položky do obligatoryItems
  const handleAddObligatoryItem = async () => {
    if (isAddingObligatoryItemRef.current || pluLoading) return;
    if (!values.plu || values.plu.trim() === "") return;

    isAddingObligatoryItemRef.current = true;
    const enteredPlu = values.plu.trim();
    try {
      const fetchedItem = await getPluItem(enteredPlu, values.order_id, {
        quantity: 1,
        item_type: "goods",
        group: 0,
        specification_id: null,
        movement_type: "SALE",
        item_status: "ON_STOCK",
      });

      if (fetchedItem) {
        const newItem = {
          plu: enteredPlu,
          ...fetchedItem,
        };
        setObligatoryItems((prev) => [...prev, newItem]);
        handleChange("plu", "");
      }
    } finally {
      isAddingObligatoryItemRef.current = false;
    }
  };

  // Handler pro odstranění položky z obligatoryItems
  const handleRemoveObligatoryItem = async (index) => {
    const selectedItem = obligatoryItems[index];
    const orderId = Number(values?.order_id);
    const storeItemId = Number(selectedItem?.store_item_id);
    const storeBatchId = Number(selectedItem?.store_batch_id);

    if (
      !Number.isFinite(orderId) ||
      !Number.isFinite(storeItemId) ||
      !Number.isFinite(storeBatchId)
    ) {
      setObligatoryItems((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    try {
      const res = await fetch(`${API_URL}/store/order-item-delete-draft`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          order_id: orderId,
          store_item_id: storeItemId,
          store_batch_id: storeBatchId,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Nepodařilo se odstranit položku.");
      }

      setObligatoryItems((prev) => prev.filter((_, i) => i !== index));

      if (onSubmit) {
        await onSubmit(values);
      }
    } catch (error) {
      console.error("Nepodařilo se odstranit položku zakázky:", error);
      alert(error?.message || "Nepodařilo se odstranit položku.");
    }
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

  const removeGlassesFromState = (index) => {
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
  };

  // Handler pro odstranění položky brýlí
  const handleRemoveGlasses = async (index) => {
    const orderId = Number(values?.order_id);
    const orderItemIds = [
      Number(glassesFrameData[index]?.order_item_id),
      Number(glassesServiceData[index]?.order_item_id),
      Number(glassesLensesData[index]?.order_item_id),
    ].filter((value) => Number.isFinite(value) && value > 0);

    if (!Number.isFinite(orderId) || orderItemIds.length === 0) {
      removeGlassesFromState(index);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/store/order-glasses-delete-draft`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          order_id: orderId,
          order_item_ids: orderItemIds,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Nepodařilo se odstranit blok brýlí.");
      }

      removeGlassesFromState(index);

      if (onSubmit) {
        await onSubmit(values);
      }
    } catch (error) {
      console.error("Nepodařilo se odstranit blok brýlí:", error);
      alert(error?.message || "Nepodařilo se odstranit blok brýlí.");
    }
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

  const handleAddFrameItem = async (index, rawPluValue) => {
    if (frameRequestLocksRef.current[index] || frameLoading) return;

    const enteredPlu = (rawPluValue ?? "").trim();
    if (!enteredPlu) return;

    frameRequestLocksRef.current[index] = true;
    try {
      setGlassesItems((prev) => {
        const updated = [...prev];
        if (updated[index]) {
          updated[index] = {
            ...updated[index],
            obruby: enteredPlu,
          };
        }
        return updated;
      });

      const frameData = await getPluFrame(enteredPlu, {
        order_id: values.order_id,
        quantity: 1,
        group: index + 1,
        specification_id: null,
        specification: {
          ...(buildGlassesSpecification(index) || {}),
          entered_plu: {
            frame: enteredPlu,
            service: glassesItems[index]?.zabrus || "",
            lenses: glassesItems[index]?.brylove_cocky || "",
          },
        },
        movement_type: "SALE",
        item_status: "ON_STOCK",
      });

      if (frameData) {
        setGlassesFrameData((prev) => {
          const updated = [...prev];
          updated[index] = frameData;
          return updated;
        });
      }
    } finally {
      frameRequestLocksRef.current[index] = false;
    }
  };

  // Handler pro načtení obruby podle PLU
  const handleFramePluKeyDown = async (e, index) => {
    if (e.key === "Enter" && !e.repeat) {
      e.preventDefault();
      await handleAddFrameItem(index, e.target.value);
    }
  };

  // Handler pro načtení služby podle PLU (ZÁBRUS)
  const handleServicePluKeyDown = async (e, index) => {
    if (e.key === "Enter" && !e.repeat) {
      e.preventDefault();
      if (serviceRequestLocksRef.current[index] || serviceLoading) {
        return;
      }

      const plu = e.target.value.trim();
      if (plu) {
        serviceRequestLocksRef.current[index] = true;
        try {
          const serviceData = await getPluService(plu, {
            order_id: values.order_id,
            quantity: 1,
            group: index + 1,
            specification_id: null,
            specification: buildGlassesSpecification(index),
            movement_type: "SALE",
            item_status: "ON_STOCK",
          });
          if (serviceData) {
            // Uložit data služby
            setGlassesServiceData((prev) => {
              const updated = [...prev];
              updated[index] = serviceData;
              return updated;
            });
          }
        } finally {
          serviceRequestLocksRef.current[index] = false;
        }
      }
    }
  };

  // Handler pro načtení brýlových čoček podle PLU
  const handleLensesPluKeyDown = async (e, index) => {
    if (e.key === "Enter" && !e.repeat) {
      e.preventDefault();
      if (lensesRequestLocksRef.current[index] || lensesLoading) {
        return;
      }

      const plu = e.target.value.trim();
      if (plu) {
        lensesRequestLocksRef.current[index] = true;
        try {
          const lensesData = await getPluLenses(plu, {
            order_id: values.order_id,
            quantity: 1,
            group: index + 1,
            specification_id: null,
            specification: buildGlassesSpecification(index),
            movement_type: "SALE",
            item_status: "ON_STOCK",
          });
          if (lensesData) {
            // Uložit data brýlových čoček
            setGlassesLensesData((prev) => {
              const updated = [...prev];
              updated[index] = lensesData;
              return updated;
            });
          }
        } finally {
          lensesRequestLocksRef.current[index] = false;
        }
      }
    }
  };

  // UseEffect pro aktualizaci paymentItems:
  // obligatoryItems + 1 souhrnná položka za každý blok brýlí
  useEffect(() => {
    const obligatoryPayments = obligatoryItems.map((item) => ({
      model: item.model,
      price: parseFloat(item.price) || 0,
      rate: parseFloat(item.rate) || 0,
    }));

    const glassesPayments = glassesItems
      .map((_, index) => {
        const framePrice = parseFloat(glassesFrameData[index]?.price) || 0;
        const servicePrice = parseFloat(glassesServiceData[index]?.price) || 0;
        const lensesPrice = parseFloat(glassesLensesData[index]?.price) || 0;
        const totalPrice = framePrice + servicePrice + lensesPrice;

        const hasAnyItem =
          Boolean(glassesFrameData[index]) ||
          Boolean(glassesServiceData[index]) ||
          Boolean(glassesLensesData[index]);

        if (!hasAnyItem) {
          return null;
        }

        return {
          glassesIndex: index,
          model: glassesType[index] || "DÁLKA",
          price: totalPrice,
          rate: 0,
          source: "glasses-total",
        };
      })
      .filter(Boolean);

    setPaymentItems([...obligatoryPayments, ...glassesPayments]);
  }, [
    obligatoryItems,
    glassesItems,
    glassesType,
    glassesFrameData,
    glassesServiceData,
    glassesLensesData,
  ]);

  useEffect(() => {
    const orderId = values?.order_id;
    if (!orderId) {
      return;
    }

    if (loadedOrderItemsId === orderId) {
      return;
    }

    const reconstructOrderItems = async () => {
      try {
        const rows = await loadOrderItems(orderId);

        const obligatory = [];
        const glassesByGroup = new Map();

        const emptyEye = {
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
        };

        const normalizeEye = (eye) => ({
          sph: eye?.sph ?? "",
          cyl: eye?.cyl ?? "",
          osa: eye?.osa ?? "",
          add: eye?.add ?? "",
          prizma: eye?.prizma ?? "",
          baze: eye?.baze ?? "",
          pd: eye?.pd ?? "",
          vyska: eye?.vyska ?? "",
          vertex: eye?.vertex ?? "",
          panto: eye?.panto ?? "",
        });

        const ensureGroup = (groupNumber) => {
          if (!glassesByGroup.has(groupNumber)) {
            glassesByGroup.set(groupNumber, {
              glasses: {
                right: { ...emptyEye },
                left: { ...emptyEye },
                pbs: "",
                obruby: "",
                zabrus: "",
                brylove_cocky: "",
              },
              frameData: null,
              serviceData: null,
              lensesData: null,
              type: "DÁLKA",
            });
          }

          return glassesByGroup.get(groupNumber);
        };

        for (const row of rows) {
          const groupNumber = Number(row.group || 0);
          const specs = row.specs || null;

          if (groupNumber === 0 && row.item_type === "goods") {
            obligatory.push({
              plu: row.goods_plu ?? "",
              model: row.goods_model ?? "",
              size: row.goods_size ?? "",
              color: row.goods_color ?? "",
              uom: row.goods_uom ?? "",
              price: Number(row.unit_sale_price ?? row.goods_price ?? 0),
              rate: Number(row.goods_rate ?? 0),
              store_item_id: row.store_item_id,
              order_item_id: row.id,
              store_batch_id: row.store_batch_id,
            });
            continue;
          }

          if (groupNumber > 0) {
            const bucket = ensureGroup(groupNumber);

            if (specs) {
              bucket.type = specs.glasses_type || bucket.type;
              bucket.glasses.right = normalizeEye(specs.right);
              bucket.glasses.left = normalizeEye(specs.left);
              bucket.glasses.pbs = specs.pbs || bucket.glasses.pbs;
              bucket.glasses.obruby =
                specs?.entered_plu?.frame || bucket.glasses.obruby;
              bucket.glasses.zabrus =
                specs?.entered_plu?.service || bucket.glasses.zabrus;
              bucket.glasses.brylove_cocky =
                specs?.entered_plu?.lenses || bucket.glasses.brylove_cocky;
            }

            if (row.item_type === "frame") {
              bucket.frameData = {
                order_item_id: row.id,
                collection: row.frame_collection,
                product: row.frame_product,
                color: row.frame_color,
                size: row.frame_size,
                gender: row.frame_gender,
                material: row.frame_material,
                type: row.frame_type,
                price: Number(row.unit_sale_price ?? row.frame_price ?? 0),
                rate: 0,
                supplier_nick: row.frame_supplier_nick,
              };

              const hasDioptricValues = [
                row.dioptric_ps,
                row.dioptric_pc,
                row.dioptric_pa,
                row.dioptric_padd,
                row.dioptric_pp,
                row.dioptric_pb,
                row.dioptric_ls,
                row.dioptric_lc,
                row.dioptric_la,
                row.dioptric_ladd,
                row.dioptric_lp,
                row.dioptric_lb,
              ].some((value) => value !== null && value !== undefined);

              if (hasDioptricValues) {
                bucket.glasses.right = {
                  ...bucket.glasses.right,
                  sph: row.dioptric_ps ?? "",
                  cyl: row.dioptric_pc ?? "",
                  osa: row.dioptric_pa ?? "",
                  add: row.dioptric_padd ?? "",
                  prizma: row.dioptric_pp ?? "",
                  baze: row.dioptric_pb ?? "",
                };

                bucket.glasses.left = {
                  ...bucket.glasses.left,
                  sph: row.dioptric_ls ?? "",
                  cyl: row.dioptric_lc ?? "",
                  osa: row.dioptric_la ?? "",
                  add: row.dioptric_ladd ?? "",
                  prizma: row.dioptric_lp ?? "",
                  baze: row.dioptric_lb ?? "",
                };
              }

              const hasCentrationValues = [
                row.centration_p_pd,
                row.centration_p_v,
                row.centration_p_vd,
                row.centration_p_panto,
                row.centration_l_pd,
                row.centration_l_v,
                row.centration_l_vd,
                row.centration_l_panto,
              ].some((value) => value !== null && value !== undefined);

              if (hasCentrationValues) {
                bucket.glasses.right = {
                  ...bucket.glasses.right,
                  pd: row.centration_p_pd ?? "",
                  vyska: row.centration_p_v ?? "",
                  vertex: row.centration_p_vd ?? "",
                  panto: row.centration_p_panto ?? "",
                };

                bucket.glasses.left = {
                  ...bucket.glasses.left,
                  pd: row.centration_l_pd ?? "",
                  vyska: row.centration_l_v ?? "",
                  vertex: row.centration_l_vd ?? "",
                  panto: row.centration_l_panto ?? "",
                };
              }
            }

            if (row.item_type === "lens") {
              bucket.lensesData = {
                order_item_id: row.id,
                plu: row.lens_plu,
                code: row.lens_code,
                sph: row.lens_sph,
                cyl: row.lens_cyl,
                ax: row.lens_ax,
                price: Number(row.unit_sale_price ?? row.lens_price ?? 0),
                rate: 0,
              };
            }

            if (row.item_type === "service") {
              bucket.serviceData = {
                order_item_id: row.id,
                plu: row.service_plu,
                name: row.service_name || "Služba",
                amount: row.service_amount,
                uom: row.service_uom,
                price: Number(row.unit_sale_price ?? row.service_price ?? 0),
                rate: Number(row.service_rate ?? 0),
                category: row.service_category,
                note: row.service_note,
              };
            }
          }
        }

        const groups = [...glassesByGroup.entries()].sort((a, b) => a[0] - b[0]);

        setObligatoryItems(obligatory);
        setGlassesItems(groups.map(([, groupData]) => groupData.glasses));
        setGlassesType(groups.map(([, groupData]) => groupData.type || "DÁLKA"));
        setGlassesTypeCustomMode(groups.map(() => false));
        setGlassesTypeCustomValue(groups.map(() => ""));
        setCollapsedGlasses(groups.map(() => false));
        setExpandedCentration(groups.map(() => false));
        setExpandedDioptrie(groups.map(() => false));
        setGlassesFrameData(groups.map(([, groupData]) => groupData.frameData));
        setGlassesServiceData(groups.map(([, groupData]) => groupData.serviceData));
        setGlassesLensesData(groups.map(([, groupData]) => groupData.lensesData));

        setLoadedOrderItemsId(orderId);
      } catch {
        setLoadedOrderItemsId(null);
      }
    };

    reconstructOrderItems();
  }, [values?.order_id, loadedOrderItemsId, loadOrderItems]);

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
    } else if (thirdButton === "Zpět") {
      handleClose();
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

  const handleOpenPaymentModal = () => {
    setShowPaymentModal(true);
  };

  const handleCancelPaymentModal = () => {
    if (paymentSaving) {
      return;
    }

    setShowPaymentModal(false);
  };

  const handlePayTransaction = async ({ amount, method }) => {
    const orderId = Number(values?.order_id);

    if (!Number.isFinite(orderId) || orderId <= 0) {
      alert("Chybí order_id pro zaúčtování platby.");
      return;
    }

    setPaymentSaving(true);

    try {
      const attribCode = paymentMethodToAttrib[method] ?? 1;

      const res = await fetch(`${API_URL}/store/new-transaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          invoice_id: orderId,
          attrib: attribCode,
          price_a: amount,
          vat_a: 0,
          price_b: 0,
          vat_b: 0,
          price_c: 0,
          vat_c: 0,
        }),
      });

      const data = await res.json();

      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Nepodařilo se zaúčtovat platbu.");
      }

      setPaidTransactions((prev) => [
        ...prev,
        {
          amount,
          method,
          createdAt: new Date().toISOString(),
        },
      ]);

      setShowPaymentModal(false);
    } catch (error) {
      console.error("Nepodařilo se zaúčtovat platbu:", error);
      alert(error?.message || "Nepodařilo se zaúčtovat platbu.");
    } finally {
      setPaymentSaving(false);
    }
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
              <h3>Číslo zakázky: {formattedInvoiceNumber || "—"}</h3>
              <h5>Termín zhotovení</h5>
              <SegmentedControl
                items={orderDates}
                selectedValue={orderDatesSelection}
                onClick={(item) => setOrderDatesSelection(item)}
              />
              <h5>Způsob oznámení</h5>
              <SegmentedControlMulti
                items={orderNotice}
                selectedValues={orderNoticeSelection}
                onChange={setOrderNoticeSelection}
              />
              <h5>Poslat poštou na:</h5>
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

            <textarea
              value={values.note || ""}
              onChange={(e) => handleChange("note", e.target.value)}
              placeholder="Poznámka k zakázce"
              rows={3}
            />
          </div>

          <div className="order-obligatory-items">
            <div className="plu-buttons-container">
              <input
                type="text"
                value={values.plu}
                onChange={(e) => handleChange("plu", e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.repeat) {
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
            {orderItemsLoading && <span>Načítám položky zakázky...</span>}
            {orderItemsError && (
              <span className="error-message">{orderItemsError}</span>
            )}
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
                                  {expandedDioptrie[index] ? "−" : "+"}
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
                                    {expandedCentration[index] ? "−" : "+"}
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
                              {frameLoading && <span>Načítám obrubu...</span>}
                              {frameError && (
                                <span className="error-message">{frameError}</span>
                              )}
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
        <div className="payment-side-panel">
          <div className="payment-container">
            <h2 className="payment-header-title">Platby</h2>

            {/* Seznam položek k platbě */}
            <div className="payment-information payment-information-full">
              {paymentItems.length > 0 ? (
                <>
                  <div className="payment-items-scroll">
                    {paymentItems.map((item, index) => {
                      const isGlassesTotal = item.source === "glasses-total";
                      const glassesIndex = item.glassesIndex;
                      const isExpanded =
                        isGlassesTotal &&
                        glassesIndex !== undefined &&
                        expandedPaymentGlasses[glassesIndex];

                      const framePrice =
                        glassesIndex !== undefined
                          ? parseFloat(glassesFrameData[glassesIndex]?.price) || 0
                          : 0;
                      const servicePrice =
                        glassesIndex !== undefined
                          ? parseFloat(glassesServiceData[glassesIndex]?.price) || 0
                          : 0;
                      const lensesPrice =
                        glassesIndex !== undefined
                          ? parseFloat(glassesLensesData[glassesIndex]?.price) || 0
                          : 0;

                      return (
                        <React.Fragment key={index}>
                          <div
                            className={`payment-item-row${isGlassesTotal ? " payment-item-row-clickable" : ""}`}
                            onClick={() => {
                              if (!isGlassesTotal || glassesIndex === undefined) {
                                return;
                              }

                              setExpandedPaymentGlasses((prev) => ({
                                ...prev,
                                [glassesIndex]: !prev[glassesIndex],
                              }));
                            }}
                          >
                            <span>
                              {isGlassesTotal && (
                                <span className="payment-item-toggle-icon">
                                  {isExpanded ? "▾" : "▸"}
                                </span>
                              )}
                              {item.model}
                            </span>
                            <span>
                              {item.price.toFixed(2)} Kč{" "}
                              <span className="payment-item-rate">
                                (DPH: {item.rate}%)
                              </span>
                            </span>
                          </div>

                          {isExpanded && (
                            <div className="payment-item-breakdown">
                              <div className="payment-item-breakdown-row">
                                <span>Obruba</span>
                                <span>{framePrice.toFixed(2)} Kč</span>
                              </div>
                              <div className="payment-item-breakdown-row">
                                <span>Zábrus</span>
                                <span>{servicePrice.toFixed(2)} Kč</span>
                              </div>
                              <div className="payment-item-breakdown-row">
                                <span>Brýlové čočky</span>
                                <span>{lensesPrice.toFixed(2)} Kč</span>
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
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
              {paidTransactions.length > 0 && (
                <div className="payment-total-row" style={{ marginTop: "8px" }}>
                  <div style={{ width: "100%" }}>
                    {paidTransactions.map((payment, index) => (
                      <div
                        key={`${payment.createdAt}-${index}`}
                        className="payment-item-row"
                      >
                        <span>{payment.method}</span>
                        <span>{Number(payment.amount).toFixed(2)} Kč</span>
                      </div>
                    ))}
                    <div className="payment-item-row">
                      <span>Uhrazeno celkem</span>
                      <span>
                        {paidTransactions
                          .reduce(
                            (sum, payment) => sum + Number(payment.amount || 0),
                            0,
                          )
                          .toFixed(2)}{" "}
                        Kč
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="payment-actions-panel">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const orderId = values?.order_id;

                if (orderId) {
                  try {
                    const payload = buildDioptricPayload();
                    await saveOrderDioptricValues(orderId, payload, {
                      note: values?.note ?? "",
                      delivery_address: values?.address_for_delivery ?? "",
                    });
                  } catch (error) {
                    console.error("Nepodařilo se uložit dioptrické hodnoty:", error);
                    alert(
                      saveDioptricError || "Nepodařilo se uložit dioptrické hodnoty.",
                    );
                    return;
                  }
                }

                onSubmit(values);
                setTimeout(onClose, 2);
              }}
            >
              <div></div>
              {/* Tlačítka pro uložení, zrušení a případně další akci (smazat, naskladnit atd.) */}
              <div className="modal-actions payment-actions-layout">
                <button
                  type="button"
                  className="payment-button-full"
                  onClick={handleOpenPaymentModal}
                >
                  Platba
                </button>
                <button type="button" className="payment-button-full">
                  Tisk zakázky
                </button>
                <div className="payment-actions-row">
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
                  <button
                    type="button"
                    onClick={handleSecondButtonClick}
                    disabled={saveDioptricLoading}
                  >
                    {secondButton}
                  </button>
                  <button type="submit">{firstButton}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {showPaymentModal && (
        <ModalPayment
          defaultAmount={paymentItems
            .reduce((sum, item) => sum + item.price, 0)
            .toFixed(2)}
          loading={paymentSaving}
          onCancel={handleCancelPaymentModal}
          onPay={handlePayTransaction}
        />
      )}
    </div>
  );
}
