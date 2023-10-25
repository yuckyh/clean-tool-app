import type { AppDispatch, RootState } from '@/app/store'
import type { Flag, FlagReason } from '@/features/sheet/reducers'
import type { ColorTokens, DataGridProps } from '@fluentui/react-components'
import type { TypedUseSelectorHook } from 'react-redux'

import globalStyles from '@/app/global.css?inline'
import { syncFlaggedCells } from '@/features/sheet/reducers'
import {
  getFlaggedRows,
  getIndexedRowMissings,
} from '@/features/sheet/selectors'
import { getIndexedIndex } from '@/lib/array'
import {
  makeStaticStyles,
  useThemeClassName,
  webDarkTheme,
  webLightTheme,
} from '@fluentui/react-components'
import * as IO from 'fp-ts/IO'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RS from 'fp-ts/ReadonlySet'
import * as T from 'fp-ts/Task'
import * as TO from 'fp-ts/TaskOption'
import * as f from 'fp-ts/function'
import * as S from 'fp-ts/string'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  useTransition,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { asIO, promisedTask, promisedTaskOption } from './fp'
import { dumpError, ioDumpTrace } from './logger'

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
    f.pipe(
      promisedTask(navigator.storage.persisted()),
      T.flatMap((persisted) =>
        persisted ? TO.none : promisedTaskOption(navigator.storage.persist()),
      ),
      TO.flatMapIO(ioDumpTrace),
    )().catch(dumpError)
  }, [])
}

export const useGlobalStyles = makeStaticStyles(globalStyles)

export const useSyncedSelectionHandler = (
  reason: FlagReason,
  title: string,
  series: readonly (readonly [string, number | string])[],
) => {
  const dispatch = useAppDispatch()

  const flaggedRows = useAppSelector((state) =>
    getFlaggedRows(state, title, reason),
  )

  const indices = useMemo(
    () => f.pipe(series, RA.map(getIndexedIndex)),
    [series],
  )

  return useCallback<Required<DataGridProps>['onSelectionChange']>(
    (_1, { selectedItems }) => {
      const shouldAdd = flaggedRows.size < selectedItems.size

      const subtractor = (
        shouldAdd ? selectedItems : flaggedRows
      ) as ReadonlySet<string>

      const subtractee = (
        shouldAdd ? flaggedRows : selectedItems
      ) as ReadonlySet<string>

      const checkedPosList = f.pipe(
        subtractor,
        RS.difference(S.Eq)(subtractee),
        RS.toReadonlyArray(S.Ord),
        RA.filter((checkedPos) => RA.elem(S.Eq)(checkedPos)(indices)),
      )

      const payloads = f.pipe(
        checkedPosList,
        RA.map((currentIndex) => [currentIndex, title, reason] as Flag),
      )

      const unfilteredPayloads = f.pipe(
        checkedPosList,
        RA.map((currentIndex) => [currentIndex, title, 'outlier'] as Flag),
      )

      return f.pipe(
        [...payloads, ...unfilteredPayloads] as const,
        RA.map(f.flow(syncFlaggedCells, (x) => dispatch(x), IO.of)),
        IO.sequenceArray,
      )()
    },
    [dispatch, flaggedRows, indices, reason, title],
  )
}
