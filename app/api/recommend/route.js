import { NextResponse } from "next/server";
import path from "path";
import { spawn } from "child_process";

export async function POST(req) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ message: "UserId required" }, { status: 400 });
    }

    const scriptPath = path.resolve("app/ml/run_model.py");

    return new Promise((resolve) => {
      const process = spawn("python", [scriptPath, String(userId)]);

      let output = "";
      process.stdout.on("data", (data) => {
        output += data.toString();
      });

      process.stderr.on("data", (data) => {
        console.error("PYTHON STDERR:", data.toString());
      });

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
