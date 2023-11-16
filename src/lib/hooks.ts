import type { AppDispatch, AppState } from '@/app/store'
import type { ColorTokens, DataGridProps } from '@fluentui/react-components'
import type { TypedUseSelectorHook } from 'react-redux'

import globalStyles from '@/app/global.css?inline'
import { syncFlaggedCells } from '@/reducers/data'
import { getIndexedIndex } from '@/lib/array'
import { getFlaggedRows } from '@/selectors/data/rows'
import {
  makeStaticStyles,
  useThemeClassName,
  webDarkTheme,
  webLightTheme,
} from '@fluentui/react-components'
import * as IO from 'fp-ts/IO'
import * as O from 'fp-ts/Option'
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

import { asIO } from './fp'
import * as Flag from './fp/Flag'
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

/**
 *
 * @param title
 * @param reason
 * @returns
 * @example
 */
const selectFlaggedRows =
  (title: string, reason: Flag.FlagReason) => (state: AppState) =>
    getFlaggedRows(state, title, reason)

/**
 *
 * @param reason
 * @param title
 * @param series
 * @returns
 * @example
 */
export const useSyncedSelectionHandler = (
  reason: Flag.FlagReason,
  title: string,
  series: readonly (readonly [string, number | string])[],
) => {
  const dispatch = useAppDispatch()

  const flaggedRows = useAppSelector(selectFlaggedRows(title, reason))

  const indices = useMemo(() => RA.map(getIndexedIndex)(series), [series])

  return useCallback<Required<DataGridProps>['onSelectionChange']>(
    (_event, { selectedItems }) => {
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
        RA.map((currentIndex) => Flag.of(currentIndex, title, reason)),
      )

      const unfilteredPayloads = f.pipe(
        checkedPosList,
        RA.map((currentIndex) => Flag.of(currentIndex, title, 'outlier')),
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
