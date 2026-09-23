import { useEffect, useState } from 'react';
import Search from './components/Search';
import UserLayout from './components/UserLayout';
import { githubRequest } from './github';

export default function App() {
  const [search, setSearch] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!search) return;
    const controller = new AbortController();
    githubRequest(`/users/${encodeURIComponent(search.username)}`, controller.signal)
      .then(data => { if (!controller.signal.aborted) setUser(data); })
      .catch(error => { if (!controller.signal.aborted) setError(error.message || 'Unable to connect to GitHub.'); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [search]);

  function handleSearch(username) {
    setUser(null);
    setError('');
    setLoading(true);
    setSearch({ username });
  }

  return (
    <main className="relative flex min-h-screen flex-col justify-center bg-gray-50 py-6 sm:py-12">
      <div className="relative bg-white px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto md:max-w-6xl sm:max-w-lg sm:rounded-lg sm:px-10">
        <div className="space-y-6 py-8 text-base leading-7 text-gray-600">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">GitHub User Search</h1>
          <p>Find GitHub profiles and their public repositories.</p>
          <Search onSearch={handleSearch} />
          {loading && <p role="status">Loading profile…</p>}
          {error && <p role="alert" className="text-red-600 text-center">{error}</p>}
          {user && <UserLayout key={user.login} userData={user} />}
          {!search && <p>Enter a GitHub username to search.</p>}
        </div>
      </div>
    </main>
  );
}
