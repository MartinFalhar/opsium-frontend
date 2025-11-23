import { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [headerClients, setHeaderClients] = useState([]);
  const [members, setMembers] = useState([]);
  const [activeId, setActiveId] = useState({
    id_member: null,
    id_client: null,
  });

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
      value={{
        user,
        setUser,
        headerClients,
        setHeaderClients,
        members,
        setMembers,
        activeId,
        setActiveId,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
