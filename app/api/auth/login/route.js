// app/api/auth/login/route.js
import { db } from '../../../../lib/db.js';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.json();
  const { username, password } = body;

  const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
  if (!rows.length) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  const user = rows[0];
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  return NextResponse.json({ userId: user.id, isNew: user.is_new }, { status: 200 });
}
