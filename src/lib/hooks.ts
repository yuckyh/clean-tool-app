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
import * as IO from 'fp-ts/IO'
import { constant, identity, flow, pipe } from 'fp-ts/function'
import * as TO from 'fp-ts/TaskOption'
import * as O from 'fp-ts/Option'
import * as T from 'fp-ts/Task'
import { ioDumpTrace, dumpError, dumpTrace } from './logger'
import { promisedTaskOption, promisedTask, asIO } from './fp'

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

  const stopLoading = useMemo(
    () =>
      pipe(
        startTransition,
        IO.of,
        IO.flap(() => {
          setIsLoading(false)
        }),
      ),
    [],
  )

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
      return asIO(() => {
        themeMedia.removeEventListener('change', cb)
      })
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
        token.slice(4, token.length - 1),
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
      promisedTask(navigator.storage.persisted()),
      T.flatMap((persisted) =>
        persisted ? TO.none : promisedTaskOption(navigator.storage.persist()),
      ),
      TO.flatMapIO(ioDumpTrace),
    )().catch(dumpError)
  }, [])
}

export const useGlobalStyles = makeStaticStyles(globalStyles)
