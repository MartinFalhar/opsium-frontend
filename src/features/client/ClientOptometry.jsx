// import { useState } from "react";
import { useState } from "react";
import "./ClientOptometry.css";

//IMPORT OPTOMETRY COMPONENT
import OptometryAnamnesis from "../../components/optometry/OptometryAnamnesis";
import OptometryNaturalVisus from "../../components/optometry/OptometryNaturalVisus";
import OptometryRefraction from "../../components/optometry/OptometryRefraction";
import OptometryRefractionARK from "../../components/optometry/OptometryRefractionARK";
import OptometryRefractionFull from "../../components/optometry/OptometryRefractionFull";

function ClientOptometry() {
  const [optometryItems, setOptometryItems] = useState([
    {
      id: "1",
      width: "w50",
      component: OptometryAnamnesis,
      values: {
        name: "Anamnéza",
        note: "",
      },
    },
    {
      id: "2",
      width: "w25",
      component: OptometryNaturalVisus,
      values: {
        name: "Naturální vizus",
        p: "",
        l: "",
        pl: "",
        style: 0,
        note: "",
      },
    },
    {
      id: "3",
      width: "w25",
      component: OptometryRefractionARK,
      values: {
        name: "OBJEKTIVNÍ refrakce",
        pSph: "",
        pCyl: "",
        pAx: "",
        lSph: "",
        lCyl: "",
        lAx: "",
        note: "",
      },
    },
    {
      id: "4",
      width: "w50",
      component: OptometryRefraction,
      values: {
        name: "Vstupní refrakce - brýle na dálku",
        pSph: "",
        pCyl: "",
        pAx: "",
        pAdd: "",
        lSph: "",
        lCyl: "",
        lAx: "",
        lAdd: "",
        pV: "",
        lV: "",
        plV: "",
        style: 0,
        note: "",
      },
    },
    {
      id: "5",
      width: "w75",
      component: OptometryRefractionFull,
      values: {
        name: "Refrakce - plný zápis",
        pSph: "",
        pCyl: "",
        pAx: "",
        pPrism: "",
        pBase: "",
        pAdd: "",
        lSph: "",
        lCyl: "",
        lAx: "",
        lPrism: "",
        lBase: "",
        lAdd: "",
        pV: "",
        lV: "",
        plV: "",
        style: 0,
        note: "",
      },
    },
    {
      id: "6",
      width: "w75",
      component: OptometryRefractionFull,
      values: {
        name: "Refrakce - pohodlná korekce vzhledem k vysokému CYL",
        sph: "",
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


const handleSavetoDBF = () => {
console.log(optometryItems[0].values.note);


}

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
          <button type="submit"
          onClick={handleSavetoDBF}>Uložit</button>
        </div>
        <div className="optometry-area">
          {/* OPTOMETRY ITEMS */}
          {optometryItems.map((item) => {
            const Component = item.component;
            return (
              <div
                key={item.id}
                id={item.id}
                className={`optometry-item ${item.width} ${
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
