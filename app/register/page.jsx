"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Next.js router
import { useUser } from "../../src/context/userContext";
import "./register.css";

export default function RegisterPage() {
  const router = useRouter();
  const { setUserId, setUsername } = useUser();

  const [username, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, confirmPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      // ✅ Set context before navigation
      setUserId(data.userId);
      setUsername(data.username);

      console.log("✅ Context set after register:", { userId: data.userId, username: data.username });

      router.push("/questionnaire"); // ✅ Navigate to questionnaire page
    } catch (err) {
      console.error("Signup error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container-form">
      <form onSubmit={handleSubmit}>
        <h3>Register</h3>

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

        <label>Confirm Password</label><br />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        /><br /><br />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button className="submit-button" type="submit">Register</button>

        <p>Already have an account? <a href="/login">Log In</a></p>
      </form>
    </div>
  );
}
