import type { AppState } from '@/app/store'

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

const selectTitle =
  ({ componentPath, locationPath }: Readonly<Props>) =>
  (state: AppState) =>
    getTitle(state, componentPath, locationPath)

/**
 *
 * @param props
 * @returns
 * @example
 */
export default function ProgressNavPageTitle(props: Readonly<Props>) {
  const title = useAppSelector(selectTitle(props))

  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  )
}
