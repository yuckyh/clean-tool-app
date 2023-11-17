import type { AppDispatch, AppState } from '@/app/store'
import type { ColorTokens } from '@fluentui/react-components'
import type { TypedUseSelectorHook } from 'react-redux'

import { useThemeClassName } from '@fluentui/react-components'
import * as IO from 'fp-ts/IO'
import * as f from 'fp-ts/function'
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { asIO } from './fp'

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector

export const useDebounced = <T>(value: T, delay = 100) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
  }, [delay, value])

  return debouncedValue
}

export const useLoadingTransition = asIO(() => {
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const stopLoading = useMemo(
    () =>
      f.pipe(
        startTransition,
        IO.of,
        IO.flap(() => {
          setIsLoading(false)
        }),
      ),
    [],
  )

  return [isLoading || isPending, stopLoading] as const
})

/**
 *
 * @param token
 * @example
 */
export const useTokenToHex = (token: Property<ColorTokens>) => {
  const [color, setColor] = useState('#000')

  const themeClasses = useThemeClassName()

  const tokenToHex = useCallback(
    () =>
      getComputedStyle(document.body).getPropertyValue(
        token.slice(4, token.length - 1),
      ),
    [token],
  )

  useEffect(() => {
    setColor(tokenToHex())
  }, [themeClasses, tokenToHex])

  return color
}
