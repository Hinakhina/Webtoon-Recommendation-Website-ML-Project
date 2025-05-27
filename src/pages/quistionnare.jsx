"use client"; // needed if you're using the App Router

import React, { useEffect, useState } from "react";
import "./questionnare.css"; // adjust path as needed

const genreList = [
  "Action", "Romance", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Thriller",
  "Slice of Life", "Supernatural", "Sci-Fi", "Adventure", "Historical"
];

export default function Questionnare() {
  const [selectedGenres, setSelectedGenres] = useState([]);

  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else if (selectedGenres.length < 3) {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleContinue = () => {
    console.log("Selected Genres:", selectedGenres);
    // You could POST to /api/user/genre here with userId if needed
    window.location.href = "/homepage"; // or wherever the main page is
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
      <button
        id="submitBtn"
        disabled={selectedGenres.length !== 3}
        onClick={handleContinue}
      >
        Continue
      </button>
    </div>
  );
}
