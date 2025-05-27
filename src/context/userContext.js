"use client";
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);

  // Restore from localStorage if exists
  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    const storedUsername = localStorage.getItem("username");
    if (storedId) setUserId(Number(storedId));
    if (storedUsername) setUsername(storedUsername);
  }, []);

  useEffect(() => {
    if (userId !== null) localStorage.setItem("userId", userId);
    if (username !== null) localStorage.setItem("username", username);
  }, [userId, username]);

  return (
    <UserContext.Provider value={{ userId, setUserId, username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}