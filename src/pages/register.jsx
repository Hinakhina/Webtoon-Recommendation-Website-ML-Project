"use client";
import React, { useState } from "react";
import "./register.css";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const validatePassword = (pass) => /[A-Z]/.test(pass) && /[a-z]/.test(pass) && /\d/.test(pass) && pass.length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) return setError("E-mail must be filled.");
    if (!validatePassword(password)) return setError("Password doesn't meet the requirements.");
    if (password !== confirmPassword) return setError("Passwords do not match");

    const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, confirmPassword })
    });

    if (!res.ok) {
        const errorText = await res.text();
        return setError("Signup failed: " + errorText);
    }

    const data = await res.json();
    window.location.href = "/questionnaire";
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