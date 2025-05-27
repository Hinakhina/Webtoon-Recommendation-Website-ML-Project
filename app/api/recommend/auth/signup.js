import { db } from '../../db/db.js';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  const { username, password, confirmPassword } = req.body;
  if (password !== confirmPassword) return res.status(400).json({ message: 'Passwords do not match' });

  const hashed = await bcrypt.hash(password, 10);
  await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashed]);

  res.status(200).json({ message: 'User registered' });
}
