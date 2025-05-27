"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import "./questionnare.css";

const genres = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy", 
  "Horror", "Slice of Life", "Romance", "Sci-Fi", "Thriller", 
  "Superhero", "Historical", "Sports", "Supernatural", "Graphic Novel",
  "Informative", "Heartwarming"
];

export default function Questionnare() {
  const { userId } = useUser();
  const [selectedGenres, setSelectedGenres] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("selectedGenres");
    if (saved) setSelectedGenres(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedGenres", JSON.stringify(selectedGenres));
  }, [selectedGenres]);

  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else if (selectedGenres.length < 3) {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleContinue = async () => {
    const res = await fetch("/api/user/genre", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, genres: selectedGenres })
    });
    if (res.ok) {
      localStorage.removeItem("selectedGenres");
      window.location.href = "/homepage";
    }
  };

  return (
    <div className="container">
      <h1>Pick Your Top 3 Favorite Genres</h1>
      <div className="genres">
        {genres.map((genre) => (
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
        className={selectedGenres.length === 3 ? "active" : ""}
        disabled={selectedGenres.length !== 3}
        onClick={handleContinue}
      >
        Continue
      </button>
    </div>
  );
}
