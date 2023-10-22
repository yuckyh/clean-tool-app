import {
  useThemeClassName,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import {
  useResolvedPath,
  useBeforeUnload,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { useCallback, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'

import * as O from 'fp-ts/Option'
import { constant, pipe } from 'fp-ts/function'
import * as RA from 'fp-ts/ReadonlyArray'
import * as S from 'fp-ts/string'
import * as IO from 'fp-ts/IO'
import { saveProgressState } from '../reducers'
import ProgressNavLink from './ProgressNavLink'
import {
  getShouldNavigateToAllowed,
  getAllowedPaths,
  getPosition,
  getPaths,
  getTitle,
} from '../selectors'
import ProgressNavBar from './ProgressNavBar'

const useClasses = makeStyles({
  root: {
    flexDirection: 'column',
    display: 'flex',
    ...shorthands.padding(tokens.spacingVerticalS, 0),
  },
  linkContainer: {
    justifyContent: 'space-between',
    display: 'flex',
    width: '100%',
  },
})

// eslint-disable-next-line functional/functional-parameters
export default function ProgressNav() {
  const classes = useClasses()

  const navigate = useNavigate()

  const dispatch = useAppDispatch()

  const { pathname: componentPath } = useResolvedPath('')
  const { pathname: locationPath } = useLocation()

  const params = useMemo(
    () => [componentPath, locationPath] as [string, string],
    [componentPath, locationPath],
  )

  const themeClasses = useThemeClassName()

  const paths = useAppSelector((state) => getPaths(state, componentPath))
  const allowedPaths = useAppSelector((state) =>
    getAllowedPaths(state, componentPath),
  )
  const position = useAppSelector((state) => getPosition(state, ...params))
  const title = useAppSelector((state) => getTitle(state, ...params))

  const shouldNavigateToAllowed = useAppSelector((state) =>
    getShouldNavigateToAllowed(state, ...params),
  )

  useEffect(() => {
    if (!shouldNavigateToAllowed) {
      return
    }

    navigate(
      pipe(allowedPaths, RA.lookup(-1), pipe('/', constant, O.getOrElse)),
    )
  }, [allowedPaths, navigate, shouldNavigateToAllowed])

  useEffect(() => {
    const classList = S.split(' ')(themeClasses)
    document.body.classList.add(...classList)

    // eslint-disable-next-line functional/functional-parameters
    return () => {
      document.body.classList.remove(...classList)
    }
  }, [themeClasses])

  useBeforeUnload(
    useCallback(() => {
      return pipe(saveProgressState(), (x) => dispatch(x), IO.of)()
    }, [dispatch]),
  )

  return (
    <div className={classes.root}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <ProgressNavBar />
      <div className={classes.linkContainer}>
        {pipe(
          paths,
          RA.mapWithIndex((pos, path) => (
            <ProgressNavLink
              done={position >= pos}
              path={path}
              key={path}
              pos={pos}
            />
          )),
        )}
      </div>
    </div>
  )
}
