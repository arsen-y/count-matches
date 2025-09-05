import type { CountResult, Counter } from "../types.js";
import { initResult, uniqueValues } from "../utils.js";

/**
 * Стратегия 1: строим частотную Map по массиву B, затем делаем lookup для уникальных из A.
 * Время: O(N + M), Память: O(U_B), где U_B — число уникальных элементов B.
 */
export class FullMapStrategy implements Counter {
  count(a: readonly number[], b: readonly number[]): CountResult {
    // Строим частотную карту по B
    const freq = new Map<number, number>();
    for (let i = 0; i < b.length; i++) {
      const v = b[i]!;
      const prev = freq.get(v);
      if (prev === undefined) freq.set(v, 1);
      else freq.set(v, prev + 1);
    }
    // Дедуплицируем A один раз
    const uniqA = uniqueValues(a);
    // Формируем результат из карты частот
    const out = initResult(uniqA);
    for (let i = 0; i < uniqA.length; i++) {
      const key = uniqA[i]!;
      out[key] = freq.get(key) ?? 0;
    }
    return out;
  }
}

/**
 * Стратегия 2: сканируем B один раз и инкрементируем счётчики
 * только для значений, входящих в Set(unique(A)).
 * Время: O(N + M), Память: O(U_A).
 */
export class SelectiveScanStrategy implements Counter {
  count(a: readonly number[], b: readonly number[]): CountResult {
    const uniqA = uniqueValues(a);
    const out = initResult(uniqA);
    const target = new Set<number>(uniqA);

    for (let i = 0; i < b.length; i++) {
      const v = b[i]!;
      if (target.has(v)) {
        out[v]! += 1;
      }
    }
    return out;
  }
}

export type StrategyName = "adaptive" | "full-map" | "selective-scan";

/**
 * Адаптивный оркестратор: выбирает стратегию по простой эвристике.
 * Если |unique(A)| * k < |B| (k по умолчанию 4), выгоднее selective-scan.
 * Иначе — full-map.
 */
export class AdaptiveCounter implements Counter {
  private full = new FullMapStrategy();
  private selective = new SelectiveScanStrategy();

  constructor(private heuristicFactor = 4) {}

  count(a: readonly number[], b: readonly number[]): CountResult {
    const uniqA = uniqueValues(a);
    if (uniqA.length * this.heuristicFactor < b.length) {
      // Передаём уже дедуплицированный A, чтобы избежать повторной дедупликации.
      return this.selective.count(uniqA, b);
    }
    return this.full.count(uniqA, b);
  }
}

/** Фабрика стратегий (по умолчанию — adaptive). */
export function createCounter(name: StrategyName = "adaptive"): Counter {
  switch (name) {
    case "full-map":
      return new FullMapStrategy();
    case "selective-scan":
      return new SelectiveScanStrategy();
    case "adaptive":
      return new AdaptiveCounter();
  }
}
