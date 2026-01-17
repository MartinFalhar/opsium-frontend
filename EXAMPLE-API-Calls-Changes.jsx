// PŘÍKLAD ÚPRAVY API VOLÁNÍ VE VAŠICH KOMPONENTÁCH
// Tento soubor ukazuje, jak upravit fetch volání pro použití JWT tokenu

// ===========================================
// MOŽNOST 1: Použití helper funkce apiCall
// ===========================================

// Import helper funkce
import { apiCall } from '../utils/api';

// PŘÍKLAD: Načtení seznamu klientů
const loadClientsList = async () => {
  try {
    // id_branch už NEPOSÍLÁTE - backend si ho vezme z JWT tokenu!
    const clients = await apiCall("/client/clients_list", "POST");
    setClients(clients);
  } catch (error) {
    console.error("Error loading clients:", error);
  }
};

// PŘÍKLAD: Vytvoření nového klienta
const createNewClient = async (clientData) => {
  try {
    // id_branches se automaticky přidá na backendu z tokenu
    const result = await apiCall("/client/create_client", "POST", {
      name: clientData.name,
      surname: clientData.surname,
      birth_date: clientData.birth_date,
      // id_branches už NEPOSÍLÁTE!
    });
    console.log("Client created:", result);
  } catch (error) {
    console.error("Error creating client:", error);
  }
};

// PŘÍKLAD: Uložení vyšetření
const saveExam = async (examData) => {
  try {
    const result = await apiCall("/client/save_examination", "POST", {
      id_clients: examData.id_clients,
      id_members: examData.id_members,
      name: examData.name,
      data: examData.data,
      // id_branches už NEPOSÍLÁTE!
    });
    console.log("Examination saved:", result);
  } catch (error) {
    console.error("Error saving examination:", error);
  }
};

// PŘÍKLAD: Načtení služeb z katalogu
const loadServices = async () => {
  try {
    // Prázdné POST body - backend si id_branches vezme z tokenu
    const services = await apiCall("/agenda/services-search", "POST");
    setServices(services);
  } catch (error) {
    console.error("Error loading services:", error);
  }
};

// PŘÍKLAD: Aktualizace služby
const updateService = async (changedItem) => {
  try {
    const result = await apiCall("/agenda/services-update", "POST", {
      changedItem: {
        plu: changedItem.plu,
        name: changedItem.name,
        price: changedItem.price,
        // ... další pole
        // id_branch už NEPOSÍLÁTE!
      }
    });
    console.log("Service updated:", result);
  } catch (error) {
    console.error("Error updating service:", error);
  }
};

// PŘÍKLAD: Smazání služby
const deleteService = async (serviceId) => {
  try {
    const result = await apiCall("/agenda/services-delete", "POST", {
      id: serviceId,
      // id_branch už NEPOSÍLÁTE!
    });
    console.log("Service deleted:", result);
  } catch (error) {
    console.error("Error deleting service:", error);
  }
};

// ===========================================
// MOŽNOST 2: Ruční přidání Authorization headeru
// ===========================================

// Pokud nechcete používat helper funkci, můžete přidat header ručně:

const loadClientsManual = async () => {
  const token = localStorage.getItem("authToken");
  
  try {
    const response = await fetch(`${API_URL}/client/clients_list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // DŮLEŽITÉ: Formát "Bearer TOKEN"
      },
      body: JSON.stringify({
        // id_branch už NEPOSÍLÁTE!
      })
    });
    
    if (response.status === 401) {
      // Token vypršel, přesměrovat na login
      localStorage.removeItem("authToken");
      navigate("/login");
      return;
    }
    
    const clients = await response.json();
    setClients(clients);
  } catch (error) {
    console.error("Error loading clients:", error);
  }
};

// ===========================================
// CO JE POTŘEBA ZMĚNIT VE VAŠICH SOUBORECH
// ===========================================

/*
1. Login.jsx
   - Uložit token do localStorage po úspěšném přihlášení
   - Vymazat token při odhlášení

2. Všechny komponenty, které volají API endpointy s id_branch:
   - ODEBRAT id_branch z req.body
   - PŘIDAT Authorization header s tokenem
   - Doporučeno: Použít helper funkci apiCall

3. Soubory, které pravděpodobně budete muset upravit:
   - frontend/src/features/clients/*
   - frontend/src/features/agenda/*
   - frontend/src/features/catalog/*
   - frontend/src/features/cashdesk/*
   - Jakékoli další soubory, které posílají POST/GET požadavky s id_branch

4. Příklad hledání všech míst, kde se používá id_branch:
   - Vyhledejte v projektu: "id_branch"
   - Najděte všechna fetch volání
   - U každého přidejte Authorization header
   - Odeberte id_branch z body
*/
