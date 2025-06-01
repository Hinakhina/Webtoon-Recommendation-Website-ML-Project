"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; 
import { useUser } from "../../src/context/userContext";
import "./login.css";

export default function LoginPage() {
  const router = useRouter();
  const { setUserId, setUsername } = useUser();

  const [username, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Set context before navigation
      setUserId(data.userId);
      setUsername(data.username);

      console.log("Context set:", { userId: data.userId, username: data.username });

      // Navigate without full reload
      if (data.isNew) router.push("/questionnaire");
      else router.push("/homepage");

    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container-form">
      <form onSubmit={handleSubmit}>
        <h3>Login</h3>

        <label>Username</label><br />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsernameInput(e.target.value)}
          required
        /><br /><br />

        <label>Password</label><br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br /><br />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button className="submit-button" type="submit">Login</button>

        <p>Don’t have an account? <a href="/register">Register</a></p>
      </form>
    </div>
  );
}
