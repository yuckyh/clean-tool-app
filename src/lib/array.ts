import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'

export const indexDuplicateSearcher = <T extends readonly U[], U>(
  indices: readonly T[],
  filterIndex: T,
) =>
  f.pipe(
    indices,
    RA.filter(
      f.flow(
        RA.zip(filterIndex),
        RA.every(([a, b]) => a === b),
      ),
    ),
  )

export const stringLookup = (arr: readonly string[]) => (pos: number) =>
  f.pipe(RA.lookup(pos, arr), f.pipe('', f.constant, O.getOrElse))

export const lookup =
  <T>(arr: readonly T[]) =>
  (defaultValue: T) =>
  (pos: number) =>
    f.pipe(RA.lookup(pos, arr), f.pipe(defaultValue, f.constant, O.getOrElse))

/**
 * @param arr - The array
 * @returns A function that returns the first element of the array or the provided default value
 */
export const head =
  <T>(arr: readonly T[]) =>
  /**
   * @param defaultValue - The default value
   * @returns The first element of the array or the provided default value
   */
  (defaultValue: T) =>
    f.pipe(arr, RA.head, f.pipe(defaultValue, f.constant, O.getOrElse))

/**
 * Retrieves the value from an indexed tuple
 * @param tuple - The indexed tuple
 * @param tuple.0 - The index
 * @param tuple.1 - The value
 * @returns The value
 */
export const getIndexedValue = <I, V>([, value]: readonly [I, V]) => value

/**
 * Retrieves the index from an indexed tuple
 * @param tuple - The indexed tuple
 * @param tuple.0 - The index
 * @returns The index
 */
export const getIndexedIndex = <I, V>([index]: readonly [I, V]) => index
