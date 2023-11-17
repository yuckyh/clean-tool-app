/**
 * @file This file is for the alert dialog component.
 * @module components/AlertDialog
 */

/* eslint-disable
  functional/immutable-data
*/
import type { DialogProps } from '@fluentui/react-components'

import { noOpIO } from '@/lib/fp'
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
} from '@fluentui/react-components'
import * as IO from 'fp-ts/IO'
import * as f from 'fp-ts/function'
import { forwardRef, useImperativeHandle, useState } from 'react'

/**
 * The ref for {@link AlertDialog}.
 */
export interface AlertRef {
  /**
   * Function to open the dialog.
   */
  open: IO.IO<void>
  /**
   * Function to set the content of the dialog.
   * @param content - The content to set.
   * @example
   * ```tsx
   *  alertRef.current?.setContent('Hello World')
   * ```
   */
  setContent: (content: string) => void
  /**
   * Function to set the title of the dialog.
   * @param title - The title to set.
   * @example
   * ```tsx
   *  alertRef.current?.setTitle('Hello World')
   * ```
   */
  setTitle: (title: string) => void
}

/**
 * The props for {@link AlertDialog}.
 */
interface Props {
  /**
   * Whether to show the cancel button.
   */
  noCancel?: boolean
  /**
   * The function to run when the confirm button is clicked.
   */
  onConfirm?: IO.IO<void>
}

/**
 * The alert dialog component.
 * @param props - The {@link Props props} for the component.
 * @param props.noCancel - Whether to show the cancel button.
 * @param props.onConfirm - The function to run when the confirm button is clicked.
 * @returns The component object.
 * @example
 * ```tsx
 *  <AlertDialog ref={alertRef} />
 * ```
 */
const AlertDialog = forwardRef<AlertRef, Props>(
  ({ noCancel = false, onConfirm = noOpIO() }, ref) => {
    const [alertOpen, setAlertOpen] = useState(false)
    const [content, setContent] = useState('')
    const [title, setTitle] = useState('')

    const handleOpen: DialogProps['onOpenChange'] = (_event, { open }) => {
      setAlertOpen(open)
    }

    useImperativeHandle(
      ref,
      () => ({
        open: f.pipe(setAlertOpen, IO.of, IO.flap(true)),
        setContent,
        setTitle,
      }),
      [],
    )

    return (
      <Dialog modalType="alert" onOpenChange={handleOpen} open={alertOpen}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>{content}</DialogContent>
            <DialogActions>
              {!noCancel && (
                <DialogTrigger disableButtonEnhancement>
                  <Button>Cancel</Button>
                </DialogTrigger>
              )}
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="primary" onClick={onConfirm}>
                  Okay
                </Button>
              </DialogTrigger>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    )
  },
)

AlertDialog.displayName = 'AlertDialog'
AlertDialog.defaultProps = {
  noCancel: false,
  onConfirm: noOpIO(),
}

export default AlertDialog
