import type { DependencyList } from 'react'

import { console as fpConsole } from 'fp-ts'
import * as IO from 'fp-ts/IO'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RR from 'fp-ts/ReadonlyRecord'
import * as f from 'fp-ts/function'
import { useEffect } from 'react'

import { asIO } from './fp'

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

export const ioDump = fpConsole.log

export const dump = <T extends Parameters<typeof fpConsole.log>[0]>(arg: T) => {
  ioDump(arg)()
  return arg
}

export const ioDumpName = <T>(obj: Readonly<Record<string, T>>) =>
  f.pipe(
    obj,
    RR.toReadonlyArray,
    RA.map(([name, value]) =>
      f.pipe(
        value,
        IO.of,
        IO.tap(() => fpConsole.log(name)),
        IO.flatMap(ioDumpTrace),
      ),
    ),
    IO.sequenceArray,
  )

export const dumpName = <T>(obj: Readonly<Record<string, T>>) => {
  return ioDumpName(obj)()[0] as T
}

export const useLoggerEffect = <T extends ArrayElement<DependencyList>>(
  dep: Record<string, T>,
) => {
  useEffect(() => {
    dumpName(dep)
  }, [dep])
}
