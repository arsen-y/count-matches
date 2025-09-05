import { createCounter } from "./algorithms/strategies.js";

// Пример использования для ручной проверки
const A = [1, 2, 2, 3, 5, 5, 42];
const B = [5, 3, 2, 2, 2, 1, 5, 8, 13];

const counter = createCounter("adaptive");
const result = counter.count(A, B);
console.log("Результат:", result);

export { createCounter };
