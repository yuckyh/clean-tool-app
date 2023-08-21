import {
  Subtitle2,
  ProgressBar,
  makeStyles,
  shorthands,
  tokens,
  Subtitle2Stronger,
  ProgressBarProps,
  mergeClasses,
  useLinkStyles_unstable,
  useLink_unstable,
  renderLink_unstable,
} from '@fluentui/react-components'

import { NavHandle } from '@/router/handlers'
import {
  useChildRoutes,
  useComponentRoute,
  useCurrentRoute,
  useFluentComponentStates,
  useRouteName,
} from '@/hooks'
import { NavLink, RouteObject, useHref } from 'react-router-dom'

const useClasses = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.padding(tokens.spacingVerticalXXL),
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
  const handleId = 'progressNavHandle'
  const componentRoute = useComponentRoute<NavHandle>(handleId)
  const currentRoute = useCurrentRoute()
  const childRoutes = useChildRoutes(componentRoute)
  const index = childRoutes.findIndex(
    (route) => currentRoute.id?.includes(route.id!),
  )

  // Ternary expression for animation hack
  const progress = index == 0 ? 0.011 : index / (childRoutes.length - 1)

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
        {childRoutes.map((route) => (
          <ProgressNavLink key={route.id} route={route} />
        ))}
      </div>
    </div>
  )
}

interface LinkLabelProps {
  route: RouteObject
}

const useLinkClasses = makeStyles({
  root: {
    display: 'flex',
    paddingTop: '8px',
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
    backgroundColor: tokens.colorCompoundBrandBackground,
    top: '16px',
    position: 'absolute',
    ...shorthands.borderRadius(tokens.borderRadiusCircular),
  },
})

const ProgressNavLink = ({ route }: LinkLabelProps) => {
  const label = useRouteName(route)
  const href = useHref(route.path ?? '')
  const classes = useLinkClasses()

  const fluentLinkComponent = useFluentComponentStates(
    { appearance: 'subtle' },
    renderLink_unstable,
    useLinkStyles_unstable,
    useLink_unstable,
  )

  return (
    <div className={classes.root}>
      <NavLink
        className={mergeClasses(
          fluentLinkComponent.props.className,
          classes.link,
        )}
        to={href}>
        {({ isActive }) => (
          <>
            <div key={`StepThumb${route.id}`} className={classes.stepThumb} />
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
