import type { ComponentType } from 'react'
import { lazy, memo } from 'react'
import IO from 'fp-ts/IO'

export const curry = <Args extends readonly unknown[], Return>(
  fn: (...args: readonly [...Args]) => Return,
): Curried<Args, Return> => {
  const passed: readonly unknown[] = []

  const curried = <Needs extends AnyArray>(
    arg: Needs[number],
  ): Curried<Needs, Return> => {
    passed.push(arg)

    return (
      passed.length >= fn.length
        ? fn(...(passed as Args))
        : curried<ExcludeFirst<Needs>>
    ) as Curried<Needs, Return>
  }
  return curried as Curried<Args, Return>
}

export const createMemo = <T>(
  displayName: string,
  // eslint-disable-next-line functional/prefer-immutable-types
  component: ComponentType<T>,
) => {
  const memoized = memo(component)
  // eslint-disable-next-line functional/immutable-data
  memoized.displayName = displayName
  return memoized
}

export const createLazyMemo = <T>(
  displayName: string,
  factory: () => Promise<{ default: ComponentType<T> }>,
) => {
  const component = memo(lazy(factory))
  // eslint-disable-next-line functional/immutable-data
  component.displayName = displayName
  return component
}

export const noOp = IO.of(() => undefined)
