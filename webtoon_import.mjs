// webtoon_import.js
import fs from 'fs';
import path from 'path';
import { db } from './lib/db.js';
import csv from 'csv-parser';

const filePath = './webtoon_originals_en.csv';

const insertWebtoon = async (webtoon) => {
  const query = `
    INSERT INTO webtoons 
    (title_id, title, genre, authors, weekdays, length, subscribers, rating, views, likes, status, daily_pass, synopsis)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    webtoon.title_id,
    webtoon.title,
    webtoon.genre,
    webtoon.authors,
    webtoon.weekdays,
    parseInt(webtoon.length),
    parseFloat(webtoon.subscribers),
    parseFloat(webtoon.rating),
    parseFloat(webtoon.views),
    parseFloat(webtoon.likes),
    webtoon.status,
    webtoon.daily_pass.toLowerCase() === 'true' ? 1 : 0,
    webtoon.synopsis
  ];

  try {
    await db.query(query, values);
  } catch (err) {
    console.error('Insert failed:', err.message);
  }
};

const importCSV = async () => {
  const results = [];
  fs.createReadStream(path.resolve(filePath))
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      for (const row of results) {
        await insertWebtoon(row);
      }
      console.log('✅ Import completed!');
      process.exit();
    });
};

importCSV();
