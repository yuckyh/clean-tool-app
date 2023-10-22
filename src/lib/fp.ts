import { identity, pipe } from 'fp-ts/function'
import * as T from 'fp-ts/Task'
import * as TO from 'fp-ts/TaskOption'
import * as IO from 'fp-ts/IO'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'

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
) => T.map(identity)(fn)

export const asIO = <As extends readonly unknown[], V>(
  fn: (...args: As) => V,
) => IO.map(identity)(fn)

export const asLazyTask = <As extends readonly unknown[], V>(
  fn: (...args: As) => Promise<V>,
) => pipe(fn, T.map(identity))

export const asLazyIO = <As extends readonly unknown[], V>(
  fn: (...args: As) => V,
) => pipe(fn, IO.map(identity))

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
