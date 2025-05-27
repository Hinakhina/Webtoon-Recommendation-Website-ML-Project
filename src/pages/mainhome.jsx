"use client"; // only needed for App Router

import React from "react";
import "./mainHome.css"; // or '/css/mainHome.css' if it's in /public

export default function MainHome() {
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
                <a className="active" href="/homepage">Home</a>
                <a className="login" href="/login">Log In</a>
                <a className="register" href="/signup">Register</a>
                {/* <input type="text" placeholder="Search for recs.." className="search" /> */}
              </div>
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
}
