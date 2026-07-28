export async function fetchWatches() {
  const res = await fetch('/api/public-watches');
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to load watches');
  }
  return res.json();
}