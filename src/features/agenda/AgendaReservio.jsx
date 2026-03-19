import { useEffect, useMemo, useState } from "react";
import "./AgendaReservio.css";

const API_URL = import.meta.env.VITE_API_URL;

function toDateInputValue(date) {
  return date.toISOString().slice(0, 10);
}

function formatDateLabel(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("cs-CZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatTimeLabel(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleTimeString("cs-CZ", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AgendaReservio({ client }) {
  const [selectedDate, setSelectedDate] = useState(() => toDateInputValue(new Date()));
  const [overview, setOverview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();

    async function loadWeeklyOverview() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_URL}/agenda/reservio/weekly-overview?date=${selectedDate}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            signal: abortController.signal,
          },
        );

        const data = await response.json();

        if (!response.ok || !data?.success) {
          throw new Error(data?.message || "Nepodařilo se načíst Reservio data.");
        }

        setOverview(data);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message || "Reservio API je dočasně nedostupné.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadWeeklyOverview();

    return () => abortController.abort();
  }, [selectedDate]);

  const totalItems = useMemo(() => {
    if (!overview?.days) {
      return 0;
    }

    return overview.days.reduce((sum, day) => sum + day.items.length, 0);
  }, [overview]);

  const shiftWeek = (daysToShift) => {
    const base = new Date(`${selectedDate}T12:00:00Z`);
    base.setUTCDate(base.getUTCDate() + daysToShift);
    setSelectedDate(toDateInputValue(base));
  };

  return (
    <div className="reservio-container">
      <div className="reservio-header">
        <h2>Reservio: tydenni prehled rezervaci</h2>
        <p>Prihlaseny uzivatel: {client?.name || "-"}</p>
      </div>

      <div className="reservio-toolbar">
        <button type="button" onClick={() => shiftWeek(-7)}>
          Predchozi tyden
        </button>
        <button type="button" onClick={() => setSelectedDate(toDateInputValue(new Date()))}>
          Aktualni tyden
        </button>
        <button type="button" onClick={() => shiftWeek(7)}>
          Dalsi tyden
        </button>
      </div>

      <div className="reservio-summary">
        <div>
          <h4>Rozsah</h4>
          <p>
            {formatDateLabel(overview?.weekStart)} - {formatDateLabel(overview?.weekEnd)}
          </p>
        </div>
        <div>
          <h4>Udalosti</h4>
          <p>{overview?.summary?.totalEvents ?? 0}</p>
        </div>
        <div>
          <h4>Rezervace</h4>
          <p>{overview?.summary?.totalBookings ?? 0}</p>
        </div>
        <div>
          <h4>Polozky v tydnu</h4>
          <p>{totalItems}</p>
        </div>
      </div>

      {isLoading ? <p className="reservio-state">Nacitam data z Reservio...</p> : null}
      {error ? <p className="reservio-state reservio-error">{error}</p> : null}

      {!isLoading && !error && overview?.days ? (
        <div className="reservio-days-grid">
          {overview.days.map((day) => (
            <article key={day.date} className="reservio-day-card">
              <header>
                <h3>{day.label}</h3>
                <p>{formatDateLabel(day.date)}</p>
              </header>

              {day.items.length === 0 ? (
                <p className="reservio-empty">Bez rezervaci</p>
              ) : (
                <ul>
                  {day.items.map((item) => (
                    <li key={item.id}>
                      <p>
                        <strong>{formatTimeLabel(item.start)}</strong> - {item.name}
                      </p>
                      <p>Klient: {item.bookedClientName || "-"}</p>
                      <p>Stav: {item.state || "-"}</p>
                      <p>Pocet rezervaci: {item.bookingsCount}</p>
                      {item.note ? <p>Poznamka: {item.note}</p> : null}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default AgendaReservio;
