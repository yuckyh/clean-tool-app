import type * as Eq from 'fp-ts/Eq'

import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'

import { equals } from './fp'

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
export const arrLookup =
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

export const findIndex =
  <T>(arr: readonly T[]) =>
  (eq: Eq.Eq<T>) =>
  (value: T) =>
    f.pipe(
      arr,
      RA.findIndex(equals(eq)(value)),
      f.pipe(-1, f.constant, O.getOrElse),
    )

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
