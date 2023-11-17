/**
 * @file This file contains utilities for arrays.
 */

import type * as Eq from 'fp-ts/Eq'

import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RR from 'fp-ts/ReadonlyRecord'
import * as f from 'fp-ts/function'

import { equals } from './fp'

/**
 * The function to get duplicates in an array.
 * @param indices - The array to search for duplicates
 * @param filterIndex - The array to filter for duplicates
 * @returns The duplicates in the array
 * @example
 *  const duplicates = indexDuplicateSearcher(indices, filterIndex)
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
 * The function to access an array element safely.
 * @param arr - The array to access.
 * @returns A function that returns the element at the specified position or the provided default value.
 * @example
 *  const value = arrayLookup(arr)(defaultValue)(pos)
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
 * The function to access a record element safely.
 * @param record - The record to access.
 * @returns A function that returns the element with the specified key or the provided default value.
 * @example
 *  const value = recordLookup(record)(defaultValue)(key)
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
 * The function to get the first element of an array.
 * @param arr - The array.
 * @returns A function that returns the first element of the array or the provided default value.
 * @example
 *  const value = head(arr)(defaultValue)
 */
export const head =
  <T>(arr: readonly T[]) =>
  (defaultValue: T) =>
    f.pipe(
      arr,
      RA.head,
      O.getOrElse(() => defaultValue),
    )

/**
 * The function to get the last element of an array.
 * @param arr - The array.
 * @returns A function that returns the last element of the array or the provided default value.
 * @example
 *  const value = tail(arr)(defaultValue)
 */
export const tail = <T>(arr: readonly T[]) => f.pipe(arr, RA.takeRight(1), head)

/**
 * The function to get the index of an element in an array.
 * @param arr - The array.
 * @returns A function that returns the index of the element or -1 if the element is not found.
 * @example
 *  const index = findIndex(arr)(eq)(value)
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
 * Retrieves the value from an indexed tuple.
 * @param tuple - The indexed tuple.
 * @param tuple.0 - The index.
 * @param tuple.1 - The value.
 * @returns The value.
 * @example
 *  const value = getIndexedValue([0, 'foo']) // 'foo'
 */
export const getIndexedValue = <I, V>([, value]: readonly [I, V]) => value

/**
 * Retrieves the index from an indexed tuple.
 * @param tuple - The indexed tuple.
 * @param tuple.0 - The index.
 * @returns The index.
 * @example
 *  const index = getIndexedIndex([0, 'foo']) // 0
 */
export const getIndexedIndex = <I, V>([index]: readonly [I, V]) => index
