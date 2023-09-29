import type { SpinnerProps } from '@fluentui/react-components'
import type { PropsWithChildren } from 'react'

import { Spinner } from '@fluentui/react-components'
import { Suspense } from 'react'

type Props = SpinnerProps & PropsWithChildren

const Loader = ({ children, ...props }: Props) => (
  <Suspense fallback={<Spinner {...props} />}>{children}</Suspense>
)

export default Loader
