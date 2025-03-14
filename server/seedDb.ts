import { db } from './server';
import argon2 from 'argon2';
import { type User } from './server';

export async function seedDb(): Promise<void> {
  const defaultUser = await db.query<User>(
    `select * from "users" where "username" = $1`,
    ['admin']
  );

  if (defaultUser.rows.length === 0) {
    const hashedPassword = await argon2.hash('dev');
    await db.query<User>(
      `insert into "users" ("username", "password")
      values ($1, $2) return *`,
      ['admin', hashedPassword]
    );
    console.log('Default user created');
  } else {
    console.log('Default user already exists');
  }
}
