/**
 * @file This file contains the utilities for the app.
 */

import type { ComponentType } from 'react'

import * as f from 'fp-ts/function'
import { lazy, memo } from 'react'

import { asTask, promisedTask } from './fp'

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

/**
 * A helper function to import a component lazily from its default export.
 * @public
 * @template T - The component's prop type.
 * @param promise - A promise that resolves the default export of the component.
 * @returns A {@link https://gcanti.github.io/fp-ts/modules/Task.ts.html `Task`} that resolves the default export of the component which can be used by the {@link https://reactrouter.com/en/main/route/lazy `lazy`} property for a {@link https://reactrouter.com/en/main/route/route `route`}.
 * @example To create a lazy import for the home page a route will be declared as such:
 * ```tsx
 * <Route index lazy={defaultLazyComponent(import('@/pages'))} />
 * ```
 */
export const defaultLazyComponent = <T>(
  promise: Promise<{ default: React.ComponentType<T> }>,
) =>
  asTask(async () => ({
    Component: (await promise).default,
  }))

export const promisedWorker = <
  Req extends WorkerRequest,
  Res extends WorkerResponse<string>,
>(
  type: keyof Omit<GenericWorkerEventMap<Res>, 'error'>,
  worker: Readonly<RequestWorker<Req, Res>>,
  options: AddEventListenerOptions = { once: true },
) =>
  new Promise<GenericWorkerEventMap<Res>[typeof type]>((resolve, reject) => {
    worker.addEventListener(
      type,
      (event) => {
        if (event.data.status === 'fail') {
          reject(event)
          return
        }

        resolve(event)
      },
      options,
    )

    worker.addEventListener(
      'error',
      (event) => {
        reject(event)
      },
      options,
    )
  })
