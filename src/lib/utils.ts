import type { ComponentType } from 'react'
import { lazy, memo } from 'react'
import * as IO from 'fp-ts/IO'
import * as T from 'fp-ts/Task'

export const createMemo = <T>(
  displayName: string,

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

export const noOpIO: IO.IO<() => void> = IO.of(() => {})

export const noOpTask: T.Task<() => void> = T.of(() => {})
