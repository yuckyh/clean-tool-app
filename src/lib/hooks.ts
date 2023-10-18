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
import type { IO } from 'fp-ts/IO'
import { of } from 'fp-ts/IO'
import { pipe } from 'fp-ts/function'
import { console } from 'fp-ts'
import TO from 'fp-ts/TaskOption'
import Task from 'fp-ts/Task'

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

// eslint-disable-next-line functional/functional-parameters
export const useLoadingTransition = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const stopLoading = useCallback(() => {
    pipe(startTransition, () => {
      setIsLoading(false)
      return undefined
    })
  }, [])

  return [isLoading || isPending, stopLoading as IO<undefined>] as const
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
      return of(() => {
        themeMedia.removeEventListener('change', cb)
        return undefined
      })()
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

// eslint-disable-next-line functional/functional-parameters
export const useStorage = () => {
  useEffect(() => {
    pipe(
      TO.fromTask(() => navigator.storage.persisted()),
      TO.flatMap((persisted) =>
        persisted ? TO.none : TO.fromTask(() => navigator.storage.persist()),
      ),
      TO.getOrElse(() => Task.of(false)),
    )().catch(console.error)
  }, [])
}

export const useGlobalStyles = makeStaticStyles(globalStyles)
