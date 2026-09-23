export function safeWebUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return null;
  const input = value.trim();
  if ([...input].some(char => char.charCodeAt(0) <= 32 || char.charCodeAt(0) === 127)) return null;
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(input) ? input : `https://${input}`);
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}

export async function githubRequest(path, signal) {
  const response = await fetch(`https://api.github.com${path}`, { signal, headers: { Accept: 'application/vnd.github+json' } });
  if (!response.ok) {
    if (response.status === 404) throw new Error('No username found on GitHub.');
    if (response.status === 403 || response.status === 429) throw new Error('GitHub request limit reached. Please try again later.');
    throw new Error('GitHub is unavailable. Please try again.');
  }
  return response.json();
}
