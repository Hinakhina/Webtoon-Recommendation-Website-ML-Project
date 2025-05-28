// app/api/user/genre/route.js
import { db } from "../../../../lib/db"; // ✅ Adjust this path based on your setup

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, genres } = body;

    console.log("📦 Received:", { userId, genres });

    if (!userId || !Array.isArray(genres) || genres.length !== 3) {
      return new Response(JSON.stringify({ message: "Invalid input" }), { status: 400 });
    }

    for (const genre of genres) {
      await db.query("INSERT INTO user_genres (user_id, genre) VALUES (?, ?)", [userId, genre]);
    }

    // Mark the user as no longer new (optional logic)
    await db.query("UPDATE users SET is_new = FALSE WHERE id = ?", [userId]);

    return new Response(JSON.stringify({ message: "Genres saved" }), { status: 200 });
  } catch (err) {
    console.error("Genre insert error:", err);
    return new Response(JSON.stringify({ message: "Server error" }), { status: 500 });
  }
}
