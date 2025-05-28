"use client";
import React, { useState } from "react";
import "./login.css";
import { useUser } from "../context/userContext"; // context import

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUserId, setUsername: setCtxUsername } = useUser(); // context setter

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return setError("All fields are required.");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const text = await res.text();
      if (!res.ok) return setError(`Login failed: ${text}`);

      const data = JSON.parse(text);
      setUserId(data.userId);
      setCtxUsername(username);

      if (data.isNew) window.location.href = "/questionnaire";
      else window.location.href = "/homepage";

    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    }
  };

  return (
    <div className="container-form">
      <form onSubmit={handleSubmit}>
        <h3>Log In</h3>
        <label>Username</label><br />
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required /><br /><br />

        <label>Password</label><br />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br /><br />

        {error && <p style={{ color: "red" }}><b>{error}</b></p>}

        <input type="submit" value="Submit" className="submit-button" />
        <p>Don't have an account? <a href="/register">Sign up</a></p>
      </form>
    </div>
  );
}
