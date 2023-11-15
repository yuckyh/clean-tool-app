/* eslint-disable
  functional/functional-parameters
*/
import type * as P from 'fp-ts/Predicate'

import * as Eq from 'fp-ts/Eq'
import * as IO from 'fp-ts/IO'
import * as T from 'fp-ts/Task'
import * as TO from 'fp-ts/TaskOption'
import * as Tup from 'fp-ts/Tuple'
import * as f from 'fp-ts/function'
import * as S from 'fp-ts/string'

export const promisedTask =
  <V>(promise: Promise<V>): T.Task<V> =>
  () =>
    promise
/**
 * Converts a promise into a task option.
 * @param promise - The promise to convert.
 * @returns A task option representing the promise.
 */
export const promisedTaskOption = f.flow(promisedTask, TO.fromTask)

/**
 * Converts a function that returns a promise into a task.
 * @param fn - The function that makes a promise.
 * @returns A task representing the function.
 * @example
 */
export const asTask = <As extends readonly unknown[], V>(
  fn: (...args: As) => Promise<V>,
): T.Task<V> => fn

export const asIO = <As extends readonly unknown[], V>(
  fn: (...args: As) => V,
): IO.IO<V> => fn

export const isCorrectNumber = (val: string) =>
  !!val && !/[!,.?]{2,}/.test(val) && !Number.isNaN(parseFloat(val))

export const toString = <V extends Primitive>(val: V) => val.toString()

export const typedIdentity = <V>(val: unknown) => val as V

export const equals =
  <V>(eq: Eq.Eq<V>) =>
  (x: V): P.Predicate<V> =>
  (y: V) =>
    eq.equals(x, y)

export const noOpIO: IO.IO<() => void> = IO.of(() => {})

export const noOpTask: T.Task<() => void> = T.of(() => {})

export const dualMap =
  <A, B>(fn: (a: A) => B) =>
  (tuple: readonly [A, A]) =>
    Tup.bimap(fn, fn)(tuple as [A, A])
/**
 *
 */

export const indexEq = Eq.tuple(S.Eq, S.Eq)
