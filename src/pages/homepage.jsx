"use client"; // only if using App Router

import React from "react";
import "./homepage.css"; // Place homepage.css inside /app or /public and adjust path accordingly

export default function Homepage() {
  return (
    <div>
      {/* Header */}
      <header>
        <div className="container-header">
          {/* Web Name */}
          <h1 id="name">Webtoon Recommendation System</h1>
          <h4 id="tagline">Webtoon Recommendations Just For You!</h4>

          {/* Navbar */}
          <nav>
            <ul>
              <div className="topnav">
                <a className="active" href="#home">Home</a>
                <input type="text" placeholder="Search for recs.." />
              </div>
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
}
