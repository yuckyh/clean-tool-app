import type * as Eq from 'fp-ts/Eq'

import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RR from 'fp-ts/ReadonlyRecord'
import * as f from 'fp-ts/function'

import { equals } from './fp'

/**
 *
 * @param indices
 * @param filterIndex
 * @returns
 * @example
 */
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

/**
 *
 * @param arr
 * @returns
 * @example
 */
export const arrayLookup =
  <T>(arr: readonly T[]) =>
  (defaultValue: T) =>
  (pos: number) =>
    f.pipe(
      RA.lookup(pos, arr),
      O.getOrElse(() => defaultValue),
    )

/**
 *
 * @param record
 * @returns
 * @example
 */
export const recordLookup =
  <K extends string, T>(record: RR.ReadonlyRecord<K, T>) =>
  (defaultValue: T) =>
  (key: K) =>
    f.pipe(
      RR.lookup(key, record),
      O.getOrElse(() => defaultValue),
    )

/**
 * @param arr - The array
 * @returns A function that returns the first element of the array or the provided default value
 * @example
 */
export const head =
  <T>(arr: readonly T[]) =>
  /**
   * @param defaultValue - The default value
   * @returns The first element of the array or the provided default value
   * @example
   */
  (defaultValue: T) =>
    f.pipe(
      arr,
      RA.head,
      O.getOrElse(() => defaultValue),
    )

/**
 *
 * @param arr
 * @returns
 * @example
 */
export const tail = <T>(arr: readonly T[]) => f.pipe(arr, RA.takeRight(1), head)

/**
 *
 * @param arr
 * @returns
 * @example
 */
export const findIndex =
  <T>(arr: readonly T[]) =>
  (eq: Eq.Eq<T>) =>
  (value: T) =>
    f.pipe(
      arr,
      RA.findIndex(equals(eq)(value)),
      O.getOrElse(() => -1),
    )

/**
 * Retrieves the value from an indexed tuple
 * @param tuple - The indexed tuple
 * @param tuple.0 - The index
 * @param tuple.1 - The value
 * @returns The value
 * @example
 */
export const getIndexedValue = <I, V>([, value]: readonly [I, V]) => value

/**
 * Retrieves the index from an indexed tuple
 * @param tuple - The indexed tuple
 * @param tuple.0 - The index
 * @returns The index
 * @example
 */
export const getIndexedIndex = <I, V>([index]: readonly [I, V]) => index
