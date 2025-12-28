import { useEffect, useState } from "react";
import InputDioptricValues from "../../components/catalog/InputDioptricValues.jsx";
import PuffLoaderSpinnerLarge from "../../components/loader/PuffLoaderSpinnerLarge.jsx";
import SegmentedControl from "../../components/controls/SegmentedControl.jsx";

const API_URL = import.meta.env.VITE_API_URL;

function CatalogLens({ client }) {
  const demoValues = {
    pS: "+1.00",
    pC: "+1.75",
    pA: "180",
    lS: "+3.00",
    lC: "+1.00",
    lA: "150",
  };
  const diameter = ["<55", "60", "65", "70", ">70"];
  const lensIndex = ["~1.50", "~1.6", "1.67", "1.74"];
  const design = ["MONO", "MONO PLUS", "OFFICE", "MULTI", "MYOPIA CONTROL"];
  const material = ["sklo", "plast", "polykarbonát", "trivex"];
  const func = ["čirý", "fotochromatické", "polarizační"];
  const layer = ["Tvrzení", "AR", "AR+", "BlueBlock"];
  const manufacturer = [
    "Rodenstock",
    "Essilor",
    "Zeiss",
    "Konvex",
    "Hoya",
    "Čivice",
    "Omega Optix",
  ];

  const [entryValues, setEntryValues] = useState(demoValues);
  const [selectedDiameter, setSelectedDiameter] = useState(diameter[2]);
  const [selectedLensIndex, setSelectedLensIndex] = useState(lensIndex[0]);
  const [selectedDesign, setSelectedDesign] = useState(design[0]);
  const [selectedMaterial, setSelectedMaterial] = useState(material[1]);
  const [selectedFunc, setSelectedFunc] = useState(func[0]);
  const [selectedLayer, setSelectedLayer] = useState(layer[2]);
  const [selectedManufacturer, setSelectedManufacturer] = useState(
    manufacturer[0]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [lensList, setLensList] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showLensDetailID, setShowLensDetailID] = useState(null);

  const handleSearchLens = async (values) => {
    setIsLoading(true);

    function toIntDioptry(value) {
      if (value === null || value === "" || value === undefined) return null;
      return Math.round(parseFloat(value.toString().replace(",", ".")) );
    }

    const loadItems = async () => {
      const lensSearchConditions = {
        pS: toIntDioptry(values.pS),
        pC: values.pC,
        lS: values.lS,
        lC: values.lC,
        pA: values.pA,
        lA: values.lA,
        pAdd: values.pAdd,
        lAdd: values.lAdd,
        diameter: selectedDiameter,
        index: selectedLensIndex,
        design: selectedDesign,
        material: selectedMaterial,
        function: selectedFunc,
        layer: selectedLayer,
      };

      try {
        const res = await fetch(
          `${API_URL}/catalog/lenssearch?page=${page}&limit=${limit}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(lensSearchConditions),
          }
        );
        const data = await res.json();

        if (res.ok) {
          setLensList(data.items);
          setTotalPages(data.totalPages);
          setIsLoading(false);
        } else {
          setError(data.message);
          console.error("Error loading items:", error);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Nepodařilo se načíst klienty.");
      }
    };
    loadItems();
  };

  const showLensDetail = (lensId) => {
    lensId === showLensDetailID
      ? setShowLensDetailID(null)
      : setShowLensDetailID(lensId);
  };

  return (
    // <div
    //   style={{
    //     display: "flex",
    //     flexDirection: "row",
    //   }}
    // >
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

        <div className="segmented-control-container">
          <div className="segmented-control-item">
            <h3>Výrobce</h3>
            <SegmentedControl
              items={manufacturer}
              selectedValue={selectedManufacturer}
              onClick={(item) => setSelectedManufacturer(item)}
            />
          </div>
          <div className="segmented-control-item">
            <h3>Průměr</h3>
            <SegmentedControl
              items={diameter}
              selectedValue={selectedDiameter}
              onClick={(item) => setSelectedDiameter(item)}
            />
          </div>
          <div className="segmented-control-item">
            <h3>Index lomu</h3>
            <SegmentedControl
              items={lensIndex}
              selectedValue={selectedLensIndex}
              onClick={(item) => setSelectedLensIndex(item)}
            />
          </div>
          <div className="segmented-control-item">
            <h3>Design</h3>
            <SegmentedControl
              items={design}
              selectedValue={selectedDesign}
              onClick={(item) => setSelectedDesign(item)}
            />
          </div>
        </div>

        <div className="segmented-control-container">
          <div className="segmented-control-item">
            <h3>Materiál</h3>
            <SegmentedControl
              items={material}
              selectedValue={selectedMaterial}
              onClick={(item) => setSelectedMaterial(item)}
            />
          </div>
          <div className="segmented-control-item">
            <h3>Funkce</h3>
            <SegmentedControl
              items={func}
              selectedValue={selectedFunc}
              onClick={(item) => setSelectedFunc(item)}
            />
          </div>
          <div className="segmented-control-item">
            <h3>Povrchová úprava</h3>
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

      <div className="show-items-panel">
        <PuffLoaderSpinnerLarge active={isLoading} />
        <div className="info-box-2">
          <h2>Budu hledat podle těchto kritérií:</h2>
          <p>Průměr: {selectedDiameter}</p>
          <p>Index čočky: {selectedLensIndex}</p>
          <p>Design: {selectedDesign}</p>
          <p>Materiál: {selectedMaterial}</p>
          <p>Funkce: {selectedFunc}</p>
          <p>Povrchová úprava: {selectedLayer}</p>
        </div>
        {lensList?.length > 0 &&
          lensList.map((lens) => (
            <div
              key={lens?.id}
              className="cl-item"
              onClick={() => showLensDetail(lens?.id)}
            >
              <h1>
                {`${lens?.name} ${lens?.manufact_name} ${
                  lens?.design == 1
                    ? "MONO"
                    : lens?.design == 2
                    ? "MONO PLUS"
                    : lens?.design == 3
                    ? "Office"
                    : lens?.design == 4
                    ? "Progresivní"
                    : "Myopia Control"
                } ${lens?.index} `}{" "}
              </h1>
              {showLensDetailID === lens?.id && (
                <div className="cl-item-details">
                  <p>{`Funkce: ${lens?.func} Barva: ${JSON.stringify(
                    lens?.colors
                  )} Vrstva: ${lens?.layers} Výroba: ${lens?.lab} Cena: ${
                    lens?.price
                  } Kč`}</p>
                  <p>{`Průměr: ${lens?.range_dia} mm Rozsah: ${lens?.range_start} - ${lens?.range_end} D CYL: ${lens?.range_cyl} D`}</p>
                  <p>{`Hustota: ${lens?.density} g/cm3 UVA: ${lens?.uva}% UVB: ${lens?.uvb}% Abbe: ${lens?.abbe}`}</p>
                  <p>{lens?.note}</p>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default CatalogLens;
