import React from "react";

function ConvertOptometryItems(optometryItems) {
  const exportObject = {}; //vytvoření objektu pro export z naměřených hodnot
  optometryItems.forEach((modul) => {
    //modul.id = pořadové číslo v optometryItems
    //modul.modul = určuje typ modulu (1=Anamnéza, 2=Vizus, 3=Refrakce, ...)
    const key = `${modul.id}-${modul.modul}`;
    const processedValues = {};
    Object.entries(modul.values).forEach(([k, v]) => {
      if (v === "" || v === null || v === undefined) {
        //je-li prázdná hodnota, neukládá se nic
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
  console.log(`ConvertOptometryItems - exportObject:`, exportObject);
  return exportObject;
}
export default ConvertOptometryItems;
