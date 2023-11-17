/**
 * @file This file contains the custom hooks for the app.
 * @module lib/hooks
 */

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

/**
 * This hook is used to create a debounced value.
 * @param value - The value to debounce
 * @param delay - The delay in milliseconds
 * @returns The debounced value
 * @example
 *  const debouncedValue = useDebounced(value, delay)
 */
export const useDebounced = <T>(value: T, delay = 100) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
  }, [delay, value])

  return debouncedValue
}

/**
 * This hook is used to help loading transitions.
 * @returns The loading transition
 * @example
 *  const [isLoading, stopLoading] = useLoadingTransition()
 */
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
 * This hook is used to create a hex color from a token.
 * @param token - The token to convert
 * @returns The hex color
 * @example
 *  const color = useTokenToHex(token)
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
