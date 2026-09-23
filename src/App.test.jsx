import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import App from './App';
import { safeWebUrl } from './github';

const profile = login => ({ login, html_url: `https://github.com/${login}`, blog: 'javascript:alert(1)' });
const response = data => ({ ok: true, json: async () => data });
async function search(user, name) {
  const input = screen.getByRole('textbox', { name: 'GitHub username' });
  await user.clear(input);
  await user.type(input, `${name}{Enter}`);
}

describe('safe external URLs', () => {
  it.each(['javascript:alert(1)', 'data:text/html,hello', 'java\nscript:alert(1)', 'https://user:pass@example.com', 'http://', null])('rejects %s', value => {
    expect(safeWebUrl(value)).toBeNull();
  });
  it('normalizes bare domains and accepts web links', () => {
    expect(safeWebUrl('example.com')).toBe('https://example.com/');
    expect(safeWebUrl('https://example.com/path')).toBe('https://example.com/path');
  });
});

it('validates input before making requests', async () => {
  const fetch = vi.fn(); vi.stubGlobal('fetch', fetch);
  const user = userEvent.setup(); render(<App />);
  await user.click(screen.getByRole('button', { name: 'Search' }));
  expect(screen.getByRole('alert')).toHaveTextContent('valid GitHub username');
  await search(user, '../bad');
  expect(fetch).not.toHaveBeenCalled();
});

it('searches trimmed usernames, filters repositories, and hides unsafe links', async () => {
  const fetch = vi.fn().mockResolvedValueOnce(response(profile('octocat'))).mockResolvedValueOnce(response([
    { id: 1, name: 'popular', stargazers_count: 2, forks_count: 0, html_url: 'https://github.com/octocat/popular' },
    { id: 2, name: 'empty', stargazers_count: 0, forks_count: 0 },
  ]));
  vi.stubGlobal('fetch', fetch);
  const user = userEvent.setup(); render(<App />);
  await search(user, ' octocat ');
  expect(await screen.findByRole('link', { name: 'popular' })).toHaveAttribute('href', 'https://github.com/octocat/popular');
  expect(screen.queryByText('empty')).not.toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'Personal website' })).not.toBeInTheDocument();
  expect(fetch.mock.calls[0][0]).toBe('https://api.github.com/users/octocat');
});

it.each([[404, 'No username found'], [403, 'request limit'], [429, 'request limit'], [500, 'unavailable']])('handles HTTP %s and allows retry', async (status, message) => {
  const fetch = vi.fn().mockResolvedValueOnce({ ok: false, status }).mockResolvedValueOnce(response(profile('octocat'))).mockResolvedValueOnce(response([]));
  vi.stubGlobal('fetch', fetch);
  const user = userEvent.setup(); render(<App />);
  await search(user, 'octocat');
  expect(await screen.findByRole('alert')).toHaveTextContent(message);
  await user.click(screen.getByRole('button', { name: 'Search' }));
  expect(await screen.findByRole('link', { name: 'GitHub profile' })).toBeInTheDocument();
});

it('ignores an older response after another search', async () => {
  let resolveOld;
  const fetch = vi.fn().mockImplementationOnce(() => new Promise(resolve => { resolveOld = resolve; }))
    .mockResolvedValueOnce(response(profile('newuser'))).mockResolvedValueOnce(response([]));
  vi.stubGlobal('fetch', fetch);
  const user = userEvent.setup(); render(<App />);
  await search(user, 'olduser');
  await search(user, 'newuser');
  await screen.findByRole('link', { name: 'GitHub profile' });
  expect(fetch.mock.calls[0][1].signal.aborted).toBe(true);
  await act(async () => resolveOld(response(profile('olduser'))));
  expect(screen.getByRole('link', { name: 'GitHub profile' })).toHaveAttribute('href', 'https://github.com/newuser');
});

it('loads subsequent repository pages', async () => {
  const fetch = vi.fn().mockResolvedValueOnce(response(profile('octocat')))
    .mockResolvedValueOnce(response(Array.from({ length: 100 }, (_, id) => ({ id, stargazers_count: 0, forks_count: 0 }))))
    .mockResolvedValueOnce(response([{ id: 101, name: 'later-repo', stargazers_count: 1, forks_count: 0 }]));
  vi.stubGlobal('fetch', fetch);
  const user = userEvent.setup(); render(<App />);
  await search(user, 'octocat');
  expect(await screen.findByText('later-repo')).toBeInTheDocument();
  expect(fetch.mock.calls[2][0]).toContain('page=2');
});

it('shows repository failures instead of an empty result', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(response(profile('octocat'))).mockRejectedValueOnce(new Error('Network unavailable')));
  const user = userEvent.setup(); render(<App />);
  await search(user, 'octocat');
  await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Network unavailable'));
  expect(screen.queryByText(/No repository exists/)).not.toBeInTheDocument();
});
