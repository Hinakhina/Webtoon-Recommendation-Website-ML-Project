import { db } from '../../db/db.js';

export default async function handler(req, res) {
  const { userId, genres } = req.body;
  await Promise.all(genres.map(genre =>
    db.query("INSERT INTO user_genres (user_id, genre) VALUES (?, ?)", [userId, genre])
  ));

  await db.query("UPDATE users SET is_new = FALSE WHERE id = ?", [userId]);
  res.status(200).json({ message: 'Genres saved' });
}
