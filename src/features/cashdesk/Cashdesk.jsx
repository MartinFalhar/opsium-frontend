import React, { useCallback, useEffect, useState } from "react";
import "./Cashdesk.css";
import SegmentedControl from "../../components/controls/SegmentedControl.jsx";

const API_URL = import.meta.env.VITE_API_URL;
const PAYMENT_METHOD_TO_ATTRIB = {
  Hotovost: 1,
  Karta: 2,
  Převod: 3,
  Šeky: 4,
};
const TIME_RANGE_TO_KEY = {
  Dnes: "today",
  Včera: "yesterday",
  "3 dny": "3days",
  Týden: "week",
  Měsíc: "month",
};

function Cashdesk() {
  const timeRange = ["Vše", "Dnes", "Včera", "3 dny", "Týden", "Měsíc"];
  const paymentMethod = ["Vše", "Hotovost", "Karta", "Převod", "Šeky"];

  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange[0]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    paymentMethod[0],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [inputSearch, setInputSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  const handleSearchInTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const paymentAttrib =
        PAYMENT_METHOD_TO_ATTRIB[selectedPaymentMethod] ?? null;
      const timeRangeKey = TIME_RANGE_TO_KEY[selectedTimeRange] ?? null;

      const res = await fetch(`${API_URL}/store/transaction-list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          query: activeSearch,
          payment_attrib: paymentAttrib,
          time_range: timeRangeKey,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setTransactions(Array.isArray(data) ? data : []);
      } else {
        setError(data.message);
        console.error("Error loading transactions:", data.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Nepodařilo se načíst transakce.");
    } finally {
      setIsLoading(false);
    }
  }, [activeSearch, selectedPaymentMethod, selectedTimeRange]);

  useEffect(() => {
    handleSearchInTransactions();
  }, [handleSearchInTransactions]);

  const formatOrderNumber = (transaction) => {
    const year = String(transaction?.year ?? "")
      .slice(-2)
      .padStart(2, "0");
    const number = String(transaction?.number ?? "").padStart(5, "0");

    if (!year && !number) {
      return String(transaction?.order_id ?? "-");
    }

    return `${year}${number}`;
  };

  const formatDateAndTime = (value) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return { date: "-", time: "-" };
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return {
      date: `${day}/${month}/${year}`,
      time: `${hours}:${minutes}`,
    };
  };

  const formatPrice = (value) => `${Number(value ?? 0).toFixed(2)} Kč`;

  return (
    <div className="container">
      <div className="left-container-2">
        <div className="input-panel">
          <div className="search-input-container">
            <input
              type="text"
              value={inputSearch}
              onChange={(e) => setInputSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setActiveSearch(inputSearch);
                }
              }}
              placeholder="Zadej hledaný text"
            />
            <button type="submit" onClick={() => setActiveSearch(inputSearch)}>
              Hledej
            </button>
            <div className="segmented-control-item">
              <h5>Časový rozsah</h5>
              <SegmentedControl
                items={timeRange}
                selectedValue={selectedTimeRange}
                onClick={(item) => setSelectedTimeRange(item)}
              />
            </div>
            <div className="segmented-control-item">
              <h5>Platební metoda</h5>
              <SegmentedControl
                items={paymentMethod}
                selectedValue={selectedPaymentMethod}
                onClick={(item) => setSelectedPaymentMethod(item)}
              />
            </div>
          </div>
        </div>
        <div
          className="show-items-panel"
          style={{
            overflowY: "scroll",
          }}
        >
          <div className="items-panel-label">
            <h5>Přijaté platby</h5>
            <p>Nalezeno {transactions?.length || 0} položek</p>
          </div>
          <div className="items-panel-table-header five-columns">
            <h3>Datum</h3>
            <h3>Zakázka / Jméno</h3>
            <h3>Typ platby</h3>
            <h3>Zakázka</h3>
            <h3>Celková částka</h3>
          </div>
          <div className="items-list">
            {isLoading && <p>Načítám transakce...</p>}
            {error && <p>{error}</p>}

            {!isLoading &&
              transactions.length > 0 &&
              transactions.map((transaction) => {
                const { date, time } = formatDateAndTime(
                  transaction.created_at,
                );

                return (
                  <details key={transaction.id}>
                    <summary
                      className="items-panel-table-header five-columns"
                      style={{ cursor: "pointer" }}
                    >
                      <div className="item-name">
                        <p>{`${date} ${time}`}</p>
                      </div>
                      <div className="item-name">
                        <p>{`${formatOrderNumber(transaction)} ${transaction.customer_name || "Neznámý zákazník"}`}</p>
                      </div>
                      <div className="item-name">
                        <p>{transaction.payment_method || "platba"}</p>
                      </div>
                      <div className="item-name">
                        <p>{formatOrderNumber(transaction)}</p>
                      </div>
                      <div className="item-name">
                        <p>{formatPrice(transaction.amount)}</p>
                      </div>
                    </summary>
                    <div>
                      <table>
                        <thead>
                          <tr>
                            <th>Typ</th>
                            <th>Price</th>
                            <th>VAT</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>A</td>
                            <td>{formatPrice(transaction.price_a)}</td>
                            <td>{formatPrice(transaction.vat_a)}</td>
                          </tr>
                          <tr>
                            <td>B</td>
                            <td>{formatPrice(transaction.price_b)}</td>
                            <td>{formatPrice(transaction.vat_b)}</td>
                          </tr>
                          <tr>
                            <td>C</td>
                            <td>{formatPrice(transaction.price_c)}</td>
                            <td>{formatPrice(transaction.vat_c)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </details>
                );
              })}

            {!isLoading && transactions.length === 0 && !error && (
              <p>Žádné transakce k zobrazení.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cashdesk;
