// import { useState } from "react";
import "./ClientOptometry.css";
import OptometryAnamnesis from "../../components/optometry/OptometryAnamnesis";
import OptometryNaturalVisus from "../../components/optometry/OptometryNaturalVisus";
import { useEffect, useState } from "react";

function ClientOptometry() {
  const optometryItems = [
    {
      id: "1",
      width: "w50",
      component: OptometryAnamnesis,
    },
    {
      id: "2",
      width: "w25",
      component: OptometryNaturalVisus,
    },
  ];

  const [activeItem, setActiveItem] = useState(null);
  const [activeElement, setActiveElement] = useState(null);

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
          <button type="submit">Uložit</button>
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
                <Component isActive={activeItem === item.id ? true : false} setActiveElement={setActiveElement}/>
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
              <p>V rámci anamnézy je nutné zjistit minulé zkušenosti, léky a požadavky klienta.</p>
              <p>Důležité je zdravotní anamnéza jak osobní, tak rodinná, pracovní, sociální a volnočasová.</p>
              <p>...</p>
            </>
          )}
          
          {/* Naturální VIZUS */}
          {optometryItems[activeItem - 1]?.component.name ==
            "OptometryNaturalVisus" && (
            <>
              <p>Zde zadej hodnotu naturálního vizu. Je to hodnota, kterou klient čte bez nasazené jakékoliv korekce do dálky.</p>
              <p>Hodnotu zaznamenej nejdříve pro PRAVÉ oko a poté pro LEVÉ oko. Do kolonky BINO pak zadej vizus přečtený oběma očima.</p>
              <p>...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientOptometry;
