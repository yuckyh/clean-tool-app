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

import { useChildPaths, useFluentStyledState, usePathTitle } from '@/hooks'
import { NavLink, useHref, useResolvedPath } from 'react-router-dom'

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

const ProgressNav = (props: ProgressBarProps) => {
  const classes = useClasses()
  const componentPath = useResolvedPath('')
  console.log(componentPath)

  const childPaths = useChildPaths(componentPath.pathname)

  // console.log(
  //   matchRoutes(routes, componentPath.pathname)
  //     ?.filter(({ route }) => route.children)
  //     .map(({ route }) => route.children),
  // )
  // const index = childRoutes.findIndex(
  //   (route) => currentRoute.id?.includes(route.id ?? '') ?? false,
  // )

  // Ternary expression for animation hack
  // const progress = index == 0 ? 0.011 : index / (childRoutes.length - 1)

  return (
    <div className={classes.root}>
      <ProgressBar
        className={mergeClasses(
          classes.progressBar,
          // index == 0 && classes.progressBarInitial,
        )}
        title="Progress Bar Navigation"
        max={1}
        // value={progress}
        value={0}
        {...props}
      />
      <div className={classes.linkContainer}>
        {childPaths?.map((path) => (
          // <ProgressNavLink key={route.id} done={index >= i} path={path} />
          <ProgressNavLink key={path} done={true} path={path} />
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
  // const label = useRouteName(route)
  const href = useHref(path)
  const label = usePathTitle(href)
  const classes = useLinkClasses()

  const fluentLinkComponent = useFluentStyledState<
    LinkProps,
    LinkState,
    LinkSlots,
    HTMLAnchorElement
  >({ appearance: 'subtle' }, useLinkStyles_unstable, useLink_unstable)

  return (
    <div className={classes.root}>
      <NavLink
        className={mergeClasses(
          fluentLinkComponent.root.className,
          classes.link,
        )}
        to={href}>
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
