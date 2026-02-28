import React, { useEffect, useState, useCallback } from "react";
import { useUser } from "../../context/UserContext";
import PuffLoaderSpinner from "../../components/loader/PuffLoaderSpinner.jsx";
import Pagination from "../../components/pagination/Pagination.jsx";
import Modal from "../../components/modal/Modal.jsx";
import SegmentedControlMenu from "../../components/controls/SegmentedControlMenu.jsx";

const CONTACT_FIELD_ORDER = [
  "id",
  "nick",
  "company",
  "field",
  "reg_number",
  "phone1",
  "phone2",
  "phone3",
  "email1",
  "email2",
  "email3",
  "street",
  "city",
  "post_code",
  "country",
  "note",
  "organization_id",
  "created_at",
  "updated_at",
];

const FIXED_FIELD_FILTER_ITEMS = [
  "vše",
  "brýle",
  "brýlové čočky",
  "kontaktní čočky",
];

const FIELD_FILTER_MAP = {
  "kontaktní čočky": [
    "kontaktní čočky",
    "kontaktní čočky, roztoky, kapky",
  ],
};

const FIELD_VALUE_TO_FILTER_LABEL = {
  "kontaktní čočky, roztoky, kapky": "kontaktní čočky",
};

const normalizeFieldFilterLabel = (value) => {
  const normalized = `${value ?? ""}`.trim();
  return FIELD_VALUE_TO_FILTER_LABEL[normalized] || normalized;
};

const buildFieldFilterItems = (contactsData) => {
  const dynamicItems = Array.from(
    new Set(
      (contactsData || [])
        .map((contact) => normalizeFieldFilterLabel(contact?.field))
        .filter((value) => value !== "" && !FIXED_FIELD_FILTER_ITEMS.includes(value)),
    ),
  ).sort((a, b) => a.localeCompare(b, "cs"));

  return [...FIXED_FIELD_FILTER_ITEMS, ...dynamicItems];
};

function AgendaContacts() {
  const ITEMS_PER_PAGE = 6;

  const [inputSearch, setInputSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedContactId, setExpandedContactId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isNewContact, setIsNewContact] = useState(false);
  const [fieldFilterItems, setFieldFilterItems] = useState(FIXED_FIELD_FILTER_ITEMS);
  const [selectedField, setSelectedField] = useState("vše");

  const API_URL = import.meta.env.VITE_API_URL;

  const { user } = useUser();

  const loadContacts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/agenda/contacts-search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          organization_id: user?.organization_id,
          value: "",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setContacts(data);
        setFilteredContacts(data);
        setFieldFilterItems(buildFieldFilterItems(data));
        setSelectedField("vše");
        setCurrentPage(1);
        setExpandedContactId(null);
      } else {
        console.error("Error loading contacts:", data.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, user?.organization_id]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const handleSearchInContacts = () => {
    const query = inputSearch.trim().toLowerCase();

    if (!query) {
      setFilteredContacts(contacts);
      setCurrentPage(1);
      setExpandedContactId(null);
      return;
    }

    const result = contacts.filter((contact) => {
      const company = `${contact?.company ?? ""}`.toLowerCase();
      const field = `${contact?.field ?? ""}`.toLowerCase();
      const regNumber = `${contact?.reg_number ?? ""}`.toLowerCase();
      const phone1 = `${contact?.phone1 ?? ""}`.toLowerCase();
      const phone2 = `${contact?.phone2 ?? ""}`.toLowerCase();
      const phone3 = `${contact?.phone3 ?? ""}`.toLowerCase();
      const street = `${contact?.street ?? ""}`.toLowerCase();
      const city = `${contact?.city ?? ""}`.toLowerCase();
      const postCode = `${contact?.post_code ?? ""}`.toLowerCase();

      return (
        company.includes(query) ||
        field.includes(query) ||
        regNumber.includes(query) ||
        phone1.includes(query) ||
        phone2.includes(query) ||
        phone3.includes(query) ||
        street.includes(query) ||
        city.includes(query) ||
        postCode.includes(query)
      );
    });

    setFilteredContacts(result);
    setCurrentPage(1);
    setExpandedContactId(null);
  };

  const handleClearSearch = () => {
    setInputSearch("");
    setFilteredContacts(contacts);
    setCurrentPage(1);
    setExpandedContactId(null);
  };

  const createLabelFromKey = (key) =>
    key
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());

  const getOrderedContactKeys = (contact) => {
    if (!contact) return [];

    const orderMap = new Map(CONTACT_FIELD_ORDER.map((key, index) => [key, index]));

    return Object.keys(contact).sort((a, b) => {
      const aOrder = orderMap.has(a) ? orderMap.get(a) : Number.MAX_SAFE_INTEGER;
      const bOrder = orderMap.has(b) ? orderMap.get(b) : Number.MAX_SAFE_INTEGER;

      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }

      return a.localeCompare(b, "cs");
    });
  };

  const getContactFields = (contact) => {
    if (!contact) return [];

    const readOnlyFields = new Set(["id", "organization_id", "created_at", "updated_at"]);

    return getOrderedContactKeys(contact).map((key) => ({
      varName: key,
      label: createLabelFromKey(key),
      input: key.includes("note") ? "textarea" : "text",
      readOnly: readOnlyFields.has(key),
      required: false,
      rows: key.includes("note") ? 3 : undefined,
    }));
  };

  const summaryKeys = new Set([
    "id",
    "nick",
    "company",
    "reg_number",
    "phone1",
    "phone2",
    "phone3",
    "email1",
    "email2",
    "email3",
    "field",
    "street",
    "city",
    "post_code",
  ]);

  const getDetailEntries = (contact) =>
    getOrderedContactKeys(contact)
      .filter((key) => {
        const value = contact[key];

      if (summaryKeys.has(key)) return false;
      if (value === null || value === undefined) return false;
      if (`${value}`.trim() === "") return false;
      return true;
      })
      .map((key) => [key, contact[key]]);

  const handleToggleDetails = (contactId) => {
    setExpandedContactId((prev) => (prev === contactId ? null : contactId));
  };

  const handleEditContactClick = (event, contact) => {
    event.stopPropagation();
    setIsNewContact(false);
    setSelectedContact(contact);
    setShowModal(true);
  };

  const handleAddNewContact = () => {
    const newContact = {
      nick: "",
      company: "",
      field: "",
      reg_number: "",
      phone1: "",
      phone2: "",
      phone3: "",
      email1: "",
      email2: "",
      email3: "",
      street: "",
      city: "",
      post_code: "",
      country: "",
      note: "",
    };

    setIsNewContact(true);
    setSelectedContact(newContact);
    setShowModal(true);
  };

  const handleSaveContact = async (values) => {
    if (!selectedContact) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/agenda/contacts-update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          changedContact: {
            ...values,
            id: isNewContact ? undefined : selectedContact.id,
          },
        }),
      });

      const data = await res.json();

      if (res.ok) {
        window.showToast(
          isNewContact ? "Kontakt byl vytvořen." : "Kontakt byl změněn.",
        );
        setShowModal(false);
        setSelectedContact(null);
        setIsNewContact(false);
        await loadContacts();
      } else {
        console.error("Error updating contact:", data.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleDeleteContact = async () => {
    if (!selectedContact?.id) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/agenda/contacts-delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ id: selectedContact.id }),
      });

      const data = await res.json();

      if (res.ok) {
        window.showToast("Kontakt byl smazán.");
        setShowModal(false);
        setSelectedContact(null);
        setIsNewContact(false);
        await loadContacts();
      } else {
        console.error("Error deleting contact:", data.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const visibleContacts = filteredContacts.filter((contact) => {
    if (selectedField === "vše") {
      return true;
    }

    const selectedVariants = FIELD_FILTER_MAP[selectedField] || [selectedField];
    return selectedVariants.includes(`${contact?.field ?? ""}`.trim());
  });

  const totalPages = Math.max(
    1,
    Math.ceil((visibleContacts?.length ?? 0) / ITEMS_PER_PAGE),
  );

  const currentPageSafe = Math.min(currentPage, totalPages);
  const startIndex = (currentPageSafe - 1) * ITEMS_PER_PAGE;
  const paginatedContacts = visibleContacts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setExpandedContactId(null);
  };

  const handleFieldFilterChange = (field) => {
    setSelectedField(field);
    setCurrentPage(1);
    setExpandedContactId(null);
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
        <React.Fragment key={`${value}-${part}-${index}`}>
          {part}
        </React.Fragment>
      ),
    );
  };

  const contactCount = Number.isFinite(visibleContacts?.length)
    ? visibleContacts.length
    : 0;
  const isFewContacts =
    contactCount >= 2 &&
    contactCount <= 4 &&
    !(contactCount >= 12 && contactCount <= 14);

  const foundVerb =
    contactCount === 1 ? "Nalezen" : isFewContacts ? "Nalezeny" : "Nalezeno";
  const contactNoun =
    contactCount === 1 ? "kontakt" : isFewContacts ? "kontakty" : "kontaktů";

  return (
    <div className="eft-container">
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
                    handleSearchInContacts();
                  }
                  if (e.key === "Escape") {
                    handleClearSearch();
                  }
                }}
                placeholder="Zadej hledaný text"
              />
            </div>
          </div>
          <button onClick={handleSearchInContacts}>Hledej</button>
          <button onClick={handleAddNewContact}>Nový kontakt</button>
          <SegmentedControlMenu
            items={fieldFilterItems}
            selectedValue={selectedField}
            onClick={handleFieldFilterChange}
            width={"600px"}
            fixedItemsCount={4}
          />
        </div>
      </div>
      <div className="show-items-panel">
        <div className="items-panel-label">
          <h2>Kontakty</h2>
          <Pagination
            currentPage={currentPageSafe}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          <h4>
            {foundVerb} {contactCount} {contactNoun} (strana {currentPageSafe}/
            {totalPages})
          </h4>
        </div>
        <div className="items-panel-table-header six-columns-3 ">
          <h3 className="">Firma</h3>
          <h3 className="">Adresa</h3>
          <h3>Reg. č.</h3>
          <h3>Telefon</h3>
          <h3>Email</h3>
          <h3>Odvětví</h3>
        </div>
        <PuffLoaderSpinner active={isLoading} />
        <div className="items-list contacts-items-list">
          {paginatedContacts.length > 0 &&
            paginatedContacts.map((contact) => {
              const isExpanded = expandedContactId === contact.id;
              const detailEntries = getDetailEntries(contact);

              return (
                <div
                  key={contact.id}
                  className="item six-columns-3"
                  onClick={() => handleToggleDetails(contact.id)}
                >
                <div className="item-name left">
                  <h1>{renderHighlightedText(contact.nick)}</h1>
                </div>

                <div className="item-name left">
                  <p>{renderHighlightedText(contact.company)}</p>
                </div>

                <div className="item-name">
                  <h1>{renderHighlightedText(contact.reg_number)}</h1>
                </div>
                <div className="item-name">
                  <h1>
                    {contact.phone1 != null
                      ? `${renderHighlightedText(contact.phone1)}`
                      : ""}
                    {contact.phone2 != null
                      ? `${renderHighlightedText(contact.phone2)}`
                      : ""}
                    {contact.phone3 != null
                      ? `,${renderHighlightedText(contact.phone3)}`
                      : ""}
                  </h1>
                </div>
                <div className="item-name left">
                  <h1>
                    {contact.email1 != null
                      ? `${renderHighlightedText(contact.email1)}`
                      : ""}
                    {contact.email2 != null
                      ? `${renderHighlightedText(contact.email2)}`
                      : ""}
                    {contact.email3 != null
                      ? `,${renderHighlightedText(contact.email3)}`
                      : ""}
                  </h1>
                </div>
                <div className="item-name left">
                  <p>{renderHighlightedText(contact.field)}</p>
                </div>
                <div className="item-name"></div>
                <div className="item-name left tiny-text">
                  <p>
                                        {contact.street != null
                      ? `${renderHighlightedText(contact.street)}, `
                      : ", "}
                    {contact.city != null
                      ? `${renderHighlightedText(contact.city)}, `
                      : ", "}
                    {contact.post_code != null
                      ? `${renderHighlightedText(contact.post_code)}`
                      : ""}

                  </p>
                </div>
                {isExpanded && (
                  <>
                    <div className="agenda-contact-details">
                      {detailEntries.length === 0 && (
                        <p className="agenda-contact-empty-detail">
                          Žádná další data k zobrazení
                        </p>
                      )}
                      {detailEntries.map(([key, value]) => (
                        <div key={`${contact.id}-${key}`} className="agenda-contact-detail-row">
                          <h4>{createLabelFromKey(key)}</h4>
                          <p>{renderHighlightedText(`${value}`)}</p>
                        </div>
                      ))}
                    </div>

                    <div className="agenda-contact-actions">
                      <button
                        type="button"
                        onClick={(event) => handleEditContactClick(event, contact)}
                      >
                        Upravit
                      </button>
                    </div>
                  </>
                )}
              </div>
              );
            })}
        </div>
      </div>

      {showModal && selectedContact && (
        <Modal
          fields={getContactFields(selectedContact)}
          initialValues={selectedContact}
          title={isNewContact ? "Nový kontakt" : "Upravit kontakt"}
          onSubmit={handleSaveContact}
          onClose={() => {
            setShowModal(false);
            setSelectedContact(null);
            setIsNewContact(false);
          }}
          onCancel={() => {
            setShowModal(false);
            setSelectedContact(null);
            setIsNewContact(false);
          }}
          firstButton={isNewContact ? "Vytvořit" : "Uložit"}
          secondButton="Zrušit"
          thirdButton={!isNewContact ? "Smazat" : null}
          onClickThirdButton={handleDeleteContact}
        />
      )}
    </div>
  );
}

export default AgendaContacts;
