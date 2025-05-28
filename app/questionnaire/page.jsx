"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "../../src/context/userContext";
import { useRouter } from "next/navigation";
import "./questionnaire.css";

const genres = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy",
  "Horror", "Slice of Life", "Romance", "Sci-Fi", "Thriller",
  "Superhero", "Historical", "Sports", "Supernatural", "Graphic Novel",
  "Informative", "Heartwarming"
];

export default function Questionnaire() {
  const router = useRouter();
  const { userId } = useUser();

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [userId, router]);

  const toggleGenre = (genre) => {
    setError(""); // reset error
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else if (selectedGenres.length < 3) {
      setSelectedGenres([...selectedGenres, genre]);
    } else {
      setError("You can only select 3 genres.");
    }
  };

  const handleContinue = async () => {
    if (selectedGenres.length !== 3) {
      setError("Please select exactly 3 genres.");
      return;
    }

    try {
      const res = await fetch("/api/user/genre", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, genres: selectedGenres }),
      });

      if (!res.ok) {
        const msg = await res.text();
        setError(`Server error: ${msg}`);
        return;
      }

      router.push("/homepage"); // ✅ smooth navigation
    } catch (err) {
      console.error("Genre submission failed:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  if (loading) return <div>Loading user context...</div>;

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

      {error && <p style={{ color: "red" }}>{error}</p>}

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
