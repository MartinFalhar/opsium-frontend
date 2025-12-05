import React, { useState, useEffect } from "react";
import "./OptotypMenu.css";

const optotypList = [
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

//z rodičovské funkce Optotyp dávám funkci actualStartTests,
//která předává OptotypLayout sekvenci, podle které složi set
//Proměnná initialItems je pro předání hodnot získáne z databáze
//který si klient uložil
function OptotypMenu({ actualStartTests, initialItems = [] }) {
  //registr vybrané položky menu
  const [selectedMenu, setSelectedMenu] = useState(null);
  //registr vybraných/nahraných optotypů
  const [items, setItems] = useState([]);
  //obsluha drag and drop
  const [dragIndex, setDragIndex] = useState(null);
  const [hoveredItemId, setHoveredItemId] = useState(null);

  //jakmile se změní initialItems, což je třeba při nahrání
  //spustí funkci mapInitialItemsToFullItems, která
  //podle načteného klíče vygeneruje plnohodnotný element,
  // který je načten do items
  useEffect(() => {
    //kontrola, zda obsahuje hodnotu
    if (initialItems && initialItems.length > 0) {
      const mapped = mapInitialItemsToFullItems(initialItems);
      // nastav jen když se liší od aktuálních items
      //výkonově důležitá komponenta
      //same je boolean, první krok kontroluj, jestli je true
      //když je mapped stejně velké jako items
      //druhá podmínka je pro kontrolu názvu testID
      //funkce every je true, pokud podmínka platí pro všechny
      //prvky
      //items[i]?.testID -> optional chaining operator
      //prevence vzniku chyby
      const same =
        mapped.length === items.length &&
        mapped.every((m, i) => m.testID === items[i]?.testID);
      //pokud je rozdíl (same je false) , provede aktualizaci items
      if (!same) {
        setItems(mapped);
      }
    }
  }, [initialItems]);

  //Po pridani upravim ITEMS ale i zavolám funkci actualStartTests,
  // s kterym pracuje rodic
  // subItem je vybraná položka z podmenu
  //acttualStartTest se aktualizuje, protože se předá OptotypLayout
  //setItems pak hlídá aktuální menu
  const handleAdd = (subItem) => {
    //časové razoitko jako id
    subItem.id = Date.now().toString();
    actualStartTests([...items, { ...subItem }]);
    setItems([...items, { ...subItem }]);
  };

  //funkce generující item element na základě importované klíče
  //z databáze se obdrží JSONB objekt s testID, value1 a value2
  //což je určení o jaký optotyp se jedná a jaké má parametry
  function mapInitialItemsToFullItems(initialItems) {
    // Pro každý item z initialItems najdi šablonu v optotypList.sub podle testID
    return initialItems
      .map((initItem) => {
        // Najdi odpovídající sub položku podle testID
        const template = optotypList
          //vytvoří ploché pole z položek podmenu
          .flatMap((menu) => menu.sub)
          //aby následně hledal konkrétní odpovídající test se
          //shodou testID
          .find((sub) => sub.testID === initItem.testID);
        //pokud nenajde na jeden záznam, vrací null
        if (!template) return null; // nebo nějaké ošetření chyby

        // Vytvoř nový objekt podle šablony, ale s hodnotami z initialItems
        return {
          ...template,
          id: Date.now().toString() + Math.random(), // unikátní id
          value1: initItem.value1,
          value2: initItem.value2,
        };
      })
      .filter(Boolean); // odstraní případné null, pokud by šablona nebyla nalezena
  }

  //Pri jakekoliv zmene aktualizuj seznam items
  //POZOR, je zde duplicita useEffect na jeden element
  //toto je pro ošetření manipulace menu uživatelem
  //aktualizuje se jak items tak i seznam pro
  //funkci actualStartTests
  //první useEffect je pak pro hlidání loadMenu
  useEffect(() => {
    const itemsByTestID = items.map((item) => ({
      testID: item.testID,
      value1: item.value1,
      value2: item.value2,
    }));
    actualStartTests(itemsByTestID);
  }, [items, actualStartTests]);
  //DRAG-START
  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  //DRAG-START
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newItems = Array.from(items);
    const [reordered] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reordered);
    setItems(newItems);
  };

  //DROP
  const handleDrop = (index) => {
    if (dragIndex === null) return;
    const newItems = [...items];
    const [moved] = newItems.splice(dragIndex, 1);
    newItems.splice(index, 0, moved);
    setItems(newItems);
    setDragIndex(null);
  };

  //hlídá změnu VALUE 1 a VALUE 2
  //volá se při každém INPUTu
  const handleChange = (id, field, value) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  //DELETE
  const handleDelete = (idToDelete) => {
    setItems(items.filter((item) => item.id !== idToDelete));
  };
  //RENDER KOMPONENTY
  return (
    <div style={{ display: "flex" }}>
      {/* Levý sloupec - hlavní menu */}
      <div style={{ flex: 1, borderRight: "1px solid #ccc", padding: "10px" }}>
        <h3>Hlavní menu</h3>
        {optotypList.map((menu) => (
          <div
            key={menu.id}
            onClick={() => setSelectedMenu(menu)}
            style={{
              color: "var(--color-bg-b11)",
              padding: "8px",
              cursor: "pointer",
              background:
                selectedMenu?.id === menu.id ? "#e0e0e0" : "transparent",
              fontSize: "0.9rem",
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
            <div className="subMenu" key={i} onClick={() => handleAdd(sub)}>
              <img src={sub.img} alt={sub.name} />➕
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
            className="selectedMenuItems"
            key={item.id}
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragOver={(e) => e.preventDefault()} // nutné!
            onDrop={() => handleDrop(index)}
            onMouseEnter={() => setHoveredItemId(item.id)} // Nastavení hoveredItemId při najetí myši
            onMouseLeave={() => setHoveredItemId(null)} // Zrušení hoveredItemId při opuštění myší
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
                className="deleteSign"
                onClick={() => handleDelete(item.id)}
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
