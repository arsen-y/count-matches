export type CountResult = Record<number, number>;

/** Контракт счётчика.
 *  Метод должен вернуть объект с количеством вхождений каждого уникального элемента из A в B.
 *  Для элементов из A, которых нет в B, значение должно быть 0.
 */
export interface Counter {
  count(a: readonly number[], b: readonly number[]): CountResult;
}
