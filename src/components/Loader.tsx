import type { SpinnerProps } from '@fluentui/react-components'
import type { PropsWithChildren } from 'react'

import { Spinner } from '@fluentui/react-components'
import { Suspense } from 'react'

type Props = SpinnerProps & PropsWithChildren

export default function Loader({ children, ...props }: Props) {
  return <Suspense fallback={<Spinner {...props} />}>{children}</Suspense>
}
