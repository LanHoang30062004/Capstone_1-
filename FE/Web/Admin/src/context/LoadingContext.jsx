import { createContext, useState } from "react";

export const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const toggleLoading = (value) => {
    setLoading(value);
  };

  return (
    <LoadingContext.Provider value={{ loading, toggleLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};
