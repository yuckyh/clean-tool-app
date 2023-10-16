import { constant, pipe } from 'fp-ts/function'
import { every } from 'fp-ts/ReadonlyArray'
import type { ReadonlyNonEmptyArray } from 'fp-ts/ReadonlyNonEmptyArray'
import { makeBy, zip } from 'fp-ts/ReadonlyNonEmptyArray'

export const accessArray =
  (index: number) =>
  <T>(arr: ReadonlyNonEmptyArray<T>) =>
    arr[index]

export const makeIndexPair = <T>(value: T, i: number) => [value, i] as const

export const indexDuplicateSearcher = <
  T extends ReadonlyNonEmptyArray<undefined | U>,
  U,
>(
  indices: ReadonlyNonEmptyArray<T>,
  filterIndex: T,
) =>
  pipe(
    indices,
    zip(makeBy(constant(filterIndex))(indices.length)),
    every(([filterIndexer, indexer]) => indexer === filterIndexer),
  )
