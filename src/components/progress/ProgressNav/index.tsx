/* eslint-disable
  functional/functional-parameters
*/
import { saveColumnState } from '@/features/columns/reducers'
import { saveSheetState } from '@/features/sheet/reducers'
import { tail } from '@/lib/array'
import { asIO, equals, refinedEq } from '@/lib/fp'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import {
  makeStyles,
  shorthands,
  tokens,
  useThemeClassName,
} from '@fluentui/react-components'
import * as IO from 'fp-ts/IO'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'
import * as S from 'fp-ts/string'
import { useCallback, useEffect, useMemo } from 'react'
import {
  useBeforeUnload,
  useLocation,
  useNavigate,
  useNavigation,
  useResolvedPath,
} from 'react-router-dom'

import { saveProgressState } from '../../../features/progress/reducers'
import {
  getAllowedPaths,
  getPaths,
  getPosition,
  getShouldNavigateToAllowed,
} from '../../../features/progress/selectors'
import ProgressNavBar from '../ProgressNavBar'
import ProgressNavLink from '../ProgressNavLink'
import ProgressNavPageTitle from './PageTitle'

const useClasses = makeStyles({
  linkContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.padding(tokens.spacingVerticalS, 0),
  },
})

const useUnloadSaveState = () => {
  const dispatch = useAppDispatch()

  useBeforeUnload(
    useCallback(
      () =>
        f.pipe(
          [saveSheetState, saveColumnState, saveProgressState] as const,
          RA.map(f.flow((x) => dispatch(x()), IO.of)),
          IO.sequenceArray,
        )(),
      [dispatch],
    ),
  )
}

/**
 * The progress navigation component
 *
 * This components is used as the main navigation with the functionality of showing the user's progress
 * @see {@link ProgressNavBar} for details on the bar's functionality
 * @category Component
 * @group Progress slice
 * @returns The component object
 * @example
 */
export default function ProgressNav() {
  const classes = useClasses()

  const navigate = useNavigate()
  const { state: navState } = useNavigation()

  const dispatch = useAppDispatch()

  const { pathname: componentPath } = useResolvedPath('')
  const { pathname: locationPath } = useLocation()

  const params = useMemo(
    () => [componentPath, locationPath] as const,
    [componentPath, locationPath],
  )

  const themeClasses = useThemeClassName()

  const paths = useAppSelector((state) => getPaths(state, componentPath))
  const allowedPaths = useAppSelector((state) =>
    getAllowedPaths(state, componentPath),
  )
  const position = useAppSelector((state) => getPosition(state, ...params))
  const shouldNavigateToAllowed = useAppSelector((state) =>
    getShouldNavigateToAllowed(state, ...params),
  )

  useEffect(() => {
    if (!shouldNavigateToAllowed) {
      return
    }

    navigate(tail(allowedPaths)('/'))
  }, [allowedPaths, navigate, shouldNavigateToAllowed])

  useEffect(() => {
    const classList = S.split(' ')(themeClasses)
    document.body.classList.add(...classList)

    return asIO(() => {
      document.body.classList.remove(...classList)
    })
  }, [themeClasses])

  useEffect(() => {
    f.pipe(
      S.Eq,
      refinedEq,
      equals,
      f.apply('loading' as typeof navState),
      O.fromPredicate<typeof navState>,
      f.apply(navState),
      O.map(
        f.flow(
          () => [saveSheetState, saveColumnState, saveProgressState] as const,
          IO.traverseArray(f.flow((x) => dispatch(x()), IO.of)),
          (x) => x(),
        ),
      ),
    )
  }, [dispatch, navState])

  useUnloadSaveState()

  return (
    <div className={classes.root}>
      <ProgressNavPageTitle
        componentPath={componentPath}
        locationPath={locationPath}
      />
      <ProgressNavBar />
      <div className={classes.linkContainer}>
        {f.pipe(
          paths,
          RA.mapWithIndex((pos, path) => (
            <ProgressNavLink
              done={position >= pos}
              key={path}
              path={path}
              pos={pos}
            />
          )),
        )}
      </div>
    </div>
  )
}
