/**
 * @file This file contains the loader component.
 */

import type { SpinnerProps } from '@fluentui/react-components'
import type { PropsWithChildren } from 'react'

import { Spinner } from '@fluentui/react-components'
import { Suspense } from 'react'

type Props = SpinnerProps & PropsWithChildren

/**
 * The loader component displays a {@link Spinner spinner} while the component is loading.
 * @param props - The {@link Props props} for the component.
 * @param props.children - The children to display.
 * @returns The component object.
 * @category Component
 * @example
 * ```tsx
 *  <Loader>
 *    <Component />
 *  </Loader>
 * ```
 */
export default function Loader({ children, ...props }: Readonly<Props>) {
  return <Suspense fallback={<Spinner {...props} />}>{children}</Suspense>
}
