import { useEffect, useState } from "react";
import InputDioptricValues from "../../components/catalog/InputDioptricValues.jsx";

import SegmentedControl from "../../components/controls/SegmentedControl.jsx";

function CatalogLens({ client }) {
  const demoValues = {
    pS: "-1.00",
    pC: "-1.75",
    pA: "180",
    lS: "+3.00",
    lC: "0",
    lA: "150",
  };
  const diameter = ["<55", "60", "65", "70", ">70"];
  const lensIndex = ["~1.50", "~1.6", "1.67", "1.74"];
  const design = ["MONO", "MONO PLUS", "OFFICE", "MULTI"];
  const material = ["čirý", "polykarbonát", "sabarvící", "PRO"];
  const layer = ["Tvrzení", "AR", "AR+", "BlueBlock"];

  const [entryValues, setEntryValues] = useState(demoValues);
  const [selectedDiameter, setSelectedDiameter] = useState(diameter[0]);
  const [selectedLensIndex, setSelectedLensIndex] = useState(lensIndex[0]);
  const [selectedDesign, setSelectedDesign] = useState(design[0]);
  const [selectedMaterial, setSelectedMaterial] = useState(material[0]);
  const [selectedLayer, setSelectedLayer] = useState(layer[0]);

  const handleSearchLens = (values) => {
    console.log("Searching lens with values:", values);
    // Implement search logic here
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div
        className="left-container"
        style={{
          flexDirection: "column",
          background: "var(--color-bg-b5)",
          border: "var(--color-bg-b1)",
        }}
      >
        <div className="input-panel">
          <div className="dioptric-values-container">
            {/* <div className="cl-direct-dioptric"> */}
            <InputDioptricValues
              entryValues={entryValues}
              onChangeEntry={setEntryValues}
            />
          </div>
        </div>
        <div className="show-items-panel">
          <div className="info-box-2">
            <h2>Budu hledat podle těchto kritérií:</h2>
            <p>Průměr: {selectedDiameter}</p>
            <p>Index čočky: {selectedLensIndex}</p>
            <p>Design: {selectedDesign}</p>
            <p>Materiál: {selectedMaterial}</p>
            <p>Povrchová úprava: {selectedLayer}</p>
          </div>
        </div>
      </div>
      <div className="right-container">
          <h1>Filtry vyhledávání</h1>
        <div className="segmented-control-container">
          <div className="segmented-control-item">
            <h4>Průměr</h4>
            <SegmentedControl
              items={diameter}
              selectedValue={selectedDiameter}
              onClick={(item) => setSelectedDiameter(item)}
            />
          </div>
          <div className="segmented-control-item">
            <h4>Index lomu</h4>
            <SegmentedControl
              items={lensIndex}
              selectedValue={selectedLensIndex}
              onClick={(item) => setSelectedLensIndex(item)}
            />
          </div>
          <div className="segmented-control-item">
            <h4>Design</h4>
            <SegmentedControl
              items={design}
              selectedValue={selectedDesign}
              onClick={(item) => setSelectedDesign(item)}
            />
          </div>
          <div className="segmented-control-item">
            <h4>Materiál</h4>
            <SegmentedControl
              items={material}
              selectedValue={selectedMaterial}
              onClick={(item) => setSelectedMaterial(item)}
            />
          </div>
          <div className="segmented-control-item">
            <h4>Povrchová úprava</h4>
            <SegmentedControl
              items={layer}
              selectedValue={selectedLayer}
              onClick={(item) => setSelectedLayer(item)}
            />
          </div>
        </div>
          <div className="buttons-container">
            <button type="submit" onClick={() => handleSearchLens(entryValues)}>
              Hledej
            </button>
          </div>
      </div>
    </div>
  );
}

export default CatalogLens;
