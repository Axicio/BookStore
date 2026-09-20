import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { AuthContext } from "./auth-context.js";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage(
    "bookstore:user",
    null,
    (v) => v === null || (typeof v === "object" && typeof v.id === "string")
  );

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);
  const updateUser = (updates) => setUser((prev) => (prev ? { ...prev, ...updates } : prev));

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
