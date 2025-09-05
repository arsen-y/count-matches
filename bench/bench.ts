import { Bench } from "tinybench";
import { createCounter } from "../src/algorithms/strategies.js";

/** Псевдослучайное целое [0, max). */
function randomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

/** Генерация массива указанной длины со значениями в заданном диапазоне. */
function makeArray(length: number, valueRange: number): number[] {
  const out: number[] = new Array(length);
  for (let i = 0; i < length; i++) out[i] = randomInt(valueRange);
  return out;
}

// Масштабы задачи можно настраивать через переменные окружения
const N = Number(process.env.N ?? 200_000); // |A|
const M = Number(process.env.M ?? 1_000_000); // |B|
const RANGE_A = Number(process.env.RANGE_A ?? 50_000);
const RANGE_B = Number(process.env.RANGE_B ?? 50_000);

// Создаём входные данные один раз (чтобы не учитывать их создание в таймингах)
const A = makeArray(N, RANGE_A);
const B = makeArray(M, RANGE_B);

const adaptive = createCounter("adaptive");
const fullMap = createCounter("full-map");
const selective = createCounter("selective-scan");

// Наивная реализация O(N*M) — для контраста в бенчмарке
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

const BENCH_TIME_MS = Number(process.env.BENCH_TIME_MS ?? 500);
const BENCH_ITERS = Number(process.env.BENCH_ITERS ?? 5);
const bench = new Bench({ time: BENCH_TIME_MS, iterations: BENCH_ITERS });

bench
  .add("adaptive", () => {
    adaptive.count(A, B);
  })
  .add("full-map", () => {
    fullMap.count(A, B);
  })
  .add("selective-scan", () => {
    selective.count(A, B);
  })
  .add("naive baseline (O(N*M))", () => {
    naiveCount(A, B);
  });

await bench.warmup();
await bench.run();

console.log(bench.table());
