const Tabs = ({
  items = [],
  selectedValue,
  onChange,
  width = "100%",
  idPrefix = "tabs",
}) => {
  const normalizedItems = Array.isArray(items) ? items : [];

  const toSafeId = (value) =>
    `${idPrefix}-${String(value ?? "item")}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  return (
    <div className="tabs" style={{ width }} role="tablist" aria-label="Záložky">
      {normalizedItems.map((item) => {
        const label = typeof item === "string" ? item : item?.label;
        const value = typeof item === "string" ? item : item?.value;
        const isActive = value === selectedValue;
        const safeId = toSafeId(value);

        return (
          <button
            key={value}
            type="button"
            className={`tabs-item ${isActive ? "active" : ""}`}
            onClick={() => onChange?.(value)}
            role="tab"
            id={`${safeId}-tab`}
            aria-controls={`${safeId}-panel`}
            aria-selected={isActive}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
