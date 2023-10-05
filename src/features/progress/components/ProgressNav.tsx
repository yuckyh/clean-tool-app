import type { ProgressBarProps } from '@fluentui/react-components'

import {
  mergeClasses,
  ProgressBar,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import {
  useResolvedPath,
  matchRoutes,
  resolvePath,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { toObject } from '@/lib/array'
import { routes } from '@/app/Router'
import { useEffect } from 'react'

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
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { progress } = useAppSelector(({ progress }) => progress)

  const { pathname: componentPath } = useResolvedPath('')
  const { pathname: locationPath } = useLocation()

  const classes = useClasses()

  const componentPathDepth = componentPath.split('/').length

  const pathList =
    matchRoutes(routes, componentPath)
      ?.find(({ route }) => !route.index)
      ?.route.children.map(({ path }) => resolvePath(path ?? '').pathname) ?? []

  const allowedPaths =
    toObject(['none', 'uploaded', 'matched', 'explored'] as Progress[], (i) => [
      ...pathList.slice(0, i + 2),
    ])[progress] ?? []

  const position = pathList.findIndex(
    (path) =>
      path.replace('/', '') === locationPath.split('/')[componentPathDepth - 1],
  )

  // Ternary expression for animation hack
  const progressValue = position / (pathList.length - 1) || 0.011

  if (
    locationPath !== '/' &&
    !allowedPaths.some((path) =>
      locationPath.split('/').includes(path.replace('/', '')),
    )
  ) {
    navigate(allowedPaths.at(-1) ?? '/')
  }

  useEffect(() => {
    const handleUnload = () => {
      dispatch(saveProgressState())
    }

    window.addEventListener('unload', handleUnload)

    return () => {
      window.removeEventListener('unload', handleUnload)
    }
  }, [dispatch])

  return (
    <div className={classes.root}>
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
