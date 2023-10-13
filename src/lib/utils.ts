import type { ComponentType } from 'react'
import { lazy, memo } from 'react'

export const curry = <Args extends AnyArray, Return>(
  fn: (...args: [...Args]) => Return,
): Curried<Args, Return> => {
  const passed: unknown[] = []

  const curried = <Needs extends AnyArray>(
    arg: Needs[0],
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

export const createLazyMemo = <T>(
  displayName: string,
  factory: () => Promise<{ default: ComponentType<T> }>,
) => {
  const component = memo(lazy(factory))
  component.displayName = displayName
  return component
}
