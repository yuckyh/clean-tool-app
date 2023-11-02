/* eslint-disable
  functional/immutable-data
*/
import type { DialogProps } from '@fluentui/react-components'

import { noOpIO } from '@/lib/utils'
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

export interface AlertRef {
  open: IO.IO<boolean>
  setContent: (content: string) => string
  setTitle: (title: string) => string
}

export interface Props {
  noCancel?: boolean
  onConfirm?: IO.IO<void>
}

const AlertDialog = forwardRef<AlertRef, Props>(
  ({ noCancel, onConfirm }, ref) => {
    const [open, setOpen] = useState(false)
    const [content, setContent] = useState('')
    const [title, setTitle] = useState('')

    const handleOpen: DialogProps['onOpenChange'] = (_event, data) => {
      setOpen(data.open)
    }

    useImperativeHandle(
      ref,
      () => ({
        open: f.pipe(
          setOpen,
          IO.of,
          IO.flatMap((fn) =>
            IO.as(true)(() => {
              fn(true)
              return true
            }),
          ),
        ),
        setContent: (newContent) => {
          setContent(newContent)
          return newContent
        },
        setTitle: (newTitle) => {
          setTitle(newTitle)
          return newTitle
        },
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
