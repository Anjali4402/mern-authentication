import { useState } from "react";
import type { PropsWithChildren } from "react";
import AuthContext from "./AuthContext";

function AuthProvider({ children }: PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [user, setUser] = useState(null);

  const login = (user) => {
    console.log("user login");
  };

  const logout = () => {
    console.log("user logout");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
