// import { useState } from "react";
import { useState } from "react";
import "./ClientOptometry.css";

//IMPORT OPTOMETRY COMPONENT
import OptometryAnamnesis from "../../components/optometry/OptometryAnamnesis";
import OptometryNaturalVisus from "../../components/optometry/OptometryNaturalVisus";
import OptometryRefractionARK from "../../components/optometry/OptometryRefractionARK";
import OptometryRefractionFull from "../../components/optometry/OptometryRefractionFull";

function ClientOptometry() {
  const [optometryItems, setOptometryItems] = useState([
    {
      id: "1",
      modul: "1", 
      width: "w50",
      component: OptometryAnamnesis,
      values: {
        name: "Anamnéza",
        text: "Požadavek na plnou korekci",
      },
    },
    {
      id: "2",
      modul: "2",
      width: "w25",
      component: OptometryNaturalVisus,
      values: {
        name: "Naturální vizus",
        pV: "1.25",
        lV: "1.25+",
        bV: "2.0++",
        style: 0,
        text: "",
      },
    },
    {
      id: "3",
      modul: "3",
      width: "w25",
      component: OptometryRefractionARK,
      values: {
        name: "OBJEKTIVNÍ refrakce",
        pS: "-1.23",
        pC: "-1.79",
        pA: "179",
        lS: "+6.85",
        lC: "-1.47",
        lA: "123",
        text: "",
      },
    },
    {
      id: "5",
      modul: "3",
      width: "w75",
      component: OptometryRefractionFull,
      values: {
        name: "Refrakce - plný zápis",
        pS: "-3,75",
        pC: "-4,50",
        pA: "180",
        pP: "2,5",
        pB: "90",
        pAdd: "-3,25",
        lS: "+4,50",
        lC: "90",
        lA: "122",
        lP: "2,5",
        lB: "270",
        lAdd: "+2,50",
        pV: "0,63+",
        lV: "0,8+",
        bV: "1,25+",
        style: 0,
        text: "",
      },
    },
    {
      id: "6",
      modul: "3",
      width: "w75",
      component: OptometryRefractionFull,
      values: {
        name: "Refrakce - pohodlná korekce vzhledem k vysokému CYL",
        pS: -3.75,
        pC: -4.5,
        pA: 180,
        pP: 2.5,
        pB: 90,
        pAdd: -3.25,
        lS: +4.5,
        lC: 90,
        lA: 122,
        lP: 2.5,
        lB: 270,
        lAdd: +2.5,
        pV: 0.633,
        lV: 0.83,
        bV: 1.253,
        text: "",
      },
    },
  ]);

  const [activeItem, setActiveItem] = useState(null);
  const [activeElement, setActiveElement] = useState(null);

  const handleUpdateItem = (id, newValues) => {
    setOptometryItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, values: newValues } : item
      )
    );
  };

  // const handleSavetoDBF = () => {
  //   const prepareExportData = [];

  //   optometryItems.map((modul) => {
  //     console.log(`${JSON.stringify({ ...modul.values })}`);
  //   });

  // };

  const handleSavetoDBF = () => {
  const exportObject = {};

  optometryItems.forEach((modul) => {
    const key = `${modul.id}-${modul.modul}`;

    const processedValues = {};

    Object.entries(modul.values).forEach(([k, v]) => {
      if (v === "" || v === null || v === undefined) {
        // processedValues[k] = v; 
        return;
      }

      // Nahrazení čárky tečkou
      const normalized = typeof v === "string" ? v.replace(",", ".") : v;

      // Je číslo?
      const num = Number(normalized);

      if (!isNaN(num)) {
        processedValues[k] = Math.round(num * 100); // uložení jako INT ×100
      } else {
        processedValues[k] = v; // text se ukládá normálně
      }
    });

    exportObject[key] = processedValues;
  });

  console.log(exportObject);
  return exportObject;
};

  // const [sph, setSph] = useState("");
  // const Component = menuComponent;
  // const [itemsComponent, setItemsComponent] = useState([]);

  // useEffect (()=> {
  //   optometryItems.map(()=> {
  //     const Component = optometryItems.component;
  //     setItemsComponent((prev) => ({...prev , Component}));
  //   })
  // }, [optometryItems]);

  // useEffect (() => {
  //   if (activeElement == 0) {
  //     console.log(`Son says good night.`)

  //   }

  // }, [activeElement])

  return (
    <div className="optometry-container">
      <div className="optometry-left-container">
        {/* Horni MENU */}
        <div className="optometry-control-bar">
          <button className="optometry-control-bar-button">Vizus</button>
          <button className="optometry-control-bar-button">ASTG</button>
          <button className="optometry-control-bar-button">BINO</button>
          <button className="optometry-control-bar-button">CLENS</button>
          <button className="optometry-control-bar-button">MEDIC</button>
          <button type="submit" onClick={handleSavetoDBF}>
            Uložit
          </button>
        </div>
        <div className="optometry-area">
          {/* OPTOMETRY ITEMS */}
          {optometryItems.map((item) => {
            const Component = item.component;
            return (
              <div
                key={item.id}
                id={item.id}
                className={`optometry-modul ${item.width} ${
                  activeItem === item.id ? "active" : ""
                } ${
                  activeElement == 0 && activeItem === item.id ? "move" : ""
                }`}
                onClick={() => setActiveItem(item.id)}
              >
                <Component
                  isActive={activeItem === item.id ? true : false}
                  setActiveElement={setActiveElement}
                  itemValues={item.values}
                  onChange={(newValues) => handleUpdateItem(item.id, newValues)}
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="optometry-right-container">
        <div className="optometry-right-container-head">
          <h6>INFO</h6>
        </div>
        <div className="optometry-right-container-body">
          {/* Anamnéza */}
          {optometryItems[activeItem - 1]?.component.name ==
            "OptometryAnamnesis" && (
            <>
              <p>
                V rámci anamnézy je nutné zjistit minulé zkušenosti, léky a
                požadavky klienta.
              </p>
              <p>
                Důležité je zdravotní anamnéza jak osobní, tak rodinná,
                pracovní, sociální a volnočasová.
              </p>
              <p>...</p>
            </>
          )}

          {/* Naturální VIZUS */}
          {optometryItems[activeItem - 1]?.component.name ==
            "OptometryNaturalVisus" && (
            <>
              <p>
                Zde zadej hodnotu naturálního vizu. Je to hodnota, kterou klient
                čte bez nasazené jakékoliv korekce do dálky.
              </p>
              <p>
                Hodnotu zaznamenej nejdříve pro PRAVÉ oko a poté pro LEVÉ oko.
                Do kolonky BINO pak zadej vizus přečtený oběma očima.
              </p>
              <p>...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientOptometry;
