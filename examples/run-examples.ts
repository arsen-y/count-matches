import { createCounter } from "../src/algorithms/strategies.js";

type Dataset = {
  name: string;
  A: readonly number[];
  B: readonly number[];
  expected: Record<number, number>;
};

/** Набор детерминированных датасетов для быстрого ручного теста. */
const datasets: readonly Dataset[] = [
  {
    name: "basic-small",
    A: [1, 2, 2, 3, 5, 5, 42],
    B: [5, 3, 2, 2, 2, 1, 5, 8, 13],
    expected: { 1: 1, 2: 3, 3: 1, 5: 2, 42: 0 },
  },
  {
    name: "no-overlap",
    A: [10, 20, 30, 30],
    B: [1, 2, 3, 4, 5],
    expected: { 10: 0, 20: 0, 30: 0 },
  },
  {
    name: "all-same",
    A: [7, 7, 7],
    B: [7, 7, 7, 7],
    expected: { 7: 4 },
  },
  {
    name: "skewed-B",
    A: [1, 2, 3, 4, 5, 6],
    B: [6, 6, 6, 6, 6, 6, 6, 2, 2, 2, 1],
    expected: { 1: 1, 2: 3, 3: 0, 4: 0, 5: 0, 6: 7 },
  },
];

const counter = createCounter("adaptive");

let failed = 0;
for (const ds of datasets) {
  const got = counter.count(ds.A, ds.B);
  const ok =
    Object.keys(ds.expected).length === Object.keys(got).length &&
    Object.entries(ds.expected).every(([k, v]) => got[Number(k)] === v);

  if (ok) {
    console.log(`✅ ${ds.name} OK`, got);
  } else {
    failed++;
    console.error(`❌ ${ds.name} FAIL`);
    console.error(`  expected:`, ds.expected);
    console.error(`  got     :`, got);
  }
}

if (failed > 0) {
  console.error(`Итог: провалено тестов: ${failed}`);
  process.exit(1);
} else {
  console.log(`Итог: все тесты пройдены (${datasets.length}).`);
}
