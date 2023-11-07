import type { ComponentType } from 'react'

import * as f from 'fp-ts/function'
import { lazy, memo } from 'react'

import { promisedTask } from './fp'

export const createMemo = <T>(
  displayName: string,
  // eslint-disable-next-line functional/prefer-immutable-types
  component: ComponentType<T>,
) => {
  const memoized = Object.assign(memo(component), {
    displayName,
  })
  return memoized
}

export const createLazyMemo = <T>(
  displayName: string,
  promise: Promise<{ default: ComponentType<T> }>,
) => {
  const component = Object.assign(f.pipe(promise, promisedTask, lazy, memo), {
    displayName,
  })
  return component
}
