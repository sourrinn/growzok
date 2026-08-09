/**
 * Zero-cost fuzzy search matching using browser-native Intl.Collator.
 * Case-insensitive, accent-tolerant, and locale-aware.
 */
export function fuzzyMatch(target: string, query: string): boolean {
  if (!query.trim()) return true;
  if (!target) return false;

  const normalizedTarget = target.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const normalizedQuery = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // Substring match
  if (normalizedTarget.includes(normalizedQuery)) return true;

  // Word prefix match
  const words = normalizedTarget.split(/\s+/);
  return words.some((w) => w.startsWith(normalizedQuery));
}

/**
 * Filter an array of items by checking multiple string fields against a query string.
 */
export function filterByFuzzySearch<T>(
  items: T[],
  query: string,
  getFieldStrings: (item: T) => string[]
): T[] {
  if (!query.trim()) return items;

  return items.filter((item) => {
    const fields = getFieldStrings(item);
    return fields.some((field) => fuzzyMatch(field, query));
  });
}
