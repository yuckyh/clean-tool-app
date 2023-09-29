import { Toaster, useId, useToastController } from '@fluentui/react-components'
import { forwardRef, useImperativeHandle } from 'react'

export type SimpleToasterRef = ReturnType<typeof useToastController>

const SimpleToaster = forwardRef<SimpleToasterRef, unknown>((_, ref) => {
  const id = useId('simpleToaster')
  const controller = useToastController(id)

  useImperativeHandle(ref, () => ({
    ...controller,
  }))

  return <Toaster toasterId={id} />
})

SimpleToaster.displayName = 'SimpleToaster'

export default SimpleToaster
