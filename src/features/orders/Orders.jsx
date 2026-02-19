import React from "react";
import { useEffect, useState } from "react";
import "./Orders.css";
import ModalNewOrder from "../../components/modal/ModalNewOrder.jsx";
import { useUser } from "../../context/UserContext.jsx";
import PuffLoaderSpinnerLarge from "../../components/loader/PuffLoaderSpinnerLarge.jsx";
import Pagination from "../../components/pagination/Pagination.jsx";
import { useOrdersGetList } from "../../hooks/useOrdersGetList.js";
import { useOrdersNew } from "../../hooks/useOrdersNew.js";
import SegmentedControl from "../../components/controls/SegmentedControl.jsx";
const API_URL = import.meta.env.VITE_API_URL;

function Invoices() {
  const [orderInformation] = useState({});
  const [searchInvoice, setSearchInvoices] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newOrderNumberFormatted, setNewOrderNumberFormatted] = useState("");
  const { user, activeId } = useUser();
  const [daysOldSelection, setDaysOldSelection] = useState("vše");
  const [statusSelection, setStatusSelection] = useState("");

  const initialValues = {
    client_id: activeId?.client_id ?? "",
    member_id: activeId?.member_id ?? "",
    // name: activeId?.name ?? "",
    date: new Date().toLocaleDateString("cs-CZ"),
    degree_before: "Ing.",
    name: "Robert",
    surname: "Okulla",
    degree_after: "Ph.D.",
    street: "Hlavní 123",
    city: "Praha",
    post_code: "11000",
    email: "robert.okulla@example.com",
    phone: "+420123456789",
  };


  const formatInvoiceNumber = (invoice) => {
    const yearShort = String(invoice?.year ?? "").slice(-2).padStart(2, "0");
    const branch = String(invoice?.branch_id ?? "").padStart(2, "0");
    const number = String(invoice?.number ?? "").padStart(5, "0");
    return `${yearShort}${branch}${number}`;
  };

  const daysOldOptions = [
    "dnes",
    "včera",
    "3 dny",
    "týden",
    "14 dnů",
    "měsíc",
    "vše",
  ];

  const daysOldMap = {
    dnes: 1,
    včera: 2,
    "3 dny": 3,
    týden: 7,
    "14 dnů": 14,
    měsíc: 30,
    vše: null,
  };
  const statusOptions = ["otevřeno", "zaplaceno", "zrušeno", "vydáno", "vše"];

  const statusMap = {
    otevřeno: "open",
    zaplaceno: "paid",
    zrušeno: "canceled",
    vydáno: "issued",
    vše: "",
  };

  const daysOldFilter = daysOldMap[daysOldSelection] ?? null;
  const statusFilter = statusMap[statusSelection] ?? "";
  const clientIdFilter = null;
  const {
    orders: invoices,
    loading,
    refresh,
  } = useOrdersGetList({
    search: searchInvoice,
    daysOld: daysOldFilter,
    status: statusFilter,
    clientId: clientIdFilter,
  });
  const { createOrder, loading: creatingOrder } = useOrdersNew();

  // Paginace
  const [page, setPage] = useState(1);
  const limit = 6;
  const [totalPages, setTotalPages] = useState(1);
  const paginatedInvoices = invoices.slice((page - 1) * limit, page * limit);

  function handlePrintInvoice(invoice) {
    console.log("Tisk zakázky:", invoice.id);
    window.open(`${API_URL}/pdf/invoice/${invoice.id}`, "_blank");
  }

  const handleOpenNewOrder = async () => {
    console.log("Active ID:", activeId);
    console.log("User:", user);


    if (!activeId?.client_id || !activeId?.member_id || !user?.branch_id) {
      alert("Chybí client_id, member_id nebo branch_id.");
      return;
    }

    try {
      const createdOrder = await createOrder({
        client_id: activeId.client_id,
        branch_id: user.branch_id,
        member_id: activeId.member_id,
      });

      setNewOrderNumberFormatted(formatInvoiceNumber(createdOrder));
      setShowModal(true);
      refresh();
    } catch (error) {
      console.error(error);
      alert("Chyba při vytváření zakázky.");
    }
  };

  const handleSubmitNewOrder = async () => {
    refresh();
  };

  useEffect(() => {
    const nextTotalPages = Math.max(1, Math.ceil(invoices.length / limit));
    setTotalPages(nextTotalPages);
    if (page > nextTotalPages) {
      setPage(nextTotalPages);
    }
  }, [invoices, limit, page]);

  return (
    <div className="container">
      <div className="left-container-2">
        <div className="input-panel">
          <div className="search-input-container">
            <input
              type="text"
              value={searchInvoice}
              onChange={(e) => setSearchInvoices(e.target.value)}
              placeholder="Hledej zakázku"
            />
            <button type="submit">Hledej</button>
          </div>
          <div className="segmented-control-container">
            <div className="segmented-control-item">
              <h3>Stari zakazky</h3>
              <SegmentedControl
                items={daysOldOptions}
                selectedValue={daysOldSelection}
                onClick={(item) => setDaysOldSelection(item)}
              />
            </div>
            <div className="segmented-control-item">
              <h3>Status</h3>
              <SegmentedControl
                items={statusOptions}
                selectedValue={statusSelection}
                onClick={(item) =>
                  setStatusSelection(item === statusSelection ? "" : item)
                }
              />
            </div>
          </div>
          <button onClick={handleOpenNewOrder} disabled={creatingOrder}>
            {creatingOrder ? "Vytvářím..." : "Nová zakázka"}
          </button>
          <button onClick={() => handlePrintInvoice(invoices[0])}>Tisk</button>
        </div>
        <div className="show-items-panel">
          <div className="items-panel-label">
            <h2>Zakázky</h2>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
            <p>Nalezeno {invoices.length} zakázek</p>
          </div>
          <div className="items-panel-table-header"></div>
          <div className="items-panel-table-header five-columns">
            <h3>Datum</h3>
            <h3>Číslo zakázky | Zákazník</h3>
            <h3>Poslední aktualizace</h3>
            <h3>Stav</h3>
            <h3>Platby</h3>
          </div>
          <div className="items-list">
            {loading && <PuffLoaderSpinnerLarge active={loading} />}
            {paginatedInvoices.length > 0 &&
              paginatedInvoices.map((invoice) => (
                <div key={invoice.id} className="item one-row five-columns">
                  <p>
                    {new Date(invoice.created_at).toLocaleString("cs-CZ", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      // hour: '2-digit',
                      // minute: '2-digit'
                    })}
                  </p>
                  <h1>{`${formatInvoiceNumber(invoice)} | ${invoice.name} ${invoice.surname}`}</h1>
                  <p>
                    {new Date(invoice.updated_at).toLocaleString("cs-CZ", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p>{`${invoice.status}`} </p>
                  

                  <p>{`${invoice.total_amount} Kč / ${invoice.paid_amount} Kč`}</p>
                </div>
              ))}
          </div>{" "}
        </div>
      </div>
      <div>
        {showModal && (
          <ModalNewOrder
            orderInformation={orderInformation}
            initialValues={initialValues}
            onSubmit={handleSubmitNewOrder}
            onClose={() => setShowModal(false)}
            onCancel={() => setShowModal(false)}
            firstButton="Uložit"
            secondButton="Zavřít"
            thirdButton={null}
            formattedInvoiceNumber={newOrderNumberFormatted}
          />
        )}
      </div>
    </div>
  );
}

export default Invoices;
