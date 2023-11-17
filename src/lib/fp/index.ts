/**
 * @file This file contains the utilities for fp-ts.
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
 * @example
 *  const promise = Promise.resolve(1)
 *  const taskOption = promisedTaskOption(() => promise)
 */
export const promisedTaskOption = f.flow(promisedTask, TO.fromTask)

/**
 * Converts a function that returns a promise into a task.
 * @param fn - The function that makes a promise.
 * @returns A task representing the function.
 * @example
 *  const promise = Promise.resolve(1)
 *  const task = promisedTask(() => promise)
 */
export const asTask = <As extends readonly unknown[], V>(
  fn: (...args: As) => Promise<V>,
): T.Task<V> => fn

/**
 * Converts a function that returns a value into a IO.
 * @param fn - The function that returns a value.
 * @returns An IO representing the function.
 * @example
 *  const fn = () => 1
 *  const io = asIO(fn)
 */
export const asIO = <As extends readonly unknown[], V>(
  fn: (...args: As) => V,
): IO.IO<V> => fn

/**
 * Function to check whether a string is a valid number.
 * @param val - The string to check.
 * @returns Whether the string is a valid number.
 * @example
 *  isCorrectNumber('1') // true
 */
export const isCorrectNumber = (val: string) =>
  !!val && !/[!,.?]{2,}/.test(val) && !Number.isNaN(parseFloat(val))

/**
 * Function to convert a primitive to a string.
 * @param val - The primitive to convert.
 * @returns The string representation of the primitive.
 * @example
 *  toString(1) // '1'
 *  toString('1') // '1'
 *  toString(true) // 'true'
 */
export const toString = <V extends Primitive>(val: V) => val.toString()

/**
 * An identity function that is typed.
 * @param val - The value to return.
 * @returns The typed value.
 * @example
 *  type CoolNumber = number & { readonly cool: true }
 *  typedIdentity<CoolNumber>(1) // 1
 */
export const typedIdentity = <V>(val: unknown) => val as V

/**
 * Function to check for equality between two values.
 * @param eq - The equality instance.
 * @returns  A predicate that checks for equality.
 * @example
 *  const eq = number.Eq
 *  const predicate = equals(eq)(1)
 */
export const equals =
  <V>(eq: Eq.Eq<V>) =>
  (x: V): P.Predicate<V> =>
  (y: V) =>
    eq.equals(x, y)

/**
 * Function to create an instance of a void IO.
 * @returns An IO that does nothing.
 * @example
 *  const io = noOpIO()
 */
export const noOpIO: IO.IO<() => void> = IO.of(() => {})

/**
 * Function to create an instance of a void task.
 * @returns A task that does nothing.
 * @example
 *  const task = noOpTask()
 */
export const noOpTask: T.Task<() => void> = T.of(() => {})

/**
 * Function to apply a function to a bifunctor.
 * @param fn - The function to apply.
 * @returns A function that applies the function to a bifunctor.
 * @example
 *  const fn = (x: number) => x + 1
 */
export const dualMap =
  <A, B>(fn: (a: A) => B) =>
  (tuple: readonly [A, A]) =>
    Tup.bimap(fn, fn)(tuple as [A, A])
/**
 *
 */

export const indexEq = Eq.tuple(S.Eq, S.Eq)
