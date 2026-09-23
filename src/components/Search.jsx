import { useState } from 'react';

export default function Search({ onSearch }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  function submit(event) {
    event.preventDefault();
    const username = input.trim();
    if (!/^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(username) || username.includes('--')) {
      setError('Enter a valid GitHub username (1–39 letters, numbers, or single hyphens).');
      return;
    }
    setError('');
    onSearch(username);
  }
  return (
    <form onSubmit={submit}>
      <label htmlFor="username" className="sr-only">GitHub username</label>
      <div className="flex items-center border-b border-teal-500 py-2">
        <input id="username" className="bg-transparent w-full text-gray-700 mr-3 py-1 px-2 focus:outline-teal-600" type="text" placeholder="Search GitHub profile" value={input} onChange={event => setInput(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? 'search-error' : undefined} />
        <button className="bg-teal-700 hover:bg-teal-800 text-sm text-white py-2 px-3 rounded" type="submit">Search</button>
      </div>
      {error && <p id="search-error" role="alert">{error}</p>}
    </form>
  );
}
