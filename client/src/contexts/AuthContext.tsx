import { createContext } from "react";

export interface UserType {
  name: string;
  phoneNumber: string | number;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserType | null;
  login: (user: UserType) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
