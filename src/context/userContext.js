"use client";
import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);

  return (
    <UserContext.Provider value={{ userId, setUserId, username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
