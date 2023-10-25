import * as E from 'fp-ts/Either'
import * as IO from 'fp-ts/IO'
import * as O from 'fp-ts/Option'
import * as T from 'fp-ts/Task'
import * as TO from 'fp-ts/TaskOption'
import * as f from 'fp-ts/function'
import * as N from 'fp-ts/number'
import * as S from 'fp-ts/string'

export const promisedTask =
  <V>(promise: Promise<V>) =>
  // eslint-disable-next-line functional/functional-parameters
  () =>
    promise

export const promisedTaskOption = <V>(promise: Promise<V>): TO.TaskOption<V> =>
  // eslint-disable-next-line functional/functional-parameters
  TO.fromTask(promisedTask(promise))

export const asTask = <As extends readonly unknown[], V>(
  fn: (...args: As) => Promise<V>,
) => T.map(f.identity)(fn)

export const asIO = <As extends readonly unknown[], V>(
  fn: (...args: As) => V,
) => IO.map(f.identity)(fn)

export const asLazyTask = <As extends readonly unknown[], V>(
  fn: (...args: As) => Promise<V>,
) => f.pipe(fn, T.map(f.identity))

export const asLazyIO = <As extends readonly unknown[], V>(
  fn: (...args: As) => V,
) => f.pipe(fn, IO.map(f.identity))

const getMaybe = <E, V>(
  value: V,
  error?: E,
):
  | readonly [E.Either<E, never>, E.Either<never, V>]
  | readonly [O.Option<V>, O.Option<V>] =>
  error
    ? ([E.left(error), E.right(value)] as const)
    : ([O.none, O.some(value)] as const)

export const asMaybe = <E, V>(value: V, condition: boolean, error?: E) => {
  const maybe = getMaybe(value, error)
  return condition ? maybe[1] : maybe[0]
}

export const strEquals = (str: string) => (other: string) =>
  S.Eq.equals(str, other)

export const numEquals = (num: number) => (other: number) =>
  N.Eq.equals(num, other)
