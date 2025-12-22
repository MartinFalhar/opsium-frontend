import { useEffect, useState } from "react";
import "./Catalog.css";
import PuffLoaderSpinnerLarge from "../../components/loader/PuffLoaderSpinnerLarge.jsx";
import Pagination from "../../components/pagination/Pagination.jsx";
import InputDioptricValues from "../../components/catalog/InputDioptricValues.jsx";
import { useUser } from "../../context/UserContext";

const API_URL = import.meta.env.VITE_API_URL;

function CatalogContactLens() {
  const item = {
    pS: "-1.25",
    pC: "-2.00",
    pA: "180",
    lS: "+6.75",
    lC: "-1.50",
    lA: "130",
  };

  const [selectedFreq, setSelectedFreq] = useState("1D");
  const [selectedDesign, setSelectedDesign] = useState("MONO");
  const [selectedManufact, setSelectedManufact] = useState("Alcon");

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchInCatalog, setSearchInCatalog] = useState("");
  const [clList, setClList] = useState([]);

  const [itemValues, setItemValues] = useState(item);

  const { catalog_cl, setCatalog_cl } = useUser();
  //PAGINATION HOOKS
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6;

  // useEffect(() => {
  //   handleSearchInCatalog(searchInCatalog);
  // }, [page]);

  useEffect(() => {
    handleSearchInCatalog(searchInCatalog);
  }, []);

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
          // Normalize items: if `clens.range` is an object that itself contains the key `range`,
          // replace it with a fallback array so the UI can safely render it.
          const processedItems = data.items.map((clens) => {


            if (clens?.range && typeof clens.range === "object" && "range" in clens.range) {
              return { ...clens, range: ["Nedostupné hodnoty"] };
            }

            console.log("CLENS RANGE TYPE:", clens.range);

            // if (Array.isArray(clens.range)) {






            return clens;
          });

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
            itemValues={itemValues}
            onChange={(newValues) => setItemValues(newValues)}
          />
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
            <div key={clens.id} className="client-item-2">
              <h1>
                {`${clens.name} ${clens.manufacturer} ${clens.design} ${clens.freq}`}{" "}
              </h1>
              <p>{`${JSON.stringify(clens.range)}`}</p>
            </div>
          ))}
        List container for contact lens
        <p>Expandable container</p>
      </div>
    </div>
  );
}

export default CatalogContactLens;
