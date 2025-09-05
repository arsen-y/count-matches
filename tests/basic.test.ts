import test from "node:test";
import assert from "node:assert/strict";
import { createCounter } from "../src/algorithms/strategies.js";

// Вспомогательная наивная проверка корректности (O(N*M)), только для тестов.
function naiveCount(a: readonly number[], b: readonly number[]): Record<number, number> {
  const seen = new Set<number>();
  const out: Record<number, number> = {};
  for (let i = 0; i < a.length; i++) {
    const x = a[i]!;
    if (seen.has(x)) continue;
    seen.add(x);
    let c = 0;
    for (let j = 0; j < b.length; j++) if (b[j] === x) c++;
    out[x] = c;
  }
  return out;
}

test("базовый корректный подсчёт (детерминированные данные)", () => {
  const counter = createCounter("adaptive");

  const cases = [
    {
      A: [1, 2, 2, 3, 5, 5, 42],
      B: [5, 3, 2, 2, 2, 1, 5, 8, 13],
      expected: { 1: 1, 2: 3, 3: 1, 5: 2, 42: 0 },
    },
    {
      A: [10, 20, 30, 30],
      B: [1, 2, 3, 4, 5],
      expected: { 10: 0, 20: 0, 30: 0 },
    },
    {
      A: [7, 7, 7],
      B: [7, 7, 7, 7],
      expected: { 7: 4 },
    },
    {
      A: [1, 2, 3, 4, 5, 6],
      B: [6, 6, 6, 6, 6, 6, 6, 2, 2, 2, 1],
      expected: { 1: 1, 2: 3, 3: 0, 4: 0, 5: 0, 6: 7 },
    },
  ] as const;

  for (const { A, B, expected } of cases) {
    const got = counter.count(A, B);
    assert.deepEqual(got, expected);
  }
});

test("граничные случаи: пустые массивы", () => {
  const counter = createCounter("adaptive");
  assert.deepEqual(counter.count([], []), {});
  assert.deepEqual(counter.count([], [1, 2, 3]), {});
  assert.deepEqual(counter.count([1, 1, 1], []), { 1: 0 });
});

test("согласованность с наивной реализацией на случайных данных (малые размеры)", () => {
  const counter = createCounter("adaptive");

  function randInt(max: number) {
    return Math.floor(Math.random() * max);
  }
  function make(len: number, range: number) {
    return Array.from({ length: len }, () => randInt(range));
  }

  for (let t = 0; t < 10; t++) {
    const A = make(100, 20);
    const B = make(200, 20);
    const expected = naiveCount(A, B);
    const got = counter.count(A, B);
    assert.deepEqual(got, expected);
  }
});
