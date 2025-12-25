import { useEffect, useState } from "react";
import "./Catalog.css";
import PuffLoaderSpinnerLarge from "../../components/loader/PuffLoaderSpinnerLarge.jsx";
import Pagination from "../../components/pagination/Pagination.jsx";
import InputDioptricValues from "../../components/catalog/InputDioptricValues.jsx";
import { useUser } from "../../context/UserContext";

const API_URL = import.meta.env.VITE_API_URL;

function CatalogContactLens() {
  const demoValues = {
    pS: "-6.50",
    pC: "-3.25",
    pA: "180",
    lS: "+3.00",
    lC: "0",
    lA: "150",
  };
  const vd = 0.0;

  const calculateCL = (values) => {
    const parse = (v) => {
      const n = parseFloat(v?.replace(",", "."));
      return isNaN(n) ? null : n;
    };
    const res = { ...values };

    ["pS", "pC", "lS", "lC"].forEach((key) => {
      let val = parse(values[key]);
      if (val === null) return;

      key === "pC" ? (val += parse(values["pS"]) || 0) : null;
      key === "lC" ? (val += parse(values["lS"]) || 0) : null;

      let cl = val / (1 - vd * val);

      key === "pC" && cl > res["pS"] ? (cl += parse(res["pS"]) || 0) : null;
      key === "pC" && cl < res["pS"] ? (cl -= parse(res["pS"]) || 0) : null;

      res[key] = cl.toFixed(2);
    });

    return res;
  };

  const [selectedFreq, setSelectedFreq] = useState("1D");
  const [selectedDesign, setSelectedDesign] = useState("MONO");
  const [selectedManufact, setSelectedManufact] = useState("Alcon");

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInCatalog, setSearchInCatalog] = useState("");
  const [clList, setClList] = useState([]);

  const [entryValues, setEntryValues] = useState(demoValues);
  const [clValues, setClValues] = useState(() => calculateCL(demoValues));

  const { catalog_cl, setCatalog_cl } = useUser();
  //PAGINATION HOOKS
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  useEffect(() => {
    setClValues(calculateCL(entryValues));
  }, [entryValues]);

  useEffect(() => {
    handleSearchInCatalog(searchInCatalog);
  }, []);

  function normalizeAX(ax) {
    if (Array.isArray(ax)) {
      const [from, to, step] = ax;
      const result = [];
      for (let v = from; v <= to; v += step) {
        result.push(v);
      }
      return result;
    }

    if (typeof ax === "string") {
      return ax.split(",").map(Number);
    }

    return [];
  }

  function isValueInRange(value, [from, to, step]) {
    // console.log("Checking value in range:", { value, from, to, step });
    if (value < from || value > to) {
      // console.log("Value is out of range.");
      return false;
    }
    const diff = Math.abs(value - from);
    const res = Number.isInteger(diff / step);
    // console.log("Value is in range:", res);
    return res;
  }

  function isLensAvailable(data, inputSPH, inputCYL, inputAX) {
    console.log("Checking lens availability for:", {
      inputSPH,
      inputCYL,
      inputAX,
    });
    return data.some((entry) => {
      const sphOK = isValueInRange(inputSPH, entry.SPH);
      const cylOK = isValueInRange(inputCYL, entry.CYL);
      console.log("Entry check:", { entry, sphOK, cylOK });

      if (!sphOK || !cylOK) return false;

      const axValues = normalizeAX(entry.AX);
      console.log("Normalized AX values:", axValues);
      console.log(typeof inputAX, inputAX);
      const isInAxis = axValues.includes(Number(inputAX));
      console.log("Axis check:", { inputAX, isInAxis });
      return isInAxis;
    });
  }
  const handleSearchInCatalog = async (values) => {
    setIsLoading(true);
    const loadItems = async () => {
      try {
        const res = await fetch(
          `${API_URL}/catalog/clsearch?page=${page}&limit=${limit}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ searchText: values }),
          }
        );
        const data = await res.json();

        if (res.ok) {
          const processedItems = data.items
            .filter((clens) => {
              // vyřadíme položky, kde je range objekt s vnořeným range
              return !(
                clens?.range &&
                typeof clens.range === "object" &&
                "range" in clens.range
              );
            })
            .map((clens) => {
              const available = isLensAvailable(
                clens.range,
                clValues.pS,
                clValues.pC,
                clValues.pA
              );

              return available ? { ...clens } : null;
            })
            .filter(Boolean);
          //OBLAST FILTRACE PODLE HODNOT
          console.log("I find out in " + clValues.pC);

          setClList(processedItems);
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

  return (
    <div>
      <div
        className="input-panel"
        style={{
          flexDirection: "row",
          background: "var(--color-bg-b9)",
          border: "var(--color-bg-b1)",
        }}
      >
        <div
          className="cl-specific"
          style={{
            display: "flex",
            flexDirection: "column",
            marginRight: "10px",
            flex: "1",
          }}
        >
          <div className="segmented-control">
            {["1D", "7D", "14D", "30D", "více"].map((value) => (
              <button
                key={value}
                className={`button-controler ${
                  selectedFreq === value ? "active" : ""
                }`}
                onClick={() => setSelectedFreq(value)}
              >
                {value}
              </button>
            ))}
          </div>
          <div className="segmented-control">
            {["MONO", "ASTG", "MTF", "Barevné", "Myopia Control"].map(
              (value) => (
                <button
                  key={value}
                  className={`button-controler ${
                    selectedDesign === value ? "active" : ""
                  }`}
                  onClick={() => setSelectedDesign(value)}
                >
                  {value}
                </button>
              )
            )}
          </div>
          <div className="segmented-control">
            {["Alcon", "B+L", "CooperVision", "J&J"].map((value) => (
              <button
                key={value}
                className={`button-controler ${
                  selectedManufact === value ? "active" : ""
                }`}
                onClick={() => setSelectedManufact(value)}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        <div className="cl-direct-dioptric">
          <InputDioptricValues
            entryValues={entryValues}
            onChangeEntry={setEntryValues}
          />
        </div>

        <div>
          <div>
            <h1>CONTACT LENS CORRECTION</h1>
            vd={vd} m
            <p>
              SPH{clValues.pS}/CYL{clValues.pC}@{clValues.pA}°
            </p>
            <p>
              SPH{clValues.lS}/CYL{clValues.lC}@{clValues.lA}°
            </p>
          </div>
        </div>
      </div>
      <div
        className="input-panel"
        style={{
          height: "550px",
          overflowY: "scroll",
        }}
      >
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
        />
        {!clList?.length > 0 && <PuffLoaderSpinnerLarge active={isLoading} />}
        {clList?.length > 0 &&
          clList.map((clens) => (
            <div key={clens?.id} className="client-item-2">
              <h1>
                {`${clens?.name} ${clens?.manufacturer} ${clens?.design} ${clens?.freq}`}{" "}
              </h1>
              <p>{`${JSON.stringify(clens?.range)}`}</p>
            </div>
          ))}
        List container for contact lens
        <p>Expandable container</p>
      </div>
    </div>
  );
}

export default CatalogContactLens;
