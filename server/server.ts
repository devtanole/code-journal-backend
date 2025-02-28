/* eslint-disable @typescript-eslint/no-unused-vars -- Remove me */
import 'dotenv/config';
import pg from 'pg';
import express from 'express';
import { ClientError, authMiddleware, errorMiddleware } from './lib/index.js';

type Entry = {
  entryId?: number;
  title: string;
  notes: string;
  photoUrl: string;
};

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();

app.use(express.json());

app.get('/api/entries', async (req, res, next) => {
  try {
    const sql = `
    select * from "entries";
    `;
    const result = await db.query(sql);
    const total = result.rows;
    if (!total) {
      throw new ClientError(404, `entries not found`);
    }
    res.json(total);
  } catch (err) {
    next(err);
  }
});

app.get('/api/entries/:entryId', async (req, res, next) => {
  try {
    const { entryId } = req.params;
    if (entryId === undefined) {
      throw new ClientError(400, `entryId required`);
    }
    const sql = `
    select * from "entries"
    where "entryId" = $1;
    `;
    const params = [entryId];
    const result = await db.query<Entry>(sql, params);
    const entry = result.rows[0];
    if (!entry) {
      throw new ClientError(404, `entry ${entryId} not found`);
    }
    res.json(entry);
  } catch (err) {
    next(err);
  }
});

app.post('/api/entries', async (req, res, next) => {
  try {
    const { title, notes, photoUrl } = req.body;
    if (!title || !notes || !photoUrl) {
      throw new ClientError(400, `title, notes and photoURL are required`);
    }
    const sql = `
    insert into "entries" ("title", "notes", "photoUrl")
    values ($1, $2, $3)
    returning *;
    `;
    const params = [title, notes, photoUrl];
    const result = await db.query(sql, params);
    const entry = result.rows[0];
    res.status(201).json(entry);
  } catch (err) {
    next(err);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`express server listening on port ${process.env.PORT}`);
  console.log('code-journal-backend');
});
