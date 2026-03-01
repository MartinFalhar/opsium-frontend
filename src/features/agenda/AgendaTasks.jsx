import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useUser } from "../../context/UserContext.jsx";
import Modal from "../../components/modal/Modal.jsx";
import PuffLoaderSpinnerLarge from "../../components/loader/PuffLoaderSpinnerLarge.jsx";

const API_URL = import.meta.env.VITE_API_URL;

function AgendaTasks() {
  const { user } = useUser();
  const fields = [
    {
      varName: "title",
      label: "Název úkolu",
      input: "text",
      required: true,
    },
    {
      varName: "description",
      label: "Popis",
      input: "textarea",
      required: false,
      rows: 3,
    },
    {
      varName: "priority",
      label: "Priorita",
      options: ["low", "medium", "high"],
      required: true,
    },
    {
      varName: "status",
      label: "Stav",
      options: ["new", "in_progress", "completed"],
      required: true,
    },
    { varName: "due_date", label: "Termín", input: "date", required: false },
    { varName: "entity_type", label: "Typ vazby", input: "text", required: true },
    { varName: "entity_id", label: "ID vazby", input: "number", required: true },
  ];

  const [inputSearch, setInputSearch] = useState("");
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/agenda/tasks-search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ branch_id: user?.branch_id }),
      });
      const data = await res.json();

      if (res.ok) {
        setItems(data);
        setFilteredItems(data);
      } else {
        setError(data.message);
        console.error("Error loading tasks:", data.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Nepodařilo se načíst úkoly.");
    } finally {
      setIsLoading(false);
    }
  }, [user?.branch_id]);

  // Načtení dat při prvním načtení komponenty
  useEffect(() => {
    if (user?.branch_id) {
      loadTasks();
    }
  }, [loadTasks, user?.branch_id]);

  const handleSearchInCatalog = () => {
    const query = inputSearch.trim().toLowerCase();

    if (!query) {
      setFilteredItems(items);
      return;
    }

    const result = items.filter((item) => {
      const title = `${item?.title ?? ""}`.toLowerCase();
      const description = `${item?.description ?? ""}`.toLowerCase();
      const priority = `${item?.priority ?? ""}`.toLowerCase();
      const status = `${item?.status ?? ""}`.toLowerCase();
      const entityType = `${item?.entity_type ?? ""}`.toLowerCase();
      const entityId = `${item?.entity_id ?? ""}`.toLowerCase();

      return (
        title.includes(query) ||
        description.includes(query) ||
        priority.includes(query) ||
        status.includes(query) ||
        entityType.includes(query) ||
        entityId.includes(query)
      );
    });

    setFilteredItems(result);
  };

  const handleClearSearch = () => {
    setInputSearch("");
    setFilteredItems(items);
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
        <React.Fragment key={`${value}-${part}-${index}`}>{part}</React.Fragment>
      ),
    );
  };

  const toDateInputValue = (value) => {
    if (!value) {
      return "";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toISOString().slice(0, 10);
  };

  const handleClick = (itemId) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) {
      return;
    }

    setSelectedItem({
      ...item,
      due_date: toDateInputValue(item.due_date),
    });
    setShowModal(true);
  };

  const buildTaskPayload = (values) => ({
    title: values.title,
    description: values.description,
    priority_task: values.priority || "medium",
    status: values.status || "new",
    due_date: values.due_date || null,
    entity_type: values.entity_type,
    entity_id: Number(values.entity_id),
    user_id: user?.branch_id,
  });

  const handleSaveTask = async (values) => {
    const isUpdate = Boolean(selectedItem?.id);
    const payload = buildTaskPayload(values);
    if (isUpdate) {
      payload.id = Number(selectedItem.id);
    }

    try {
      const res = await fetch(
        `${API_URL}/agenda/${isUpdate ? "tasks-update" : "tasks-create"}`,
        {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        window.showToast(isUpdate ? "Úkol byl upraven." : "Úkol byl uložen.");
        loadTasks();
      } else {
        setError(data.message);
        console.error("Chyba při ukládání úkolu:", data.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Nepodařilo se uložit úkol.");
    }
    setShowModal(false);
  };

  const deleteTask = async () => {
    if (!selectedItem?.id) {
      setShowModal(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/agenda/tasks-delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ id: Number(selectedItem.id) }),
      });
      const data = await res.json();

      if (res.ok) {
        window.showToast("Úkol byl smazán.");
        loadTasks();
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Nepodařilo se smazat úkol.");
    }

    setShowModal(false);
  };

  const handleAddNewItem = async () => {
    const newItem = {
      title: "Revize hasícího přístroje",
      description: "červený",
      priority: "medium",
      status: "new",
      due_date: "2026-03-30",
      entity_type: "Hasící přístroj",
      entity_id: 1,
    };

    setSelectedItem(newItem);
    setShowModal(true);
  };

  const visibleItems = filteredItems;

  const itemCount = Number.isFinite(visibleItems?.length) ? visibleItems.length : 0;
  const isFewItems =
    itemCount >= 2 && itemCount <= 4 && !(itemCount >= 12 && itemCount <= 14);
  const foundVerb =
    itemCount === 1 ? "Nalezena" : isFewItems ? "Nalezeny" : "Nalezeno";
  const itemNoun =
    itemCount === 1 ? "úloha" : isFewItems ? "úlohy" : "úloh";

  const formatDueDate = (value) => {
    if (!value) {
      return "-";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("cs-CZ");
  };

  return (
    <div className="container">
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
                    handleSearchInCatalog();
                  }
                  if (e.key === "Escape") {
                    handleClearSearch();
                  }
                }}
                placeholder="Zadej hledaný text"
              />
            </div>
            <button onClick={handleSearchInCatalog}>Hledej</button>
          </div>
          <button onClick={() => handleAddNewItem()}>Nová položka</button>
        </div>
        <div className="show-items-panel">
          <div className="items-panel-label">
            <h2>Úkoly</h2>
            <p>
              {foundVerb} {itemCount} {itemNoun}
            </p>
            {error ? <p>{error}</p> : null}
          </div>
          <div className="items-panel-table-header four-columns">
            <h3>Název úkolu</h3>
            <h3>Vazba</h3>
            <h3>Termín</h3>
            <h3>Stav / priorita</h3>
          </div>
          <div className="items-list">
            <PuffLoaderSpinnerLarge active={isLoading} />
            {visibleItems.length === 0 && <p>Žádné položky k zobrazení</p>}
            {visibleItems.length > 0 &&
              visibleItems.map((item) => (
                <div
                  key={item.id}
                  className="item one-row four-columns"
                  onClick={() => handleClick(item.id)}
                >
                  <div className="item-name">
                    <h1>{renderHighlightedText(item.title)}</h1>
                    <p>{renderHighlightedText(item.description)}</p>
                  </div>

                  <div className="item-amount">
                    <p>{renderHighlightedText(item.entity_type)}</p>
                    <p>ID: {renderHighlightedText(item.entity_id)}</p>
                  </div>

                  <div className="item-note">
                    <p>{formatDueDate(item.due_date)}</p>
                  </div>

                  <div className="item-price-vat">
                    <h2>{renderHighlightedText(item.status)}</h2>
                    <p className="vat_info">{renderHighlightedText(item.priority)}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {showModal && selectedItem && (
        <Modal
          fields={fields}
          initialValues={selectedItem}
          title="Nový úkol"
          firstButton="Uložit"
          secondButton="Zrušit"
          thirdButton="Smazat"
          onClickThirdButton={deleteTask}
          onSubmit={handleSaveTask}
          onClose={() => setShowModal(false)}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default AgendaTasks;
