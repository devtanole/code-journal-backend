export type Entry = {
  entryId?: number;
  title: string;
  notes: string;
  photoUrl: string;
};

import { User } from '../components/UserContext';

const authKey = 'um.auth';

type Auth = {
  user: User;
  token: string;
};

export function saveAuth(user: User, token: string): void {
  const auth: Auth = { user, token };
  localStorage.setItem(authKey, JSON.stringify(auth));
}

export function removeAuth(): void {
  localStorage.removeItem(authKey);
}

export function readUser(): User | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).user;
}

export function readToken(): string | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).token;
}

export async function readEntries(): Promise<Entry[]> {
  const token = readToken();
  const req = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await fetch('/api/entries', req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return (await res.json()) as Entry[];
}

export async function readEntry(entryId: number): Promise<Entry | undefined> {
  const token = readToken();
  const req = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await fetch(`/api/entries/${entryId}`, req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return (await res.json()) as Entry;
}

export async function addEntry(entry: Entry): Promise<Entry> {
  const token = readToken();
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(entry),
  };
  const res = await fetch('/api/entries', req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return (await res.json()) as Entry;
}

export async function updateEntry(entry: Entry): Promise<Entry> {
  const token = readToken();
  const req = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(entry),
  };
  const res = await fetch(`/api/entries/${entry.entryId}`, req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return (await res.json()) as Entry;
}

export async function removeEntry(entryId: number): Promise<void> {
  const token = readToken();
  const req = {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const res = await fetch(`/api/entries/${entryId}`, req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
}
