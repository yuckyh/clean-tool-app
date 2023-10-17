import { constant, pipe } from 'fp-ts/function'
import { getOrElse } from 'fp-ts/Option'
import { filter, lookup, every, zip } from 'fp-ts/ReadonlyArray'
import type { ReadonlyNonEmptyArray } from 'fp-ts/ReadonlyNonEmptyArray'

export const accessArray =
  (index: number) =>
  <T>(arr: ReadonlyNonEmptyArray<T>) =>
    arr[index]

export const makeIndexPair = <T>(value: T, i: number) => [value, i] as const

export const indexDuplicateSearcher = <T extends readonly U[], U>(
  indices: readonly T[],
  filterIndex: T,
) =>
  pipe(
    indices,
    filter((index) =>
      pipe(
        index,
        zip(filterIndex),
        every(([a, b]) => a === b),
      ),
    ),
  )

export const stringLookup = (arr: readonly string[]) => (pos: number) =>
  pipe(arr, lookup(pos), getOrElse(constant('')))

export const numberLookup = (arr: readonly number[]) => (pos: number) =>
  pipe(arr, lookup(pos), getOrElse(constant(0)))
