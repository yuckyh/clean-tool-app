import { getRouteName } from '@/helpers'
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

const ProgressNav = ({ navRoutes, ...props }: ProgressNavProps) => {
  const classes = useStyles()
  const steps = navRoutes.map((route) => getRouteName(route))
  return (
    <div className={classes.root}>
      <ProgressBar {...props} />
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
