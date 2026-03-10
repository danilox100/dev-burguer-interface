import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);

  const putUserData = (user) => {
    if (!user) return;

    setUserInfo(user);
    localStorage.setItem("devburguer:userData", JSON.stringify(user));
  };

  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem("devburguer:userData");
    localStorage.removeItem("token");
  };

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("devburguer:userData");

      if (storedUser && storedUser !== "undefined") {
        const parsedUser = JSON.parse(storedUser);
        setUserInfo(parsedUser);
      }
    } catch (error) {
      console.log("Erro ao carregar usuário:", error);
      localStorage.removeItem("devburguer:userData");
    }
  }, []);

  return (
    <UserContext.Provider value={{ userInfo, putUserData, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser deve ser usado dentro de um UserProvider");
  }

  return context;
};