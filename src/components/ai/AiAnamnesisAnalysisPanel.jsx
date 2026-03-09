import { useMemo, useState } from "react";
import { apiCall } from "../../utils/api";

function AiAnamnesisAnalysisPanel({ optometryItems = [] }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const [question, setQuestion] = useState("");

  const anamnesisText = useMemo(() => {
    const items = Array.isArray(optometryItems) ? optometryItems : [];

    const anamnesisItem =
      items.find((item) => Number(item?.modul) === 1) ||
      items.find((item) => {
        const valueName = String(item?.values?.name ?? "").toLowerCase();
        return valueName.includes("anam");
      });

    const text = anamnesisItem?.values?.text;
    return typeof text === "string" ? text.trim() : "";
  }, [optometryItems]);

  const runAnalysis = async (userQuestion = "") => {
    if (!anamnesisText) {
      setError("Nejprve vyplň text v modulu Anamnéza.");
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await apiCall(
        "/client/analyze_optometry_anamnesis_ai",
        "POST",
        {
          anamnesisText,
          userQuery: userQuestion,
        },
      );

      const findings = Array.isArray(response?.findings) ? response.findings : [];
      const normalized = findings
        .map((item) => {
          if (typeof item === "string") return item.trim();

          const topic = String(item?.topic ?? "").trim();
          const impact = String(item?.impact ?? "").trim();
          if (!topic && !impact) return "";
          if (!topic) return impact;
          if (!impact) return topic;
          return `${topic}: ${impact}`;
        })
        .filter(Boolean);

      setResults(normalized);

      if (!normalized.length) {
        setError("AI nenašla v textu konkrétní onemocnění ani léky.");
      }
    } catch (err) {
      setResults([]);
      setError(err?.message || "Nepodařilo se získat AI analýzu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeClick = async () => {
    await runAnalysis("");
  };

  const handleSubmitQuestion = async () => {
    await runAnalysis(question.trim());
  };

  return (
    <div className="ai-panel">
      <p>
        AI zhodnotí zadaná onemocnění a léky z anamnézy a vrátí krátký dopad na
        zdraví očí.
      </p>

      <button
        type="button"
        className="ai-btn"
        onClick={handleAnalyzeClick}
        disabled={isLoading}
      >
        {isLoading ? "Analyzuji..." : "Analýza AI"}
      </button>

      <div className="ai-results" aria-live="polite">
        {!isLoading && !error && results.length === 0 && (
          <p>Zatím bez výsledků. Vyplň anamnézu a spusť analýzu.</p>
        )}

        {error && <p>{error}</p>}

        {!error && results.length > 0 && (
          <ul>
            {results.map((line, index) => (
              <li key={`${line}-${index}`}>{line}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="ai-followup">
        <label htmlFor="ai-followup-question">Zpřesňující dotaz pro AI</label>
        <textarea
          id="ai-followup-question"
          className="ai-followup-textarea"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Např. Jak mohou uvedené léky ovlivnit nitrooční tlak?"
        />
        <button
          type="button"
          className="ai-btn"
          onClick={handleSubmitQuestion}
          disabled={isLoading}
        >
          Odeslat
        </button>
      </div>
    </div>
  );
}

export default AiAnamnesisAnalysisPanel;
