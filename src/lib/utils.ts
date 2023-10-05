import type { ComponentType } from 'react'

import { lazy, memo } from 'react'

export const getPersisted = <T extends string, K extends string>(
  key: K,
  defaultValue: T,
): T => {
  return (localStorage.getItem(key) ?? defaultValue) as T
}

export const setPersisted = <T extends string, K extends string>(
  key: K,
  value: T,
) => {
  localStorage.setItem(key, value)
}

export const promisedWorker = <
  Req extends WorkerRequest,
  Res extends WorkerResponse,
>(
  type: keyof Omit<GenericWorkerEventMap<Res>, 'error'>,
  worker: RequestWorker<Req, Res>,
  options: AddEventListenerOptions = { once: true },
) =>
  new Promise<GenericWorkerEventMap<Res>[typeof type]>((resolve, reject) => {
    worker.addEventListener(
      type,
      (event) => {
        if (event.data.status === 'fail') {
          reject(event)
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

export const dump = <T>(value: T) => {
  console.log(value)
  return value
}

export const createLazyMemo = <T>(
  displayName: string,
  factory: () => Promise<{ default: ComponentType<T> }>,
) => {
  const component = memo(lazy(factory))
  component.displayName = displayName
  return component
}

// Higher-order functions

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

export const just = <T>(value: T) => {
  const monad = (<U>(fn?: (value: T) => U) =>
    fn ? just(fn(value)) : value) as JustMonad<T>

  monad.convert = (converter) =>
    Array.isArray(value) ? converter(value as IsArray<T>) : converter(value)

  return monad
}

export const list = <T extends AnyArray>(value: T) => {
  const monad = (<V extends IsArray<W>, W>(
    fn?: <U extends AnyArray>(
      value: ArrayElement<U>,
      index: number,
      array: U,
    ) => W,
  ) => (fn ? list(value.map(fn) as V) : value)) as ListMonad<T>

  monad.convert = (converter) => converter(value)

  return monad
}
