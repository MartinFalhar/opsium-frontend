// PŘÍKLAD ÚPRAVY Login.jsx
// Tento soubor ukazuje, jak upravit přihlašování pro ukládání JWT tokenu

// ZMĚNA 1: Po úspěšném přihlášení uložit token
// Najděte místo v kódu, kde zpracováváte odpověď z /login endpointu
// a upravte ho takto:

const handleLogin = async (e) => {
  e.preventDefault();
  
  try {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    
    if (res.ok) {
      // NOVÉ: Uložit JWT token do localStorage
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        console.log("JWT token byl uložen");
      }
      
      // Uložit uživatelská data (bez tokenu)
      const userData = { ...data };
      delete userData.token; // Token není potřeba ve user objektu
      
      await setUser(userData);
      
      // Zkontrolujeme, jestli se uložil do localStorage
      console.log(
        "Co je v localStorage po přihlášení USER:",
        JSON.parse(localStorage.getItem("user"))
      );
      console.log(
        "JWT token v localStorage:",
        localStorage.getItem("authToken")
      );

      // Načíst ostatní data
      await loadMembers(userData.id);
      await loadOrganizationInfo(userData.id_organizations);
      await loadBranchInfo(userData.id);

      navigate("/dashboard");
    } else {
      setError(data.message || "Přihlášení selhalo");
    }
  } catch (err) {
    console.error("Fetch error:", err);
    setError("Nepodařilo se načíst data.");
  }
};

// ZMĚNA 2: Při odhlášení vymazat token
const handleLogout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  setUser(null);
  navigate("/login");
};

// ZMĚNA 3: Při kontrole, jestli je uživatel přihlášen (useEffect)
useEffect(() => {
  const token = localStorage.getItem("authToken");
  const storedUser = localStorage.getItem("user");
  
  if (token && storedUser) {
    // Uživatel je přihlášen
    setUser(JSON.parse(storedUser));
  } else {
    // Uživatel není přihlášen nebo token vypršel
    navigate("/login");
  }
}, []);
