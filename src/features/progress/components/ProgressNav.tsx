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
import { range, split, flow, map, zip, nth } from 'lodash/fp'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'

import { saveProgressState } from '../reducers'
import ProgressNavLink from './ProgressNavLink'
import { just } from '@/lib/monads'
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
    console.log(allowedPaths)
    if (shouldNavigateToAllowed) {
      navigate(nth(-1)(allowedPaths) ?? '/')
    }
  }, [allowedPaths, navigate, shouldNavigateToAllowed])

  useEffect(() => {
    const classList = split(' ')(themeClasses)
    document.body.classList.add(...classList)

    return () => {
      document.body.classList.remove(...classList)
    }
  }, [themeClasses])

  useBeforeUnload(
    useCallback(() => {
      just(saveProgressState).pass()(dispatch)
    }, [dispatch]),
  )

  return (
    <div className={classes.root}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <ProgressNavBar />
      <div className={classes.linkContainer}>
        {flow(
          zip(range(0)(paths.length)),
          map<[number, string], JSX.Element>(([pos = -1, path = '']) => (
            <ProgressNavLink
              done={position >= pos}
              path={path}
              key={path}
              pos={pos}
            />
          )),
        )(paths)}
      </div>
    </div>
  )
}
