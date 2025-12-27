import { useEffect, useState } from "react";
import InputDioptricValues from "../../components/catalog/InputDioptricValues.jsx";
import PuffLoaderSpinnerLarge from "../../components/loader/PuffLoaderSpinnerLarge.jsx";
import SegmentedControl from "../../components/controls/SegmentedControl.jsx";

const API_URL = import.meta.env.VITE_API_URL;

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
  const design = ["MONO", "MONO PLUS", "OFFICE", "MULTI", "MYOPIA CONTROL"];
  const material = ["sklo", "plast", "polykarbonát", "trivex"];
  const func = ["čirý", "fotochromatické", "polarizační"];
  const layer = ["Tvrzení", "AR", "AR+", "BlueBlock"];

  const [entryValues, setEntryValues] = useState(demoValues);
  const [selectedDiameter, setSelectedDiameter] = useState(diameter[2]);
  const [selectedLensIndex, setSelectedLensIndex] = useState(lensIndex[0]);
  const [selectedDesign, setSelectedDesign] = useState(design[0]);
  const [selectedMaterial, setSelectedMaterial] = useState(material[1]);
  const [selectedFunc, setSelectedFunc] = useState(func[0]);
  const [selectedLayer, setSelectedLayer] = useState(layer[2]);
  const [isLoading, setIsLoading] = useState(false);
  const [lensList, setLensList] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [showLensDetailID, setShowLensDetailID] = useState(null);

  const handleSearchLens = async (values) => {
    setIsLoading(true);
    const loadItems = async () => {
      try {
        const res = await fetch(
          `${API_URL}/catalog/lenssearch?page=${page}&limit=${limit}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ searchText: values }),
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
          <div className="info-box-2">
            <h2>Budu hledat podle těchto kritérií:</h2>
            <p>Průměr: {selectedDiameter}</p>
            <p>Index čočky: {selectedLensIndex}</p>
            <p>Design: {selectedDesign}</p>
            <p>Materiál: {selectedMaterial}</p>
            <p>Funkce: {selectedFunc}</p>
            <p>Povrchová úprava: {selectedLayer}</p>
          </div>
          <PuffLoaderSpinnerLarge active={isLoading} />
        </div>
        <div className="show-items-panel">
          {lensList?.length > 0 &&
            lensList.map((lens) => (
              <div
                key={lens?.id}
                className="cl-item"
                onClick={() => showLensDetail(lens?.id)}
              >
                <h1>
                  {`${lens?.name} ${lens?.id_manufact} ${
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
                    <p>{`Funkce: ${
                      lens?.func
                    } Barva: ${JSON.stringify(
                      lens?.colors
                    )} Vrstva: ${lens?.layers} Výroba: ${lens?.lab}`}</p>
                    <p>{`Průměr: ${lens?.range_dia} mm Rozsah: ${lens?.range_start} - ${lens?.range_end} D CYL: ${lens?.range_cyl} D`}</p>
                    <p>{`Hustota: ${lens?.density} g/cm3 UVA: ${lens?.uva}% UVB: ${lens?.uvb}% Abbe: ${lens?.abbe}`}</p>
                  </div>
                )}
              </div>
            ))}
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
            <h4>Funkce</h4>
            <SegmentedControl
              items={func}
              selectedValue={selectedFunc}
              onClick={(item) => setSelectedFunc(item)}
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
