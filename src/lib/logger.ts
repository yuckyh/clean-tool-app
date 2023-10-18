import type { DependencyList } from 'react'
import { useEffect } from 'react'
import { console } from 'fp-ts'
import { constant, flow, pipe } from 'fp-ts/function'
import { toEntries } from 'fp-ts/ReadonlyRecord'
import { traverseArray, flatMap, tap, of } from 'fp-ts/IO'
import RA from 'fp-ts/ReadonlyArray'

export const logger = <T>(obj: Readonly<Record<string, T>>) => {
  return pipe(
    obj,
    toEntries,
    of,
    tap(
      flow(
        traverseArray(console.log),
        flatMap(() => constant(undefined)),
      ),
    ),
    flatMap(
      flow(
        RA.map(([, value]) => value),
        constant,
      ),
    ),
  )()[0] as T
}

export const useLoggerEffect = <T extends ArrayElement<DependencyList>>(
  dep: Record<string, T>,
) => {
  useEffect(() => {
    logger(dep)
    return undefined
  }, [dep])
}
