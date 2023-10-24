/* eslint-disable functional/immutable-data */
import { noOpIO } from '@/lib/utils'
import type { DialogProps } from '@fluentui/react-components'

import {
  DialogActions,
  DialogContent,
  DialogSurface,
  DialogTrigger,
  DialogTitle,
  DialogBody,
  Button,
  Dialog,
} from '@fluentui/react-components'
import * as IO from 'fp-ts/IO'
import { pipe } from 'fp-ts/function'
import { useImperativeHandle, forwardRef, useState } from 'react'

export interface AlertRef {
  setContent: (content: string) => string
  setTitle: (title: string) => string
  open: IO.IO<boolean>
}

interface Props {
  onConfirm?: IO.IO<void>
  noCancel?: boolean
}

const AlertDialog = forwardRef<AlertRef, Props>(
  ({ onConfirm, noCancel }, ref) => {
    const [open, setOpen] = useState(false)
    const [content, setContent] = useState('')
    const [title, setTitle] = useState('')

    const handleOpen: DialogProps['onOpenChange'] = (_event, data) => {
      setOpen(data.open)
    }

    useImperativeHandle(
      ref,
      () => ({
        open: pipe(
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
      <Dialog onOpenChange={handleOpen} modalType="alert" open={open}>
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
  onConfirm: noOpIO(),
  noCancel: false,
}

export default AlertDialog
