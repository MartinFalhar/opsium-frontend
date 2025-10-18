import { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [headerClients, setHeaderClients] = useState([]);

  // Načtení uživatele z localStorage při startu aplikace
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Uložení uživatele do localStorage při změně
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <UserContext.Provider
      value={{ user, setUser, headerClients, setHeaderClients }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

export function useHeaderClients() {
  return useContext(UserContext);
}

export function useSetHeaderClients() {
  return useContext(UserContext);
}
