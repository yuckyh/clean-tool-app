import type {
  DependencyList,
  SetStateAction,
  EffectCallback,
  Dispatch,
} from 'react'
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

export const useEffectLog = (
  dep: ArrayElement<DependencyList>,
  ...args: [...unknown[]]
) => {
  useEffect(() => {
    console.trace(dep, ...args)
  }, [dep, args])
}

export const useLoadingTransition = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const setLoadingTransition: Dispatch<SetStateAction<boolean>> = useCallback(
    (isLoading) => {
      startTransition(() => {
        setIsLoading(isLoading)
      })
    },
    [],
  )

  return [isLoading || isPending, setLoadingTransition] as [
    boolean,
    Dispatch<SetStateAction<boolean>>,
  ]
}
