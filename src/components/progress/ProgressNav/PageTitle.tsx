/* eslint-disable
  functional/functional-parameters
  */
import { getTitle } from '@/features/progress/selectors'
import { useAppSelector } from '@/lib/hooks'
import { Helmet } from 'react-helmet-async'

/**
 *
 */
interface Props {
  /**
   *
   */
  componentPath: string
  /**
   *
   */
  locationPath: string
}

/**
 *
 * @param props
 * @param props.componentPath
 * @param props.locationPath
 * @returns
 * @example
 */
export default function ProgressNavPageTitle({
  componentPath,
  locationPath,
}: Readonly<Props>) {
  const title = useAppSelector((state) =>
    getTitle(state, componentPath, locationPath),
  )

  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  )
}
