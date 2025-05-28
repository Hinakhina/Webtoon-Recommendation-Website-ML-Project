"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "../context/userContext";
import "./homepage.css";

export default function Homepage() {
  const { userId, username } = useUser();
  const [recommendedWebtoons, setRecommendedWebtoons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchRecommendations = async () => {
      try {
        // fetch user's genre-based favorites from backend or call .py model
        const res = await fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId })
        });
        const data = await res.json();
        setRecommendedWebtoons(data);
      } catch (err) {
        console.error("Failed to fetch recommendations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId]);

  return (
    <div>
      <header>
        <div className="container-header">
          <h1 id="name">Webtoon Recommendation System</h1>
          <h4 id="tagline">Webtoon Recommendations Just For You, {username || "Guest"}!</h4>

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

      <div className="recommendation-section">
        <h2>Recommended Webtoons</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="results-grid">
            {recommendedWebtoons.map((webtoon, i) => (
              <div key={i} className="webtoon-card">
                <h3>{webtoon.title}</h3>
                <p><strong>Genre:</strong> {webtoon.genre}</p>
                <p><strong>Author(s):</strong> {webtoon.authors}</p>
                <p><strong>Rating:</strong> {webtoon.rating}</p>
                <p><strong>Synopsis:</strong> {webtoon.synopsis}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
