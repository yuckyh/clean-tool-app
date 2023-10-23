import { constant, flow, pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import { dump } from './logger'

export const indexDuplicateSearcher = <T extends readonly U[], U>(
  indices: readonly T[],
  filterIndex: T,
) =>
  pipe(
    indices,
    // dump,
    RA.filter(
      flow(
        RA.zip(filterIndex),
        RA.every(([a, b]) => a === b),
      ),
    ),
  )

export const stringLookup = (arr: readonly string[]) => (pos: number) =>
  pipe(arr, RA.lookup(pos), pipe('', constant, O.getOrElse))

export const numberLookup = (arr: readonly number[]) => (pos: number) =>
  pipe(arr, RA.lookup(pos), pipe(0, constant, O.getOrElse))

export const getIndexedValue = <I, V>([, value]: readonly [I, V]) => value

export const getIndexedIndex = <I, V>([index]: readonly [I, V]) => index
