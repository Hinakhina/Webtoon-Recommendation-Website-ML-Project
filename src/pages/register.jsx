"use client";
import React, { useState } from "react";
import "./register.css";
import { useUser } from "../context/userContext"; // context import

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { setUserId, setUsername: setCtxUsername } = useUser(); // context setter

  const validatePassword = (pass) =>
    /[A-Z]/.test(pass) && /[a-z]/.test(pass) && /\d/.test(pass) && pass.length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) return setError("Username must be filled.");
    if (!validatePassword(password)) return setError("Password must be at least 8 characters, including uppercase, lowercase, and number.");
    if (password !== confirmPassword) return setError("Passwords do not match");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, confirmPassword })
      });

      const text = await res.text();
      if (!res.ok) return setError("Signup failed: " + text);

      const data = JSON.parse(text);
      setUserId(data.userId);
      setCtxUsername(username);

      window.location.href = "/questionnaire";

    } catch (err) {
      setError("An error occurred during signup.");
      console.error(err);
    }
  };

  return (
    <div className="container-form">
      <form onSubmit={handleSubmit}>
        <h3>Register</h3>
        <label>Username</label><br />
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required /><br /><br />

        <label>Password</label><br />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br /><br />

        <label>Confirm Password</label><br />
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /><br /><br />

        {error && <p style={{ color: "red" }}><b>{error}</b></p>}

        <input type="submit" value="Submit" className="submit-button" />
        <p>Already have an account? <a href="/login">Log In</a></p>
      </form>
    </div>
  );
}
