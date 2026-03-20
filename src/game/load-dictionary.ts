let cached: Promise<Dictionary> | null = null;

// Note: all words are set to upper case (they appear as lower in dictionary.txt)
export interface Dictionary {
  wordsByLength: Map<number, string[]>;
  set: Set<string>;
}

export function loadDictionary(): Promise<Dictionary> {
  if (cached) return cached;

  cached = (async () => {
    const url = `${import.meta.env.BASE_URL}dictionary.txt`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load dictionary: ${res.status}`);
    const text = await res.text();

    const wordsByLength = new Map<number, string[]>();
    const set = new Set<string>();

    for (const raw of text.split(/\r?\n/)) {
      const word = raw.trim().toUpperCase();
      if (!word) continue;

      const length = word.length;
      const bucket = wordsByLength.get(length) ?? [];
      bucket.push(word);
      wordsByLength.set(length, bucket);

      set.add(word);
    }

    return { wordsByLength, set };
  })();

  return cached;
}
