/**
 * @file This file contains the logger utilities.
 * @module lib/fp/logger
 */

import type { DependencyList } from 'react'

import { console as fpConsole } from 'fp-ts'
import * as IO from 'fp-ts/IO'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RR from 'fp-ts/ReadonlyRecord'
import * as f from 'fp-ts/function'
import { useEffect } from 'react'

/**
 * The function to dump a value with its trace to the console.
 * @param arg - The value to dump.
 * @returns An IO that dumps the value to the console.
 * @example
 *  const ioDumpTrace = dumpTrace('foo')
 */
export const ioDumpTrace = <T extends Parameters<typeof fpConsole.log>[0]>(
  arg: T,
) =>
  f.pipe(
    arg,
    IO.of,
    IO.tap(() =>
      IO.of(() => {
        // eslint-disable-next-line no-console
        console.trace(arg)
      }),
    ),
  )

/**
 * The function to dump a value with its trace to the console.
 * @param arg - The value to dump.
 * @returns The value that was dumped.
 * @example
 *  const foo = dumpTrace('foo') // foo === 'foo'
 */
export const dumpTrace = <T extends Parameters<typeof fpConsole.log>[0]>(
  arg: T,
) => {
  return ioDumpTrace(arg)()
}

/**
 * The function to dump an error to the console.
 * @param err - The error to dump.
 * @returns An IO that dumps the error to the console.
 * @example
 *  const fooError = dumpError(new Error('foo'))
 */
export const ioDumpError = <E>(err: E) => fpConsole.error(err)

/**
 * The function to dump an error to the console.
 * @param err - The error to dump.
 * @example
 *  dumpError(new Error('foo')) // Error: foo
 */
export const dumpError = <E>(err: E) => {
  ioDumpError(err)()
}

/**
 * The function to dump a value to the console.
 * @param arg - The value to dump.
 * @returns An IO that dumps the value to the console.
 * @example
 *  const foo = ioDump('foo')
 */
export const ioDump = fpConsole.log

/**
 * The function to dump a value to the console.
 * @param arg - The value to dump.
 * @returns The value that was dumped.
 * @example
 * const foo = dump('foo') // foo === 'foo'
 */
export const dump = <T extends Parameters<typeof fpConsole.log>[0]>(arg: T) => {
  ioDump(arg)()
  return arg
}

/**
 * The function to dump a value with its name to the console.
 * @param obj - The value with the key as its name to dump.
 * @returns An IO that dumps the value to the console.
 * @example
 *  const ioDumpName = dumpName({ foo: 'bar' })
 */
export const ioDumpName = <T>(obj: Readonly<Record<string, T>>) =>
  f.pipe(
    obj,
    RR.toReadonlyArray,
    RA.map(([name, value]) =>
      f.pipe(
        name,
        IO.of,
        IO.tap(fpConsole.log),
        IO.map(() => value),
        IO.tap(fpConsole.log),
        IO.flatMap(ioDumpTrace),
      ),
    ),
    IO.sequenceArray,
  )

/**
 * The function to dump a value with its name to the console.
 * @param obj - The value with the key as its name to dump.
 * @returns The value that was dumped.
 * @example
 *  const foo = dumpName({ foo: 'bar' }) // foo === 'bar'
 */
export const dumpName = <T>(obj: Readonly<Record<string, T>>) =>
  ioDumpName(obj)()[0] as T

/**
 * This hook is used to dump a value with its name to the console.
 * @param dep - The value with the key as its name to dump.
 * @example
 * ```tsx
 *  useLoggerEffect({ foo: 'bar' })
 * ```
 */
export const useLoggerEffect = <T extends ArrayElement<DependencyList>>(
  dep: Record<string, T>,
) => {
  useEffect(() => {
    dumpName(dep)
  }, [dep])
}
