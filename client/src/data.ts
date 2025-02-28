export type Entry = {
  entryId?: number;
  title: string;
  notes: string;
  photoUrl: string;
};

type Data = {
  entries: Entry[];
  nextEntryId: number;
};

const dataKey = 'code-journal-data';

function readData(): Data {
  let data: Data;
  const localData = localStorage.getItem(dataKey);
  if (localData) {
    data = JSON.parse(localData) as Data;
  } else {
    data = {
      entries: [],
      nextEntryId: 1,
    };
  }
  return data;
}

function writeData(data: Data): void {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem(dataKey, dataJSON);
}

export async function readEntries(): Promise<Entry[]> {
  return readData().entries;
}

export async function readEntry(entryId: number): Promise<Entry | undefined> {
  return readData().entries.find((e) => e.entryId === entryId);
}

export async function addEntry(entry: Entry): Promise<Entry> {
  const data = readData();
  const newEntry = {
    ...entry,
    entryId: data.nextEntryId++,
  };
  data.entries.unshift(newEntry);
  writeData(data);
  return newEntry;
}

export async function updateEntry(entry: Entry): Promise<Entry> {
  const data = readData();
  const newEntries = data.entries.map((e) =>
    e.entryId === entry.entryId ? entry : e
  );
  data.entries = newEntries;
  writeData(data);
  return entry;
}

export async function removeEntry(entryId: number): Promise<void> {
  const data = readData();
  const updatedArray = data.entries.filter(
    (entry) => entry.entryId !== entryId
  );
  data.entries = updatedArray;
  writeData(data);
}
