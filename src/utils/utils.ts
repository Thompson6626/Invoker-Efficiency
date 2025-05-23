

export function areMapsEqual<K, V>(map1: Map<K, V>, map2: Map<K, V>): boolean {
  if (map1.size !== map2.size) return false;

  for (const [key, val1] of map1) {
    if (!map2.has(key)) return false;

    const val2 = map2.get(key);
    if (val1 !== val2) return false;
  }

  return true;
}
