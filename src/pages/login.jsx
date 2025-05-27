"use client"; // only if you're using App Router

import React, { useState } from "react";
import "./login.css"; // adjust path if using /public/css/login.css

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validatePassword = (pass) => {
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasDigit = /[0-9]/.test(pass);
    return pass.length >= 8 && hasUpper && hasLower && hasDigit;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username) {
      setError("E-mail must be filled.");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password doesn't meet the requirements. Please try again.");
      return;
    }

    setError("");
    console.log("Username:", username);
    console.log("Password:", password);

    // Redirect to questionnaire (adjust path if using routing)
    window.location.href = "/questionnare";
  };

  return (
    <div className="container-form">
      <form id="form" onSubmit={handleSubmit}>
        <h3>Log In</h3>

        <label htmlFor="username">Username</label>
        <br />
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br /><br />

        <label htmlFor="password">Password</label>
        <br />
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br /><br />

        <div id="message">
          <p><b>Password must contain:</b></p>
          <ul>
            <li className={password.length >= 8 ? "valid" : "invalid"}>Min. 8 characters</li>
            <li className={/[A-Z]/.test(password) && /[a-z]/.test(password) ? "valid" : "invalid"}>Uppercase and lowercase</li>
            <li className={/[0-9]/.test(password) ? "valid" : "invalid"}>Min. 1 digit</li>
          </ul>
        </div>

        {error && <p id="error" style={{ color: "red" }}><b>{error}</b></p>}

        <input type="submit" value="Submit" className="submit-button" />

        <p id="register">
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </form>
    </div>
  );
}
