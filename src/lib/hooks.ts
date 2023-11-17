import type { AppDispatch, AppState } from '@/app/store'
import type { ColorTokens } from '@fluentui/react-components'
import type { TypedUseSelectorHook } from 'react-redux'

import globalStyles from '@/app/global.css?inline'
import {
  makeStaticStyles,
  useThemeClassName,
  webDarkTheme,
  webLightTheme,
} from '@fluentui/react-components'
import * as IO from 'fp-ts/IO'
import * as O from 'fp-ts/Option'
import * as T from 'fp-ts/Task'
import * as TO from 'fp-ts/TaskOption'
import * as f from 'fp-ts/function'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  useTransition,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { asIO } from './fp'
import { dumpError } from './fp/logger'

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
 * @param dark
 * @param light
 * @example
 */
export const useThemePreference = (
  dark = webDarkTheme,
  light = webLightTheme,
) => {
  const themeMedia = useMemo(
    () => matchMedia('(prefers-color-scheme: dark)'),
    [],
  )

  const theme = useSyncExternalStore(
    (cb) => {
      themeMedia.addEventListener('change', cb)
      return asIO(() => {
        themeMedia.removeEventListener('change', cb)
      })
    },
    () => themeMedia.matches,
  )

  return theme ? dark : light
}

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

/**
 * @returns
 * @example
 */

export const useStorage = () => {
  useEffect(() => {
    f.pipe(
      () => navigator.storage.persisted(),
      T.map(f.flow(f.constant, O.fromPredicate)),
      TO.fromTask,
      TO.map(() => navigator.storage.persist()),
    )().catch(dumpError)
  }, [])
}

export const useGlobalStyles = makeStaticStyles(globalStyles)
