import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Vistraining.css";
import { useState } from "react";

function Vistraining() {
  const mainMenu = [
    {
      id: "m1",
      label: "Menu 1",
      sub: ["Sub 1-1", "Sub 1-2", "Sub 1-3", "Sub 1-4", "Sub 1-5"],
    },
    {
      id: "m2",
      label: "Menu 2",
      sub: ["Sub 2-1", "Sub 2-2", "Sub 2-3", "Sub 2-4", "Sub 2-5"],
    },
    {
      id: "m3",
      label: "Menu 3",
      sub: ["Sub 3-1", "Sub 3-2", "Sub 3-3", "Sub 3-4", "Sub 3-5"],
    },
    {
      id: "m4",
      label: "Menu 4",
      sub: ["Sub 4-1", "Sub 4-2", "Sub 4-3", "Sub 4-4", "Sub 4-5"],
    },
    {
      id: "m5",
      label: "Menu 5",
      sub: ["Sub 5-1", "Sub 5-2", "Sub 5-3", "Sub 5-4", "Sub 5-5"],
    },
  ];

  const [selectedMenu, setSelectedMenu] = useState(null);
  const [items, setItems] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);

  const handleAdd = (subItem) => {
    setItems([
      ...items,
      { id: Date.now().toString(), label: subItem, value1: "", value2: "" },
    ]);
  };

  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newItems = Array.from(items);
    const [reordered] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reordered);
    setItems(newItems);
  };

  const handleDrop = (index) => {
    if (dragIndex === null) return;
    const newItems = [...items];
    const [moved] = newItems.splice(dragIndex, 1);
    newItems.splice(index, 0, moved);
    setItems(newItems);
    setDragIndex(null);
  };
  const handleChange = (id, field, value) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const navigate = useNavigate();
  const location = useLocation();
  const historyFromChild = location.state?.history || [];

  const width = 700;
  const height = 250;

  const min = Math.min(...historyFromChild);
  const max = Math.max(...historyFromChild);
  const range = max - min || 1;

  const handleClick = () => {
    navigate("/visual-training-testing");
  };

  return (
    <div className="vistraining-container">
      <div className="vistraining-settings">
        <h2>Visual Training Settings</h2>

        <div style={{ display: "flex", height: "100vh" }}>
          {/* Levý sloupec - hlavní menu */}
          <div
            style={{ flex: 1, borderRight: "1px solid #ccc", padding: "10px" }}
          >
            <h3>Hlavní menu</h3>
            {mainMenu.map((menu) => (
              <div
                key={menu.id}
                onClick={() => setSelectedMenu(menu)}
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  background:
                    selectedMenu?.id === menu.id ? "#e0e0e0" : "transparent",
                }}
              >
                {menu.label}
              </div>
            ))}
          </div>

          {/* Střední sloupec - podmenu */}
          <div
            style={{ flex: 1, borderRight: "1px solid #ccc", padding: "10px" }}
          >
            <h3>Podmenu</h3>
            {selectedMenu ? (
              selectedMenu.sub.map((sub, i) => (
                <div
                  key={i}
                  onClick={() => handleAdd(sub)}
                  style={{ padding: "8px", cursor: "pointer" }}
                >
                  {sub} ➕
                </div>
              ))
            ) : (
              <p>Vyber položku vlevo</p>
            )}
          </div>

          {/* Pravý sloupec - vybrané položky s drag&drop */}
          <div style={{ flex: 2, padding: "10px" }}>
            <h3>Vybrané položky</h3>
            {items.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(e) => e.preventDefault()} // nutné!
                onDrop={() => handleDrop(index)}
                style={{
                  padding: "10px",
                  marginBottom: "8px",
                  background: "#f9f9f9",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  cursor: "grab",
                }}
              >
                <strong>{item.label}</strong>
                <div>
                  <label>Hodnota 1: </label>
                  <input
                    type="text"
                    value={item.value1}
                    onChange={(e) =>
                      handleChange(item.id, "value1", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label>Hodnota 2: </label>
                  <input
                    type="text"
                    value={item.value2}
                    onChange={(e) =>
                      handleChange(item.id, "value2", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/*konec modulu menu*/}
        <button className="button-big" onClick={handleClick}>
          Start Test
        </button>
      </div>

      <div className="vistraining-help">
        <h2>Visual Training Help</h2>
      </div>
    </div>
  );
}

export default Vistraining;
