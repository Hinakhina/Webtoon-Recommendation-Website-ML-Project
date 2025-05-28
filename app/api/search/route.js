import { NextResponse } from "next/server";
import path from "path";
import { spawn } from "child_process";
import { db } from "../../../lib/db";  // pastikan path benar sesuai struktur project

export async function POST(req) {
  try {
    const { title, userId } = await req.json();

    if (!title && !userId) {
      return NextResponse.json({ message: "Title or userId required" }, { status: 400 });
    }

    // Simpan setiap judul input user ke tabel search_history
    if (userId && title) {
      const inputTitles = title.split('*').map(t => t.trim()).filter(Boolean);

      // Insert satu per satu judul ke history, bisa pake Promise.all untuk parallel
      await Promise.all(
        inputTitles.map(async (t) => {
          if (t) {
            await db.query(
              "INSERT INTO search_history (user_id, title, searched_at) VALUES (?, ?, NOW())",
              [userId, t]
            ).catch(err => {
              console.error("Failed to insert search_history for title:", t, err);
              // Jangan throw, supaya proses tetap jalan meski ada error insert
            });
          }
        })
      );
    }

    // Ambil histori 3 judul terakhir dari search_history untuk userId jika ada
    let historyTitles = [];
    if (userId) {
      const [rows] = await db.query(
        "SELECT title FROM search_history WHERE user_id = ? ORDER BY searched_at DESC LIMIT 3",
        [userId]
      );
      historyTitles = rows.map(r => r.title);
      console.log("The history titles are" , historyTitles)
    }

    // Gabungkan input judul (bisa dipisah '*' jadi array) dan history
    let inputTitles = [];
    if (title) {
      inputTitles = title.split('*').map(t => t.trim()).filter(Boolean);
    }
    const combinedTitles = [...new Set([...inputTitles, ...historyTitles])];  // remove duplicates

    if (combinedTitles.length === 0) {
      return NextResponse.json({ message: "No titles to search" }, { status: 400 });
    }

    const scriptPath = path.resolve("app/ml/run_model.py");

    return new Promise((resolve) => {
      const process = spawn("python", [scriptPath, combinedTitles.join('*')]);

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
    console.error("Search API error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
