import { db } from "../../../lib/db"; // adjust path as needed
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = await req.json();

    // Dummy return while model not integrated yet
    const [rows] = await db.query(`
      SELECT * FROM webtoons 
      WHERE genre IN (
        SELECT genre FROM user_genres WHERE user_id = ?
      )
      ORDER BY rating DESC LIMIT 10
    `, [userId]);

    return NextResponse.json(rows);
  } catch (err) {
    console.error("Recommendation error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
