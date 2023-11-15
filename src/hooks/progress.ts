/**
 * @file This file containse the hooks for the progress navigation component.
 * @module components/progress/ProgressNav/hooks
 */

/* eslint-disable
  functional/functional-parameters
*/
import type { AppDispatch } from '@/app/store'

import {
  selectAllowedPaths,
  selectShouldNavigateToAllowed,
} from '@/components/progress/ProgressNav/selectors'
import { saveMatchesState } from '@/features/data/reducers'
import { saveSheetState } from '@/features/sheet/reducers'
import { tail } from '@/lib/array'
import { asIO, equals } from '@/lib/fp'
import { refinedEq } from '@/lib/fp/Eq'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { saveProgressState } from '@/reducers/progress'
import { useThemeClassName } from '@fluentui/react-components'
import * as IO from 'fp-ts/IO'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'
import * as S from 'fp-ts/string'
import { useCallback, useEffect } from 'react'
import {
  useBeforeUnload,
  useLocation,
  useNavigate,
  useNavigation,
  useResolvedPath,
} from 'react-router-dom'

/**
 * The function to save the current app state.
 * @param dispatch - The app dispatch.
 * @returns The IO action.
 * @example
 * ```tsx
 *    const dispatch = useAppDispatch()
 *    const saveStates = useCallback(() => saveStates(dispatch), [dispatch])
 * ```
 */
export const saveStates = (dispatch: AppDispatch) =>
  f.pipe(
    [saveSheetState, saveMatchesState, saveProgressState] as const,
    RA.map(f.flow((x) => dispatch(x()), IO.of)),
    IO.sequenceArray,
  )

/**
 * This hook saves the current app state when the user reloads or closes the page.
 * @example
 * ```tsx
 *    useUnloadSaveState()
 * ```
 */
export const useUnloadSaveState = () => {
  const dispatch = useAppDispatch()

  useBeforeUnload(
    useCallback(() => {
      saveStates(dispatch)
    }, [dispatch]),
  )
}
/**
 * This hook saves the current app state when the user navigates away from the current progress navigation.
 * @example
 * ```tsx
 *    useRedirectSaveState()
 * ```
 */
export const useRedirectSaveState = () => {
  const dispatch = useAppDispatch()
  const { state: navState } = useNavigation()

  useEffect(() => {
    f.pipe(
      S.Eq,
      refinedEq,
      equals,
      f.apply('loading' as typeof navState),
      O.fromPredicate<typeof navState>,
      f.apply(navState),
      O.map(saveStates(dispatch)),
    )
  }, [dispatch, navState])
}
/**
 * This hook adds the theme class names to the body element.
 * @example
 * ```tsx
 *    useBodyThemeContext()
 * ```
 */
export const useBodyThemeContext = () => {
  const themeClasses = useThemeClassName()

  useEffect(() => {
    const classList = S.split(' ')(themeClasses)
    document.body.classList.add(...classList)

    return asIO(() => {
      document.body.classList.remove(...classList)
    })
  }, [themeClasses])
}
/**
 * This hook navigates the user to the allowed path if the current path is not allowed.
 * @example
 * ```ts
 *    useNavigateMiddleware()
 * ```
 */
export const useNavigateMiddleware = () => {
  const navigate = useNavigate()

  const { pathname: componentPath } = useResolvedPath('')
  const { pathname: locationPath } = useLocation()

  const allowedPaths = useAppSelector(selectAllowedPaths(componentPath))
  const shouldNavigateToAllowed = useAppSelector(
    selectShouldNavigateToAllowed(componentPath, locationPath),
  )

  useEffect(() => {
    if (!shouldNavigateToAllowed) {
      return
    }

    navigate(tail(allowedPaths)('/'))
  }, [allowedPaths, navigate, shouldNavigateToAllowed])
}
