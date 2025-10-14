/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [myTheme, setMyTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  const toggleTheme = (theme) => {
    setMyTheme(theme);
    localStorage.setItem("theme", theme);
  };

  return (
    <>
      <ThemeContext.Provider value={{ myTheme, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    </>
  );
};
