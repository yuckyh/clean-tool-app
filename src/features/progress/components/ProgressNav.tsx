import type { ProgressBarProps } from '@fluentui/react-components'

import {
  useThemeClassName,
  mergeClasses,
  ProgressBar,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import {
  useResolvedPath,
  useBeforeUnload,
  matchRoutes,
  resolvePath,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { useCallback, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { getPathTitle } from '@/lib/string'
import { toObject } from '@/lib/array'
import { routes } from '@/app/Router'

import { saveProgressState, type Progress } from '../reducers'
import ProgressNavLink from './ProgressNavLink'

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
  progressBar: {
    width: '80%',
    ...shorthands.margin(0, 'auto'),
  },
  // Animation hack for initial progress bar
  progressBarInitial: {
    width: '81%',
  },
})

export const ProgressNav = (props: ProgressBarProps) => {
  const classes = useClasses()

  const navigate = useNavigate()

  const dispatch = useAppDispatch()

  const { progress } = useAppSelector(({ progress }) => progress)

  const { pathname: componentPath } = useResolvedPath('')
  const { pathname: locationPath } = useLocation()

  const title = useMemo(
    () => getPathTitle(locationPath, locationPath.includes('eda/') ? 2 : 0),
    [locationPath],
  )

  const themeClasses = useThemeClassName()

  const componentPathDepth = useMemo(
    () => componentPath.split('/').length - 1,
    [componentPath],
  )

  const pathList = useMemo(
    () =>
      matchRoutes(routes, componentPath)
        ?.find(({ route }) => !route.index)
        ?.route.children?.find(({ index }) => !index)
        ?.children?.map(({ path = '' }) =>
          resolvePath(path).pathname.toLowerCase(),
        ) ?? [],
    [componentPath],
  )

  const allowedPaths = useMemo(
    () =>
      toObject(
        ['none', 'uploaded', 'matched', 'explored'] as Progress[],
        (i) => [...pathList.slice(0, i + 2)],
      )[progress] ?? [],
    [pathList, progress],
  )

  const position = useMemo(
    () =>
      pathList.findIndex(
        (path) =>
          path.replace('/', '') === locationPath.split('/')[componentPathDepth],
      ),
    [componentPathDepth, locationPath, pathList],
  )

  // Ternary expression for animation hack
  const progressValue = useMemo(
    () => position / (pathList.length - 1) || 0.011,
    [pathList.length, position],
  )

  useEffect(() => {
    if (
      locationPath !== '/' &&
      !allowedPaths.some((path) =>
        locationPath.split('/').splice(1).includes(path.replace('/', '')),
      )
    ) {
      navigate(allowedPaths.at(-1) ?? '/')
    }
  }, [allowedPaths, locationPath, navigate])

  useEffect(() => {
    const classList = themeClasses.split(' ')
    document.body.classList.add(...classList)

    return () => {
      document.body.classList.remove(...classList)
    }
  })

  useBeforeUnload(
    useCallback(() => {
      dispatch(saveProgressState())
    }, [dispatch]),
  )

  return (
    <div className={classes.root}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <ProgressBar
        className={mergeClasses(
          classes.progressBar,
          position == 0 && classes.progressBarInitial,
        )}
        title="Progress Bar Navigation"
        value={progressValue}
        max={1}
        {...props}
      />
      <div className={classes.linkContainer}>
        {pathList.map((path, i) => (
          <ProgressNavLink
            disabled={!allowedPaths.includes(path)}
            done={position >= i}
            path={path}
            key={i}
          />
        ))}
      </div>
    </div>
  )
}

export default ProgressNav
