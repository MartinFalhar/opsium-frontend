import { useEffect, useRef, useCallback } from "react";

/**
 * useAutosave
 *
 * options:
 * - data: objekt (stav) který chceme ukládat
 * - name: název záznamu
 * - clientId, branchId, memberId
 * - convertFn(data) => objekt vhodný pro uložení / export
 * - saveToDBFn(payload) => async funkce, uloží do DB
 * - headerClients, setHeaderClients => pro správu notSavedDetected flag
 *
 * Vrací: { saveNow } - funkci pro okamžité uložení
 */
export default function useAutosave({
  data,
  name,
  clientId,
  branchId,
  memberId,
  convertFn,
  saveToDBFn,
  headerClients = [],
  setHeaderClients,
  autosaveIntervalMs = 60000, // 60s
  debounceMs = 1000, // 1s
}) {
  const debounceRef = useRef(null);
  const changeOccuredRef = useRef(false);
  const initialLoad = useRef(true);
  const isSavingRef = useRef(false);

  // Bezpečná funkce pro uložení do DB (ruční / interní)
  const saveNow = useCallback(
    async (overrideData = null) => {
      const finalData = overrideData ?? data;
      const exportObject = convertFn(finalData);
      if (!clientId) return;
      if (typeof convertFn !== "function") return;
      if (typeof saveToDBFn !== "function") return;

      // Pokud už probíhá uložení, vyčkej
      if (isSavingRef.current) return;
      isSavingRef.current = true;

      try {
        // const exportObject = convertFn(data);

        const payload = {
          id_clients: clientId,
          id_branches: branchId,
          id_members: memberId,
          name,
          data: exportObject,
        };

        await saveToDBFn(payload);

        // uložit i do localStorage jako backup
        try {
          localStorage.setItem(clientId, JSON.stringify(exportObject));
        } catch (e) {
          // ignore localStorage errors
          console.warn("localStorage save failed", e);
        }

        // reset change flag
        changeOccuredRef.current = false;

        // aktualizuj headerClients (notSavedDetected -> false)
        if (typeof setHeaderClients === "function") {
          setHeaderClients((prev) =>
            prev.map((c) =>
              c.id === clientId ? { ...c, notSavedDetected: false } : c
            )
          );
        }
      } catch (err) {
        console.error("saveNow failed", err);
        throw err;
      } finally {
        isSavingRef.current = false;
      }
    },
    [
      clientId,
      branchId,
      memberId,
      name,
      data,
      convertFn,
      saveToDBFn,
      setHeaderClients,
    ]
  );

  // Debounce localStorage save — zapis do localStorage po pauze
  useEffect(() => {
    if (!clientId) return;
    // nikdy neprovádíme debounce při prvním mountu
    if (initialLoad.current) return;

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      changeOccuredRef.current = true;
      try {
        const exportObject =
          typeof convertFn === "function" ? convertFn(data) : data;
        localStorage.setItem(clientId, JSON.stringify(exportObject));
      } catch (e) {
        console.warn("localStorage debounce save failed", e);
      }
    }, debounceMs);

    return () => clearTimeout(debounceRef.current);
  }, [clientId, data, debounceMs, convertFn]);

  // Periodické autosave do DB — pouze pokud došlo ke změně a notSavedDetected je false
  useEffect(() => {
    if (!clientId) return;

    const interval = setInterval(async () => {
      if (!changeOccuredRef.current) return;

      const clientInfo = headerClients.find((c) => c.id === clientId);
      if (clientInfo?.notSavedDetected) return; // klient explicitně neuložen

      // pokud máme uložené data v localStorage, preferuj je
      const saved = localStorage.getItem(clientId);
      if (!saved) {
        // nic k uložení
        return;
      }

      try {
        // zavolat saveNow (který uloží i localStorage) — saveNow kontroluje přítomnost clientId
        await saveNow();
      } catch (err) {
        console.error("autosave interval failed", err);
      }
    }, autosaveIntervalMs);

    return () => clearInterval(interval);
  }, [clientId, headerClients, autosaveIntervalMs, saveNow]);

  // Označíme první render jako provedený
  useEffect(() => {
    initialLoad.current = false;
  }, []);

  return {
    saveNow,
    // pro případ potřeby expose dalších stavů / flagů v budoucnu
  };
}
