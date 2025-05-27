"use client";
import React, { useEffect, useState } from "react";
import "./questionnare.css";

const genreList = [
  "Action", "Romance", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Thriller",
  "Slice of Life", "Supernatural", "Sci-Fi", "Adventure", "Historical"
];

export default function Questionnare() {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const userId = 1; // You should dynamically store this after login

  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else if (selectedGenres.length < 3) {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleContinue = async () => {
    console.log("Selected Genres:", selectedGenres);
    const res = await fetch("/api/user/genre", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, genres: selectedGenres })
    });
    if (res.ok) window.location.href = "/homepage";
  };

  return (
    <div className="container">
      <h1>Pick Your Top 3 Favorite Genres</h1>
      <div className="genres" id="genres">
        {genreList.map((genre) => (
          <button
            key={genre}
            className={`genre-btn ${selectedGenres.includes(genre) ? "selected" : ""}`}
            onClick={() => toggleGenre(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
      <button id="submitBtn" onClick={handleContinue} disabled={selectedGenres.length !== 3}>
        Continue
      </button>
    </div>
  );
}
