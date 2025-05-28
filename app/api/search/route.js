import { db } from "../../../lib/db";
import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

export async function POST(req) {
  try {
    const { title, userId } = await req.json();

    // 1. Check if webtoon exists
    const [rows] = await db.query(
      "SELECT title FROM webtoons WHERE title LIKE ? LIMIT 1",
      [`%${title}%`]
    );
    if (!rows.length) {
      return NextResponse.json({ message: "Webtoon not found" }, { status: 404 });
    }

    const selectedTitle = rows[0].title;

    // 2. Read or initialize user input file (simulating history)
    const inputFilePath = "user_input_history.txt";
    let history = [];
    if (fs.existsSync(inputFilePath)) {
      const lines = fs.readFileSync(inputFilePath, "utf-8").trim().split("\n");
      history = lines
        .filter((line) => line.startsWith(userId + ","))
        .map((line) => line.split(",")[1]);
    }

    if (!history.includes(selectedTitle)) {
      history.push(selectedTitle);
      fs.appendFileSync(inputFilePath, `${userId},${selectedTitle}\n`);
    }

    const lastThreeTitles = history.slice(-3).join("|");
    const modelScript = path.resolve("app/ml/run_model.py");

    return new Promise((resolve) => {
      const process = spawn("python", [modelScript, lastThreeTitles]);

      let output = "";
      process.stdout.on("data", (data) => {
        output += data.toString();
      });

      process.stderr.on("data", (data) => {
        console.error("Model stderr:", data.toString());
      });

      process.on("close", () => {
        try {
          const result = JSON.parse(output);
          resolve(NextResponse.json(result));
        } catch (e) {
          console.error("Parse error:", output);
          resolve(NextResponse.json({ message: "Invalid model output" }, { status: 500 }));
        }
      });
    });
  } catch (err) {
    console.error("Search route error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
