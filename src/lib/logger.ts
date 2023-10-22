import type { DependencyList } from 'react'
import { useEffect } from 'react'
import { console as fpConsole } from 'fp-ts'
import { flow, pipe } from 'fp-ts/function'
import * as RR from 'fp-ts/ReadonlyRecord'
import * as IO from 'fp-ts/IO'
import * as RA from 'fp-ts/ReadonlyArray'
import { asIO } from './fp'
import { getIndexedValue } from './array'

export const ioDumpTrace = <T extends Parameters<typeof fpConsole.log>[0]>(
  arg: T,
) =>
  asIO(() => {
    // eslint-disable-next-line no-console
    console.trace(arg)
    return arg
  })

export const dumpTrace = <T extends Parameters<typeof fpConsole.log>[0]>(
  arg: T,
) => {
  return ioDumpTrace(arg)()
}

export const ioDumpError = <E>(err: E) => fpConsole.error(err)

export const dumpError = <E>(err: E) => {
  ioDumpError(err)()
}

export const dump = <T extends Parameters<typeof fpConsole.log>[0]>(arg: T) => {
  fpConsole.log(arg)()
  return arg
}

export const dumpName = <T>(obj: Readonly<Record<string, T>>) => {
  return pipe(
    obj,
    RR.toReadonlyArray,
    RA.map(IO.of),
    IO.traverseArray(IO.tap(ioDumpTrace)),
    IO.flatMap(flow(RA.map<readonly [string, T], T>(getIndexedValue), IO.of)),
  )()[0] as T
}

export const useLoggerEffect = <T extends ArrayElement<DependencyList>>(
  dep: Record<string, T>,
) => {
  useEffect(() => {
    dumpName(dep)
  }, [dep])
}
