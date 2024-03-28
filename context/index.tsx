"use client";
import React, { createContext, useState, useContext, ReactNode } from "react";

interface MyContextType {
  isLoggedIn: boolean | null;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean | null>>; // Use React.Dispatch to set state

  signUp: boolean;
  setSignUp: React.Dispatch<React.SetStateAction<boolean>>;

  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;

  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;

  isMobile: boolean;
  setIsMobile: React.Dispatch<React.SetStateAction<boolean>>;
}

const MyContext = createContext<MyContextType | undefined>(undefined);

// Custom hook to access MyContext
export const useMyContext = () => {
  const context = useContext(MyContext);
  if (context === undefined) {
    throw new Error("useMyContext must be used within a MyProvider");
  }
  return context;
};

// Define MyProvider component to provide context value to children
export const MyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [signUp, setSignUp] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  return (
    <MyContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        signUp,
        setSignUp,
        userName,
        setUserName,
        isLoading,
        setIsLoading,
        isMobile,
        setIsMobile,
      }}
    >
      {children} {/* Render children wrapped with context */}
    </MyContext.Provider>
  );
};

export { MyContext };
