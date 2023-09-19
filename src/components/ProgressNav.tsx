import type {
  LinkProps,
  LinkSlots,
  LinkState,
  ProgressBarProps,
} from '@fluentui/react-components'

import { routes } from '@/Router'
import {
  useAppDispatch,
  useAppSelector,
  useFluentStyledState,
  usePathTitle,
} from '@/lib/hooks'
import { setPosition } from '@/store/progressSlice'
import {
  ProgressBar,
  Subtitle2,
  Subtitle2Stronger,
  makeStyles,
  mergeClasses,
  shorthands,
  tokens,
  useLink_unstable,
  useLinkStyles_unstable,
} from '@fluentui/react-components'
import { useEffect, useRef } from 'react'
import {
  NavLink,
  matchRoutes,
  resolvePath,
  useHref,
  useLocation,
  useNavigate,
  useResolvedPath,
} from 'react-router-dom'

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

const useChildPaths = (parentPath: string, exclusion?: string) =>
  matchRoutes(routes, parentPath)
    ?.filter(({ route }) => route.children)
    .map(({ route }) => route.children)
    .pop()
    ?.filter(
      ({ path }) => resolvePath(path ?? parentPath).pathname !== exclusion,
    )
    .map(({ path }) => resolvePath(path ?? '').pathname) ?? []

const ProgressNav = (props: ProgressBarProps) => {
  const classes = useClasses()
  const componentPath = useResolvedPath('')
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const childPaths = useChildPaths(componentPath.pathname)
  const ref = useRef<HTMLDivElement | null>(null)

  const index = childPaths.findIndex(
    (path) => path.replace('/', '') === pathname.split('/')[1],
  )

  const allowedChildPaths = childPaths.map((pathname) => ({
    pathname,
  }))

  const { allowedPaths, position } = useAppSelector(({ progress }) => progress)

  // Ternary expression for animation hack
  const progress = position == 0 ? 0.011 : position / (childPaths.length - 1)

  useEffect(() => {
    dispatch(
      setPosition(
        childPaths.findIndex(
          (path) => path.replace('/', '') === pathname.split('/')[1],
        ),
      ),
    )
  }, [childPaths, dispatch, pathname])

  useEffect(() => {
    if (
      pathname !== '/' &&
      !allowedPaths
        .map((path) => pathname.includes(path.substring(1)))
        .slice(1)
        .includes(true)
    ) {
      navigate(allowedPaths[allowedPaths.length - 1] ?? '/')
    }
  }, [allowedPaths, index, navigate, pathname])

  const progressBar = (
    <ProgressBar
      className={mergeClasses(
        classes.progressBar,
        index == 0 && classes.progressBarInitial,
      )}
      max={1}
      ref={ref}
      title="Progress Bar Navigation"
      value={progress}
      {...props}
    />
  )

  return (
    <div className={classes.root}>
      {progressBar}
      <div className={classes.linkContainer}>
        {allowedChildPaths.map(({ pathname }, i) => (
          <ProgressNavLink done={index >= i} key={i} path={pathname} />
        ))}
      </div>
    </div>
  )
}

interface LinkLabelProps {
  done: boolean
  path: string
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

const ProgressNavLink = ({ done, path }: LinkLabelProps) => {
  const href = useHref(path)
  const label = usePathTitle(path)
  const classes = useLinkClasses()

  const { allowedPaths } = useAppSelector(({ progress }) => progress)

  const disabled = !allowedPaths.includes(path)

  const fluentLinkComponent = useFluentStyledState<
    LinkProps,
    LinkState,
    LinkSlots,
    HTMLAnchorElement
  >(
    { appearance: 'subtle', disabled },
    useLinkStyles_unstable,
    useLink_unstable,
  )

  return (
    <div className={classes.root}>
      <NavLink
        className={mergeClasses(
          fluentLinkComponent.root.className,
          classes.link,
        )}
        to={disabled ? '#' : href}>
        {({ isActive }) => (
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
        )}
      </NavLink>
    </div>
  )
}

export default ProgressNav
