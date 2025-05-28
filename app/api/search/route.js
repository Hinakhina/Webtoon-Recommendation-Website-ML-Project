// app/api/search/route.js
import { NextResponse } from "next/server";
import path from "path";
import { spawn } from "child_process";

export async function POST(req) {
  const { title } = await req.json();
  if (!title) {
    return NextResponse.json({ message: "Title is required" }, { status: 400 });
  }

  const scriptPath = path.resolve("./ml/run_model.py");

  return new Promise((resolve) => {
    const process = spawn("python", [scriptPath, title]);

    let output = "";
    process.stdout.on("data", (data) => output += data.toString());
    process.stderr.on("data", (data) => console.error("PYTHON STDERR:", data.toString()));

    process.on("close", () => {
      try {
        const parsed = JSON.parse(output);
        return resolve(NextResponse.json(parsed));
      } catch (err) {
        console.error("Parse error:", output);
        return resolve(NextResponse.json({ message: "Failed to parse Python output" }, { status: 500 }));
      }
    });
  });
}
