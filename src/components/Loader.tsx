import type { SpinnerProps } from '@fluentui/react-components'
import type { PropsWithChildren } from 'react'

import { Spinner } from '@fluentui/react-components'
import { Suspense } from 'react'

type Props = PropsWithChildren & SpinnerProps

const Loader = ({ children, ...props }: Props) => {
  return <Suspense fallback={<Spinner {...props} />}>{children}</Suspense>
}

export default Loader
