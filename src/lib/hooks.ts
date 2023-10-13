import type { TypedUseSelectorHook } from 'react-redux'

import {
  useSyncExternalStore,
  useTransition,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { ColorTokens } from '@fluentui/react-components'
import {
  useThemeClassName,
  makeStaticStyles,
  webLightTheme,
  webDarkTheme,
} from '@fluentui/react-components'
import type { AppDispatch, RootState } from '@/app/store'
import globalStyles from '@/app/global.css?inline'

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

export const useLoadingTransition = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const stopLoading = useCallback(() => {
    startTransition(() => {
      setIsLoading(false)
    })
  }, [])

  return [isLoading || isPending, stopLoading] as const
}

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
      return () => {
        themeMedia.removeEventListener('change', cb)
      }
    },
    () => themeMedia.matches,
  )

  return theme ? dark : light
}

export const useTokenToHex = (token: Property<ColorTokens>) => {
  const [color, setColor] = useState('#000')

  const themeClasses = useThemeClassName()

  const tokenToHex = useCallback(
    () =>
      getComputedStyle(document.body).getPropertyValue(
        token.substring(4, token.length - 1),
      ),
    [token],
  )

  useEffect(() => {
    setColor(tokenToHex())
  }, [themeClasses, tokenToHex])

  return color
}

export const useStorage = () => {
  useEffect(() => {
    navigator.storage
      .persisted()
      .then((persisted) => persisted && navigator.storage.persist())
      .catch(console.error)
  }, [])
}

export const useGlobalStyles = makeStaticStyles(globalStyles)
