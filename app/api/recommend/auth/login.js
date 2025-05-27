import { db } from '../../db/db.js';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  const { username, password } = req.body;
  const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
  if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, rows[0].password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  res.status(200).json({ userId: rows[0].id, isNew: rows[0].is_new });
}
