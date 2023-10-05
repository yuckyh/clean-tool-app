import type { AppDispatch, RootState } from '@/app/store'
import type { TypedUseSelectorHook } from 'react-redux'

import { useTransition, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useDebounced = <T>(value: T, delay = 100) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
  }, [delay, value])

  return debouncedValue
}

interface Ref<T> {
  current?: T
}

export const waitForValue = <T>(
  ref: Ref<T>,
  intervalMs = 50,
  timeoutMs = 2000,
) => {
  let elapsedTime = 0

  const checkValue = () => {
    if (ref.current !== undefined) {
      return
    }

    elapsedTime += intervalMs

    if (elapsedTime >= timeoutMs) {
      return
    }

    setTimeout(checkValue, intervalMs)
  }

  setTimeout(checkValue, intervalMs)
}

export const useAsyncEffect = (
  effect: () => Promise<ReturnType<React.EffectCallback>>,
  deps: React.DependencyList = [],
) => {
  useEffect(
    () => {
      let cleanup: ReturnType<React.EffectCallback> | undefined

      const ref: Ref<typeof cleanup> = {}

      void (async () => {
        ref.current = await effect()
      })()

      waitForValue(ref)

      return () => {
        ref.current?.()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps,
  )
}

export const useAsyncCallback = <T, K extends unknown[]>(
  callback: (...args: K) => Promise<T>,
  deps: React.DependencyList = [],
) =>
  useCallback((...args: Parameters<typeof callback>) => {
    const ref: Ref<T> = {}
    void (async () => {
      ref.current = await callback(...args)
    })()

    waitForValue(ref)

    return ref.current
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

export const useEffectLog = (dep: ArrayElement<React.DependencyList>) => {
  useEffect(() => {
    console.trace(dep)
  }, [dep])
}

export const useLoadingTransition = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const setLoadingTransition: React.Dispatch<React.SetStateAction<boolean>> = (
    isLoading,
  ) => {
    startTransition(() => {
      setIsLoading(isLoading)
    })
  }

  return [isLoading || isPending, setLoadingTransition] as [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>,
  ]
}
