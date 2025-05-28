import { db } from '../../../../lib/db.js';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, password, confirmPassword } = body;

    if (password !== confirmPassword) {
      return NextResponse.json({ message: 'Passwords do not match' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    // DEBUG connection before real insert
    await db.query("SELECT 1");

    const [result] = await db.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashed]
    );

    const userId = result.insertId;

    return NextResponse.json({ userId, username, isNew: true }, { status: 200 });

  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
