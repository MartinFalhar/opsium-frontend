import { useCallback, useEffect, useMemo, useState } from "react";
import { apiCall } from "../utils/api";

export function useOrdersGetList({
  search = "",
  daysOld = null,
  status = "",
  clientId = null,
} = {}) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiCall("/store/orders-list", "POST");

      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        const errorMsg = data?.message || "Nepodarilo se nacist zakazky.";
        setError(errorMsg);
        setOrders([]);
        console.error("Chyba pri nacitani zakazek:", errorMsg);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      const errorMsg = "Nepodarilo se nacist zakazky.";
      setError(errorMsg);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filteredOrders = useMemo(() => {
    let next = orders;

    if (search && search.trim()) {
      const needle = search.trim().toLowerCase();
      next = next.filter((order) => {
        const haystack = [
          order?.id,
          order?.name,
          order?.surname,
          order?.status,
          order?.note,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(needle);
      });
    }

    if (daysOld !== null && daysOld !== "") {
      const maxDays = Number(daysOld);
      if (!Number.isNaN(maxDays)) {
        const cutoff = Date.now() - maxDays * 24 * 60 * 60 * 1000;
        next = next.filter((order) => {
          const createdAt = new Date(order?.created_at).getTime();
          return Number.isNaN(createdAt) ? false : createdAt >= cutoff;
        });
      }
    }

    if (status) {
      const normalizedStatus = String(status).toLowerCase();
      next = next.filter(
        (order) =>
          String(order?.status ?? "").toLowerCase() === normalizedStatus,
      );
    }

    if (clientId !== null && clientId !== "") {
      const clientIdNumber = Number(clientId);
      if (!Number.isNaN(clientIdNumber)) {
        next = next.filter(
          (order) => Number(order?.client_id) === clientIdNumber,
        );
      }
    }

    return next;
  }, [orders, search, daysOld, status, clientId]);

  return { orders: filteredOrders, loading, error, refresh };
}
