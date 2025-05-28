import { NextResponse } from "next/server";
import path from "path";
import { spawn } from "child_process";
import { db } from "../../../lib/db";

export async function POST(req) {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ message: "UserId required" }, { status: 400 });
    }

    // Ambil genre favorit user dari DB
    const [genreRows] = await db.query(
      "SELECT genre FROM user_genres WHERE user_id = ?",
      [userId]
    );

    if (!genreRows.length) {
      return NextResponse.json({ message: "No genres found for user" }, { status: 404 });
    }

    // Gabungkan genre jadi satu string (misal separator '*')
    const genres = genreRows.map(g => g.genre).join('*');

    // Panggil Python dengan argumen genre
    const scriptPath = path.resolve("app/ml/run_model.py");

    return new Promise((resolve) => {
      const process = spawn("python", [scriptPath, genres]);

      let output = "";
      process.stdout.on("data", (data) => output += data.toString());
      process.stderr.on("data", (data) => console.error("PYTHON STDERR:", data.toString()));

      process.on("close", () => {
        try {
          const parsed = JSON.parse(output);
          resolve(NextResponse.json(parsed));
        } catch (err) {
          console.error("Parse error:", output);
          resolve(NextResponse.json({ message: "Failed to parse Python output" }, { status: 500 }));
        }
      });
    });

  } catch (err) {
    console.error("Recommendation API error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
