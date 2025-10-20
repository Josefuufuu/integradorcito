import { createContext, useContext, useState, useEffect } from "react";

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      const response = await Promise.resolve("Administrador"); // mock
      setRole(response);
    };

    fetchUserRole();
  }, []);

  return (
    <RoleContext.Provider value={role}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);