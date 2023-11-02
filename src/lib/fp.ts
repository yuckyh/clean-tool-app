import type { Flag } from '@/features/sheet/reducers'
import type * as P from 'fp-ts/Predicate'
import type * as T from 'fp-ts/Task'

import * as Eq from 'fp-ts/Eq'
import * as IO from 'fp-ts/IO'
import * as Ord from 'fp-ts/Ord'
import * as TO from 'fp-ts/TaskOption'
import * as f from 'fp-ts/function'
import * as N from 'fp-ts/number'
import * as S from 'fp-ts/string'

export const promisedTask =
  <V>(promise: Promise<V>): T.Task<V> =>
  // eslint-disable-next-line functional/functional-parameters
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
 */
export const asTask = <As extends readonly unknown[], V>(
  fn: (...args: As) => Promise<V>,
): T.Task<V> => fn

export const asIO = <As extends readonly unknown[], V>(
  fn: (...args: As) => V,
) => IO.map(f.identity)(fn)

export const strEquals = (str: string) => (other: string) =>
  S.Eq.equals(str, other)

export const numEquals = (num: number) => (other: number) =>
  N.Eq.equals(num, other)

export const isCorrectNumber = (val: string) =>
  !!val && !/[!,.?]{2,}/.test(val) && !Number.isNaN(parseFloat(val))

export const toString = <V extends boolean | number | string>(val: V) =>
  val.toString()

// eslint-disable-next-line functional/functional-parameters
export const stubEq = <V>(): Eq.Eq<V> => ({
  equals: f.constTrue,
})

export const typedEq = <V extends K, K>(eq: Eq.Eq<K>) => eq as Eq.Eq<V>
export const typedIdentity = <V>(val: unknown) => val as V

export const FlagEq: Eq.Eq<Flag> = Eq.tuple(S.Eq, S.Eq, S.Eq)
export const FlagOrd: Ord.Ord<Flag> = Ord.tuple(S.Ord, S.Ord, S.Ord)

export const length = <V extends ArrayLike<K> | string, K>(arrLike: V) =>
  arrLike.length

export const equals =
  <V>(eq: Eq.Eq<V>) =>
  (x: V): P.Predicate<V> =>
  (y: V) =>
    eq.equals(x, y)
