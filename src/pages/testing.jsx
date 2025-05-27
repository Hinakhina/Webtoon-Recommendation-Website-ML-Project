"use client";
import React, { useState } from "react";
import "./login.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) return setError("All fields are required.");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (res.ok) {
      if (data.isNew) window.location.href = "/questionnare";
      else window.location.href = "/homepage";
    } else {
      setError(data.message);
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
        <p>Don't have an account? <a href="/signup">Sign up</a></p>
      </form>
    </div>
  );
}