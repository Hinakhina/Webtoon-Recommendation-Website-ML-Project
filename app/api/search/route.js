import { db } from "../../../lib/db";
import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

export async function POST(req) {
  try {
    const { title, userId } = await req.json();

    // 1. Check title exists in webtoons
    const [rows] = await db.query(
      "SELECT title FROM webtoons WHERE title LIKE ? LIMIT 1",
      [`%${title}%`]
    );
    if (!rows.length) {
      return NextResponse.json({ message: "Webtoon not found" }, { status: 404 });
    }

    const selectedTitle = rows[0].title;

    // 2. Insert into search_history table
    await db.query(
      "INSERT INTO search_history (user_id, title) VALUES (?, ?)",
      [userId, selectedTitle]
    );

    // 3. Get last 3 titles from DB
    const [historyRows] = await db.query(
      "SELECT title FROM search_history WHERE user_id = ? ORDER BY searched_at DESC LIMIT 3",
      [userId]
    );

    const lastThreeTitles = historyRows.map(row => row.title).join("|");

    // 4. Run Python model with last three titles
    const modelPath = path.resolve("app/ml/run_model.py");

    return new Promise((resolve) => {
      const process = spawn("python", [modelPath, lastThreeTitles]);

      let output = "";
      process.stdout.on("data", (data) => output += data.toString());
      process.stderr.on("data", (data) => console.error("Model stderr:", data.toString()));

      process.on("close", () => {
        try {
          const json = JSON.parse(output);
          resolve(NextResponse.json(json));
        } catch (err) {
          console.error("Parse error:", output);
          resolve(NextResponse.json({ message: "Invalid model output" }, { status: 500 }));
        }
      });
    });
  } catch (err) {
    console.error("Search API error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
