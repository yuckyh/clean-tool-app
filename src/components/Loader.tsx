import type { SpinnerProps } from '@fluentui/react-components'
import type { PropsWithChildren } from 'react'

import { Spinner } from '@fluentui/react-components'
import { Suspense } from 'react'

type Props = SpinnerProps & PropsWithChildren

/**
 *
 * @param props
 * @param props.children
 * @returns
 * @example
 */
export default function Loader({ children, ...props }: Readonly<Props>) {
  return <Suspense fallback={<Spinner {...props} />}>{children}</Suspense>
}
