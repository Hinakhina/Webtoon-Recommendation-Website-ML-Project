import { exec } from "child_process";
import path from "path";
import { NextResponse } from "next/server"; // For App Router

export async function POST(req) {
  const body = await req.json();
  const { userId } = body;

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const scriptPath = path.resolve("app/ml/run_model.py");
  const command = `python ${scriptPath} ${userId}`;

  return new Promise((resolve) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error("Python error:", stderr);
        return resolve(NextResponse.json({ error: "Python script error" }, { status: 500 }));
      }

      try {
        const parsed = JSON.parse(stdout);
        return resolve(NextResponse.json(parsed));
      } catch (e) {
        console.error("Failed to parse output:", stdout);
        return resolve(NextResponse.json({ error: "Invalid JSON from Python" }, { status: 500 }));
      }
    });
  });
}
