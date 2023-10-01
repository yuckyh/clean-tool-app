import type { ProgressBarProps } from '@fluentui/react-components'

import { routes } from '@/app/Router'
import { toObject } from '@/lib/array'
import { useAppSelector } from '@/lib/hooks'
import { usePathTitle } from '@/lib/string'
import {
  Link,
  ProgressBar,
  Subtitle2,
  Subtitle2Stronger,
  makeStyles,
  mergeClasses,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import {
  matchRoutes,
  resolvePath,
  useHref,
  useLinkClickHandler,
  useLocation,
  useNavigate,
  useResolvedPath,
} from 'react-router-dom'

import type { Progress } from '../features/progressSlice'

const useClasses = makeStyles({
  linkContainer: {
    display: 'flex',
    justifyContent: 'space-between',
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
  root: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.padding(tokens.spacingVerticalS, 0),
  },
})

const ProgressNav = (props: ProgressBarProps) => {
  const navigate = useNavigate()

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

  return (
    <div className={classes.root}>
      <ProgressBar
        className={mergeClasses(
          classes.progressBar,
          position == 0 && classes.progressBarInitial,
        )}
        max={1}
        title="Progress Bar Navigation"
        value={progressValue}
        {...props}
      />
      <div className={classes.linkContainer}>
        {pathList.map((path, i) => (
          <ProgressNavLink
            disabled={!allowedPaths.includes(path)}
            done={position >= i}
            key={i}
            path={path}
          />
        ))}
      </div>
    </div>
  )
}

const useLinkClasses = makeStyles({
  activeStepThumb: {
    backgroundColor: tokens.colorCompoundBrandBackground,
  },
  link: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  root: {
    display: 'flex',
    justifyContent: 'center',
    ...shorthands.flex(1),
  },
  stepThumb: {
    backgroundColor: tokens.colorNeutralBackground6,
    height: '20px',
    position: 'relative',
    top: '-12px',
    width: '20px',
    ...shorthands.borderRadius(tokens.borderRadiusCircular),
    ...shorthands.transition('background-color', '0.2s', '0s', 'ease-in-out'),
  },
})

interface LinkLabelProps {
  disabled: boolean
  done: boolean
  path: string
}

const ProgressNavLink = ({ disabled, done, path }: LinkLabelProps) => {
  const label = usePathTitle(path)
  const classes = useLinkClasses()
  const href = useHref(disabled ? '#' : path)
  const isActive = href === path
  const handleLinkClick = useLinkClickHandler(href)

  return (
    <div className={classes.root}>
      <Link
        appearance="subtle"
        className={classes.link}
        disabled={disabled}
        onClick={handleLinkClick}>
        <>
          <div
            className={mergeClasses(
              classes.stepThumb,
              done ? classes.activeStepThumb : '',
            )}
          />
          {isActive ? (
            <Subtitle2Stronger>{label}</Subtitle2Stronger>
          ) : (
            <Subtitle2>{label}</Subtitle2>
          )}
        </>
      </Link>
    </div>
  )
}

export default ProgressNav
