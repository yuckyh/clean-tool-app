import { getRouteName } from '@/helpers'
import { useChildRoutesHandler } from '@/router/hooks'
// import { NavHandler } from '@/types/router'
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
import { RouteObject } from 'react-router-dom'

type ProgressNavProps = {
  navRoutes: RouteObject[]
  currentStep?: number
} & ProgressBarProps

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
  const [childRoutes] = useChildRoutesHandler()

  const steps = childRoutes.map((route) => getRouteName(route))

  return (
    <div className={classes.root}>
      <ProgressBar title="Progress Bar Navigation" {...props} />
      <div className={classes.labelContainer}>
        {steps.map((step) => (
          <Subtitle2 key={step}>{step}</Subtitle2>
        ))}
      </div>
      <div className={classes.stepThumbs}></div>
      <Slider></Slider>
    </div>
  )
}

export default ProgressNav
