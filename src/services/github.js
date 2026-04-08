const BASE = 'https://api.github.com';

export async function readFile(repo, path, token) {
  const res = await fetch(`${BASE}/repos/${repo}/contents/${path}`, {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json'
    }
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const data = await res.json();
  const content = atob(data.content.replace(/\n/g, ''));
  return { data: JSON.parse(content), sha: data.sha };
}

export async function writeFile(repo, path, content, sha, token, message) {
  const body = {
    message: message || `Update ${path}`,
    content: btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2)))),
    ...(sha && { sha })
  };
  const res = await fetch(`${BASE}/repos/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`GitHub write error: ${res.status}`);
  return res.json();
}

export async function upsertFile(repo, path, content, token, message) {
  const existing = await readFile(repo, path, token);
  return writeFile(repo, path, content, existing?.sha, token, message);
}
