import type {
  ProgressBarProps,
  LinkProps,
  LinkSlots,
  LinkState,
} from '@fluentui/react-components'
import {
  Subtitle2,
  ProgressBar,
  makeStyles,
  shorthands,
  tokens,
  Subtitle2Stronger,
  mergeClasses,
  useLink_unstable,
  useLinkStyles_unstable,
} from '@fluentui/react-components'

import { useFluentStyledState, usePathTitle } from '@/hooks'
import {
  NavLink,
  matchRoutes,
  resolvePath,
  useHref,
  useLocation,
  useNavigate,
  useResolvedPath,
} from 'react-router-dom'
import { useEffect, useSyncExternalStore } from 'react'
import { progressStateStore } from '@/lib/StateStore/progress'
import { routes } from '@/Router'

const useClasses = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.padding(tokens.spacingVerticalS, 0),
  },
  linkContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  // Animation hack for initial progress bar
  progressBarInitial: {
    width: '81%',
  },
  progressBar: {
    width: '80%',
    ...shorthands.margin(0, 'auto'),
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
    .map(({ path }) => resolvePath(path ?? '').pathname)

const ProgressNav = (props: ProgressBarProps) => {
  const classes = useClasses()
  const componentPath = useResolvedPath('')
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const childPaths = useChildPaths(componentPath.pathname)

  const index = childPaths?.findIndex((path) => path === pathname) ?? -1

  const allowedChildPaths = childPaths?.map((pathname) => ({
    pathname,
  }))

  const allowedPath = useSyncExternalStore(
    progressStateStore.subscribe,
    () => progressStateStore.allowedPath,
  )

  // Ternary expression for animation hack
  const progress = index == 0 ? 0.011 : index / ((childPaths?.length ?? -1) - 1)

  useEffect(() => {
    !allowedPath.includes(pathname) &&
      navigate(allowedPath[allowedPath.length - 1] ?? '/')
  }, [allowedPath, navigate, pathname])

  return (
    <div className={classes.root}>
      <ProgressBar
        className={mergeClasses(
          classes.progressBar,
          index == 0 && classes.progressBarInitial,
        )}
        title="Progress Bar Navigation"
        max={1}
        value={progress}
        {...props}
      />
      <div className={classes.linkContainer}>
        {allowedChildPaths?.map(({ pathname }, i) => (
          <ProgressNavLink key={i} done={index >= i} path={pathname} />
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
  root: {
    display: 'flex',
    justifyContent: 'center',
    ...shorthands.flex(1),
  },
  link: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  stepThumb: {
    height: '20px',
    width: '20px',
    top: '-12px',
    position: 'relative',
    backgroundColor: tokens.colorNeutralBackground6,
    ...shorthands.borderRadius(tokens.borderRadiusCircular),
    ...shorthands.transition('background-color', '0.2s', '0s', 'ease-in-out'),
  },
  activeStepThumb: {
    backgroundColor: tokens.colorCompoundBrandBackground,
  },
})

const ProgressNavLink = ({ done, path }: LinkLabelProps) => {
  const href = useHref(path)
  const label: string = usePathTitle(path)
  const classes = useLinkClasses()

  const allowedPath = useSyncExternalStore(
    progressStateStore.subscribe,
    () => progressStateStore.allowedPath,
  )

  const disabled = !allowedPath.includes(path)

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
