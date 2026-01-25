// src/utils/api.js
// Helper funkce pro API volání s automatickým přidáním JWT tokenu

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Provede API volání s automatickým přidáním JWT tokenu do Authorization headeru
 * @param {string} endpoint - API endpoint (např. "/client/clients_list")
 * @param {string} method - HTTP metoda (GET, POST, PUT, DELETE)
 * @param {object} body - Data k odeslání (pro POST/PUT)
 * @returns {Promise} - Promise s odpovědí z API
 */
export async function apiCall(endpoint, method = "GET", body = null) {
  const token = localStorage.getItem("authToken");
  
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      // Přidáme Authorization header, pokud máme token
      ...(token && { "Authorization": `Bearer ${token}` })
    }
  };
  
  // Pokud máme data k odeslání, přidáme je do body
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    
    // Pokud je token neplatný nebo vypršel (401), odhlásíme uživatele
    if (response.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
      throw new Error("Session expired - please login again");
    }
    
    // Pokud server vrátil chybu, vyhodíme ji
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "API request failed");
    }
    
    return response.json();
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
}

/**
 * Příklady použití:
 * 
 * // GET request
 * const vatRates = await apiCall("/agenda/vat/current", "GET");
 * 
 * // POST request bez dalších dat (branches_id se vezme z tokenu)
 * const clients = await apiCall("/client/clients_list", "POST");
 * 
 * // POST request s daty
 * const newClient = await apiCall("/client/create_client", "POST", {
 *   name: "Jan",
 *   surname: "Novák",
 *   birth_date: "1990-01-01"
 * });
 * 
 * // POST s více daty (branches_id už NEMUSÍTE posílat!)
 * const exam = await apiCall("/client/save_examination", "POST", {
 *   client_id: 123,
 *   member_id: 456,
 *   name: "Vyšetření 2024",
 *   data: { ... }
 * });
 */
