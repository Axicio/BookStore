import { useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";
import { ThemeContext } from "./theme-context.js";

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useLocalStorage(
    "bookstore:theme",
    "light",
    (v) => v === "light" || v === "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
  );
};
