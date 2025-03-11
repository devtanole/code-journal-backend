/* eslint-disable @typescript-eslint/no-unused-vars -- Remove me */
import 'dotenv/config';
import pg from 'pg';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import express from 'express';
import { ClientError, authMiddleware, errorMiddleware } from './lib/index.js';

type Entry = {
  entryId?: number;
  title: string;
  notes: string;
  photoUrl: string;
};

type Auth = {
  username: string;
  password: string;
};

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const hashkey = process.env.TOKEN_SECRET;
if (!hashkey) throw new Error('TOKEN_SECRET not found in .env');

const app = express();

app.use(express.json());

app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new ClientError(400, 'username and password are required fields');
    }
    const hashedPassword = await argon2.hash(password);
    const sql = `
    insert into "users" ("username", "hasedPassword")
    values ($1, $2)
    returning "userId", "username", "createdAt":
    `;
    const params = [username, hashedPassword];
    const result = await db.query<Auth>(sql, params);
    const newUser = result.rows[0];
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { username, password } = req.body as Partial<Auth>;
    if (!username || !password) {
      throw new ClientError(401, 'invald login');
    }
    const sql = `
select "userId",
        "hashedPassword"
from "users"
where "username" = $1;
`;
    const params = [username];
    const result = await db.query(sql, params);
    const user = result.rows[0];
    if (!user) {
      throw new ClientError(401, 'invalid login');
    }
    const isPasswordValid = await argon2.verify(user.hashedPassword, password);
    if (!isPasswordValid) {
      throw new ClientError(401, 'invalid login');
    }
    const payload = {
      userId: user.userId,
      username: user.username,
    };
    const newSignedToken = jwt.sign(payload, hashkey);
    res.status(200).json({
      user: payload,
      token: newSignedToken,
    });
  } catch (err) {
    next(err);
  }
});

app.get('/api/entries', authMiddleware, async (req, res, next) => {
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

app.get('/api/entries/:entryId', authMiddleware, async (req, res, next) => {
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

app.post('/api/entries', authMiddleware, async (req, res, next) => {
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

// app.put('/api/entries/:entryId', authMiddleware, async(req, res, next) => {
//   try{
//     const entryId = Number(req.params.entryId);
//     if (!Number.isInteger(entryId) || entryId < 1) {
//       throw new ClientError(400, 'entryId must be a positive integer');
//     }
//     const {}
//   }
// })

app.listen(process.env.PORT, () => {
  console.log(`express server listening on port ${process.env.PORT}`);
  console.log('code-journal-backend');
});
