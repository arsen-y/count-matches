/** Возвращает массив уникальных значений исходного массива (порядок не гарантируется). */
export function uniqueValues(a: readonly number[]): number[] {
  const s = new Set<number>();
  for (let i = 0; i < a.length; i++) s.add(a[i]!);
  return Array.from(s);
}

/** Инициализирует объект результата значениями 0 по переданным ключам. */
export function initResult(keys: readonly number[]): Record<number, number> {
  const out: Record<number, number> = {};
  for (let i = 0; i < keys.length; i++) {
    // Числовые ключи в JS хранятся как строки — это ожидаемое поведение.
    out[keys[i]!] = 0;
  }
  return out;
}
