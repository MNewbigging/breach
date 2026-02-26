let cached: Promise<Set<string>> | null = null;

export function loadDictionary(): Promise<Set<string>> {
  if (cached) return cached;

  cached = (async () => {
    const url = `${import.meta.env.BASE_URL}dictionary.txt`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load dictionary: ${res.status}`);
    const text = await res.text();

    const words = new Set(
      text
        .split(/\r?\n/)
        .map((w) => w.trim().toLowerCase())
        .filter(Boolean),
    );

    return words;
  })();

  return cached;
}
