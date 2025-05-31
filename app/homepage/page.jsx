"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "../../src/context/userContext";
import { useRouter } from "next/navigation";
import "./homepage.css";

export default function Homepage() {
  const router = useRouter();
  const { userId, username } = useUser();

  const [recommendedWebtoons, setRecommendedWebtoons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (!userId) {
      router.push("/login");
      return;
    }

    const fetchRecommendations = async () => {
      try {
        const res = await fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        const data = await res.json();

        if (!Array.isArray(data)) {
          setError(data.message || "Unexpected response from model.");
          return;
        }

        setRecommendedWebtoons(data);
      } catch (err) {
        console.error("Recommendation fetch error:", err);
        setError("Failed to fetch recommendations.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId, router]);

  const handleSearch = async () => {
    if (!searchInput.trim()) return;

    setSearchLoading(true);
    setError("");

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: searchInput, userId }),
      });

      const data = await res.json();

      if (res.status === 404) {
        setError("No matching titles found in our database.");
        return;
      }

      if (!res.ok || !Array.isArray(data)) {
        setError(data.message || "Webtoon not found.");
        return;
      }

      setRecommendedWebtoons(data);
    } catch (err) {
      console.error("Search error:", err);
      setError("Search failed. Please try again.");
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div>
      <header>
        <div className="container-header">
          <h1 id="name">Webtoon Recommendation System</h1>
          <h4 id="tagline">
            Webtoon Recommendations Just For You, {username || "Guest"}!
          </h4>

          <nav>
            <div className="topnav">
              <input
                className="search-button"
                type="text"
                placeholder="Search webtoon title..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button onClick={handleSearch} disabled={searchLoading}>
                🔍
              </button>
            </div>
          </nav>
        </div>
      </header>

      <div className="recommendation-section">
        <h2>Recommended Webtoons</h2>

        {loading || searchLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : recommendedWebtoons.length === 0 ? (
          <p>No recommendations found.</p>
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
