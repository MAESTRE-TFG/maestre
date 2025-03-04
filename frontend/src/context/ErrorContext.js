import { createContext, useState } from "react";

export const ErrorContext = createContext();

export const ErrorContextProvider = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState(null);

  const clearErrorMessage = () => {
    setErrorMessage(null);
  };

  return (
    <ErrorContext.Provider value={{ errorMessage, setErrorMessage, clearErrorMessage }}>
      {children}
    </ErrorContext.Provider>
  );
};
