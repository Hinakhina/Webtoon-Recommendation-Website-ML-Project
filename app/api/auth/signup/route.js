import { db } from '../../../../lib/db.js';
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, password, confirmPassword } = body;

    if (password !== confirmPassword) {
      return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
    }

    const [existing] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    if (existing.length > 0) {
      return NextResponse.json({ message: "Username already taken" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashed]
    );

    const userId = result.insertId;

    return NextResponse.json(
      {
        userId,
        username,
        isNew: true,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
