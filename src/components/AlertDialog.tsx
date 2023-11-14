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
 *
 */
export interface AlertRef {
  /**
   *
   */
  open: IO.IO<void>
  /**
   *
   */
  setContent: (content: string) => void
  /**
   *
   * @param title
   * @returns
   */
  setTitle: (title: string) => void
}

/**
 *
 */
interface Props {
  /**
   *
   */
  noCancel?: boolean
  /**
   *
   */
  onConfirm?: IO.IO<void>
}

const AlertDialog = forwardRef<AlertRef, Props>(
  ({ noCancel = false, onConfirm = noOpIO() }, ref) => {
    const [open, setOpen] = useState(false)
    const [content, setContent] = useState('')
    const [title, setTitle] = useState('')

    const handleOpen: DialogProps['onOpenChange'] = (_event, { open }) => {
      setOpen(open)
    }

    useImperativeHandle(
      ref,
      () => ({
        open: f.pipe(setOpen, IO.of, IO.flap(true)),
        setContent,
        setTitle,
      }),
      [],
    )

    return (
      <Dialog modalType="alert" onOpenChange={handleOpen} open={open}>
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
