/* eslint-disable
  functional/functional-parameters
*/
import { getPosition, getProgressValue } from '@/features/progress/selectors'
import { useAppSelector } from '@/lib/hooks'
import {
  ProgressBar,
  makeStyles,
  mergeClasses,
  shorthands,
} from '@fluentui/react-components'
import { useLocation, useResolvedPath } from 'react-router-dom'

const useClasses = makeStyles({
  initialRoot: {
    width: '81%',
  },
  root: {
    width: '80%',
    ...shorthands.margin(0, 'auto'),
  },
})

/**
 * The progress navigation's bar component
 *
 * This component is used to control the length of the progress bar's fill
 * @see {@link ProgressNav} for details of the overall navigation component
 * @category Component
 * @group Progress slice
 * @returns The component object
 * @example
 */
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
      max={1}
      thickness="large"
      title="Progress Bar Navigation"
      value={progressValue}
    />
  )
}
