/* eslint-disable functional/immutable-data */
import { useToastController, Toaster, useId } from '@fluentui/react-components'
import { useImperativeHandle, forwardRef } from 'react'

export type SimpleToasterRef = ReturnType<typeof useToastController>

const SimpleToaster = forwardRef<SimpleToasterRef, unknown>((_, ref) => {
  const id = useId('simpleToaster')
  const controller = useToastController(id)

  useImperativeHandle(ref, () => controller, [controller])

  return <Toaster toasterId={id} />
})

SimpleToaster.displayName = 'SimpleToaster'

export default SimpleToaster
