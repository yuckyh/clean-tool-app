import {
  mergeClasses,
  ProgressBar,
  makeStyles,
  shorthands,
} from '@fluentui/react-components'
import { useResolvedPath, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/lib/hooks'
import { getProgressValue, getPosition } from '../selectors'

const useClasses = makeStyles({
  root: {
    width: '80%',
    ...shorthands.margin(0, 'auto'),
  },
  initialRoot: {
    width: '81%',
  },
})
export default function ProgressNavBar() {
  const classes = useClasses()

  const { pathname: componentPath } = useResolvedPath('')
  const { pathname: locationPath } = useLocation()

  const params = [componentPath, locationPath] as const

  const position = useAppSelector((state) => getPosition(state, ...params))
  const progressValue = useAppSelector((state) =>
    getProgressValue(state, ...params),
  )

  return (
    <ProgressBar
      className={mergeClasses(
        classes.root,
        position === 0 && classes.initialRoot,
      )}
      title="Progress Bar Navigation"
      value={progressValue}
      thickness="large"
      max={1}
    />
  )
}
