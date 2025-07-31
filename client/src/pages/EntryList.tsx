import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPencilAlt } from 'react-icons/fa';
import { Entry, readEntries } from '../lib/data';
import { useUser } from '../components/useUser';

export function EntryList() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();
  const { user } = useUser();

  useEffect(() => {
    async function load() {
      try {
        const entries = await readEntries();
        setEntries(entries);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (user) load();
  }, []);
  if (!user) return <div>Login to continue</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) {
    return (
      <div>
        Error Loading Entries:{' '}
        {error instanceof Error ? error.message : 'Unknown Error'}
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '1.5rem' }}>
      <div className="row">
        <div
          className="column-full  d-flex justify-between align-center"
          style={{ paddingBottom: '1rem' }}>
          <h1>Entries</h1>
          <h3>
            <Link to="/details/new" className="white-text form-link">
              NEW
            </Link>
          </h3>
        </div>
      </div>
      <div className="row">
        <div className="column-full">
          <ul className="entry-ul">
            {entries.map((entry) => (
              <EntryCard key={entry.entryId} entry={entry} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

type EntryProps = {
  entry: Entry;
};
function EntryCard({ entry }: EntryProps) {
  const displayDate = entry.createdAt
    ? new Date(entry.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Unknown date';

  return (
    <li className="mb-6">
      <div className="d-flex gap-6" style={{ alignItems: 'flex-start' }}>
        {/* Remove column-half padding and use fixed width on image container */}
        <div style={{ width: '40%', minWidth: '200px' }}>
          <img
            className="input-b-radius form-image"
            src={entry.photoUrl}
            alt="entry photo"
            style={{ width: '100%', objectFit: 'cover', borderRadius: '8px' }}
          />
        </div>
        <div style={{ width: '60%', paddingLeft: '1rem' }}>
          <div className="d-flex justify-between align-center mb-3">
            <h3 className="font-bold m-0">{entry.title}</h3>
            <Link to={`details/${entry.entryId}`} className="edit-link">
              <FaPencilAlt size={18} />
            </Link>
          </div>
          <p className="text-sm text-gray-400 mb-3">Date: {displayDate}</p>
          <p style={{ lineHeight: 1.5 }}>{entry.notes}</p>
        </div>
      </div>
    </li>
  );
}
