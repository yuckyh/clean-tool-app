import {
  Subtitle2,
  ProgressBar,
  ProgressBarProps,
  makeStyles,
  shorthands,
  themeToTokensObject,
  webDarkTheme,
  Slider,
} from '@fluentui/react-components'

import { NavHandle } from '@/router/handlers'
import { useChildRoutes, useComponentRoute, useRouteName } from '@/hooks'
import { RouteObject } from 'react-router-dom'

type ProgressNavProps = {} & ProgressBarProps

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.padding(themeToTokensObject(webDarkTheme).spacingVerticalL),
  },
  labelContainer: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
  },
  stepThumbs: {
    height: '20px',
  },
})

const ProgressNav = ({ ...props }: ProgressNavProps) => {
  const classes = useStyles()
  const handleId = 'progressNavHandle'
  const componentRoute = useComponentRoute<NavHandle>(handleId)

  const childRoutes = useChildRoutes(componentRoute)

  return (
    <div className={classes.root}>
      <ProgressBar title="Progress Bar Navigation" {...props} />
      <div className={classes.labelContainer}>
        {childRoutes.map((route) => (
          <LinkLabel key={`LinkLabel${route.id}`} route={route} />
        ))}
      </div>
      <div className={classes.stepThumbs}></div>
      <Slider></Slider>
    </div>
  )
}

interface LinkLabelProps {
  route: RouteObject
}

const LinkLabel = ({ route }: LinkLabelProps) => {
  const label = useRouteName(route)

  return <Subtitle2>{label}</Subtitle2>
}

export default ProgressNav
