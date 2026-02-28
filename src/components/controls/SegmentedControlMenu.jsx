import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

const SegmentedControlMenu = ({
  items,
  selectedValue,
  onClick,
  width,
  fixedItemsCount = 4,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 180 });
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  const normalizedItems = useMemo(() => (Array.isArray(items) ? items : []), [items]);

  const { visibleItems, overflowItems } = useMemo(() => {
    const safeCount = Math.max(0, Number(fixedItemsCount) || 0);
    return {
      visibleItems: normalizedItems.slice(0, safeCount),
      overflowItems: normalizedItems.slice(safeCount),
    };
  }, [normalizedItems, fixedItemsCount]);

  const selectedOverflowItem = overflowItems.includes(selectedValue)
    ? selectedValue
    : null;

  const triggerLabel = selectedOverflowItem ? `${selectedOverflowItem} ...` : "...";

  const updateMenuPosition = () => {
    const triggerRect = triggerRef.current?.getBoundingClientRect();
    if (!triggerRect) {
      return;
    }

    const dropdownMinWidth = Math.max(180, triggerRect.width);
    setMenuPosition({
      top: triggerRect.bottom + 6,
      left: triggerRect.right - dropdownMinWidth,
      width: dropdownMinWidth,
    });
  };

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    updateMenuPosition();

    const handleWindowChange = () => {
      updateMenuPosition();
    };

    window.addEventListener("resize", handleWindowChange);
    window.addEventListener("scroll", handleWindowChange, true);

    return () => {
      window.removeEventListener("resize", handleWindowChange);
      window.removeEventListener("scroll", handleWindowChange, true);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleOutsideClick = (event) => {
      const clickInsideTrigger = triggerRef.current?.contains(event.target);
      const clickInsideDropdown = dropdownRef.current?.contains(event.target);

      if (!clickInsideTrigger && !clickInsideDropdown) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isMenuOpen]);

  return (
    <div className="segmented-control segmented-control-menu" style={{ width }}>
      {visibleItems.map((item) => (
        <button
          key={item}
          className={`button-controler ${item === selectedValue ? "active" : ""}`}
          onClick={() => onClick(item)}
        >
          {item}
        </button>
      ))}

      {overflowItems.length > 0 && (
        <div className="segmented-control-menu-more">
          <button
            ref={triggerRef}
            className={`button-controler segmented-control-menu-trigger ${
              overflowItems.includes(selectedValue) ? "active" : ""
            } ${isMenuOpen ? "menu-open" : ""}`}
            title={triggerLabel}
            aria-label="Další položky"
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            type="button"
            onClick={() => {
              updateMenuPosition();
              setIsMenuOpen((prev) => !prev);
            }}
          >
            {triggerLabel}
          </button>

          {isMenuOpen &&
            createPortal(
              <div
                ref={dropdownRef}
                className="segmented-control-menu-dropdown"
                style={{
                  position: "fixed",
                  top: `${menuPosition.top}px`,
                  left: `${menuPosition.left}px`,
                  minWidth: `${menuPosition.width}px`,
                  zIndex: 9999,
                }}
              >
                {overflowItems.map((item) => (
                  <button
                    key={item}
                    className={`button-controler ${item === selectedValue ? "active" : ""}`}
                    type="button"
                    onClick={() => {
                      onClick(item);
                      setIsMenuOpen(false);
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>,
              document.body,
            )}
        </div>
      )}
    </div>
  );
};

export default SegmentedControlMenu;
