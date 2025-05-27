"use client"; // required for App Router

import React, { useState } from "react";
import "./register.css"; // or '/css/register.css' if inside public folder

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    if (!confirmPassword || password !== confirmPassword) {
      setError("Confirm Password doesn't match. Please try again");
      return;
    }

    setError("");
    console.log("Username:", username);
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);

    // Redirect to questionnaire page
    window.location.href = "/questionnare"; // adjust path if needed
  };

  return (
    <div className="container-form">
      <form onSubmit={handleSubmit} id="form">
        <h3>Register</h3>

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
            <li className={password.length >= 8 ? "valid" : "invalid"}>Min. 8 characters;</li>
            <li className={/[A-Z]/.test(password) && /[a-z]/.test(password) ? "valid" : "invalid"}>
              Uppercase and lowercase;
            </li>
            <li className={/[0-9]/.test(password) ? "valid" : "invalid"}>Min. 1 digit.</li>
          </ul>
        </div>

        <label htmlFor="confirm-password">Confirm Password</label>
        <br />
        <input
          type="password"
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <br /><br />

        {error && <p id="error" style={{ color: "red" }}><b>{error}</b></p>}

        <input type="submit" value="Submit" className="submit-button" />

        <p id="login">
          Already have an account? <a href="/login">Log In</a>
        </p>
      </form>
    </div>
  );
}
