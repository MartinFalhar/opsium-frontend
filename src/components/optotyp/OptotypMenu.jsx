import React, { useState, useEffect } from "react";

const mainMenu = [
  {
    id: "m1",
    label: "Vizus",
    sub: [
      {
        name: "Jeden řádek",
        id: "",
        testID: "1",
        img: "/optotyp/1-1.png",
        value1Name: "Startovní hodnota",
        value2Name: "Počet znaků",
        value1: "",
        value2: "",
      },
      {
        name: "Druhý řádek",
        id: "",
        testID: "2",
        img: "/optotyp/1-1.png",
        value1Name: "Start",
        value2Name: "End",
        value1: "",
        value2: "",
      },
    ],
  },
  {
    id: "m2",
    label: "Astigmatimus",
    sub: [
      {
        name: "Body",
        id: "",
        testID: "3",
        img: "/optotyp/2-1.png",
        value1Name: "Formace",
        value2Name: "Počet bodů",
        value1: "",
        value2: "",
      },
      {
        name: "Body 2",
        id: "",
        testID: "4",
        img: "/optotyp/2-1.png",
        value1Name: "Start",
        value2Name: "End",
        value1: "",
        value2: "",
      },
    ],
  },
  // {
  //   id: "m3",
  //   label: "Dokorekce",
  //   sub: ["Sub 3-1", "Sub 3-2", "Sub 3-3", "Sub 3-4", "Sub 3-5"],
  // },
  // {
  //   id: "m4",
  //   label: "BINO",
  //   sub: ["Sub 4-1", "Sub 4-2", "Sub 4-3", "Sub 4-4", "Sub 4-5"],
  // },
  // {
  //   id: "m5",
  //   label: "Stereo",
  //   sub: ["Sub 5-1", "Sub 5-2", "Sub 5-3", "Sub 5-4", "Sub 5-5"],
  // },
];

function OptotypMenu({ onStartTest }) {

  const [selectedMenu, setSelectedMenu] = useState(null);
  const [items, setItems] = useState([]);
  const [dragIndex, setDragIndex] = useState(null);
  const [hoveredItemId, setHoveredItemId] = useState(null);

  const handleAdd = (subItem) => {
    subItem.id = Date.now().toString();
    onStartTest([...items, {...subItem}]);
    setItems([
      ...items, {...subItem}
    ]);
  };

    useEffect(() => {
    // vytvoří objekt { cat1: item1, cat2: item2, ... }
    const itemsByTestID = items.map(item => 
    (item.testID +"-"+item.value1+"-"+item.value2));
    onStartTest(itemsByTestID);
  }, [items, onStartTest]);

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

  const handleDelete = (idToDelete) => {
    setItems(items.filter((item) => item.id !== idToDelete));
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Levý sloupec - hlavní menu */}
      <div style={{ flex: 1, borderRight: "1px solid #ccc", padding: "10px" }}>
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
              fontSize: "0.8rem",
            }}
          >
            {menu.label}
          </div>
        ))}
      </div>

      {/* Střední sloupec - podmenu */}
      <div style={{ flex: 1, borderRight: "1px solid #ccc", padding: "10px" }}>
        <h3>Podmenu</h3>
        {selectedMenu ? (
          selectedMenu.sub.map((sub, i) => (
            <div
              key={i}
              onClick={() => handleAdd(sub)}
              style={{ padding: "8px", cursor: "pointer", fontSize: "0.8rem", display: "flex", alignItems: "center" }}
            >
              <img
                src={sub.img}
                alt={sub.name}
                style={{ width: "50px", marginRight: "10px" }}
              />
              ➕
            </div>
          ))
        ) : (
          <p>Vyber položku vlevo</p>
        )}
      </div>

      {/* Pravý sloupec - vybrané položky s drag&drop */}
      <div
        className="items"
        style={{ flex: 2, padding: "10px", overflowY: "auto", height: "60vh" }}
      >
        <h3>Vybrané položky</h3>
        {items.map((item, index) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragOver={(e) => e.preventDefault()} // nutné!
            onDrop={() => handleDrop(index)}
            onMouseEnter={() => setHoveredItemId(item.id)} // Nastavení hoveredItemId při najetí myši
            onMouseLeave={() => setHoveredItemId(null)} // Zrušení hoveredItemId při opuštění myší
            style={{
              padding: "10px",
              marginBottom: "8px",
              background: "#f9f9f9",
              border: "1px solid #ccc",
              borderRadius: "8px",
              cursor: "grab",
              position: "relative",
            }}
          >

            <strong>{item.name}</strong>          
            <div>
              <img src={item.img} alt="" />
              <label>{item.value1Name} </label>
              <input
                type="text"
                value={item.value1}
                onChange={(e) =>
                  handleChange(item.id, "value1", e.target.value)
                }
              />
            </div>
            <div>
              <label>{item.value2Name}</label>
              <input
                type="text"
                value={item.value2}
                onChange={(e) =>
                  handleChange(item.id, "value2", e.target.value)
                }
              />
            </div>
            {hoveredItemId === item.id && ( // Podmíněné zobrazení "X"
              <span
                onClick={() => handleDelete(item.id)}
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "10px",
                  cursor: "pointer",
                  color: "red",
                  fontSize: "1rem", // Větší velikost "X"
                  fontWeight: "bold",
                }}
              >
                X
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default OptotypMenu;
