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
  f.pipe(arr, RA.lookup(pos), f.pipe('', f.constant, O.getOrElse))

export const numberLookup = (arr: readonly number[]) => (pos: number) =>
  f.pipe(arr, RA.lookup(pos), f.pipe(0, f.constant, O.getOrElse))

export const getIndexedValue = <I, V>([, value]: readonly [I, V]) => value

export const getIndexedIndex = <I, V>([index]: readonly [I, V]) => index
