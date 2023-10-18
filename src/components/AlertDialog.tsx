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
import { useImperativeHandle, forwardRef, useState } from 'react'

export interface AlertRef {
  setContent: (content: string) => string
  setTitle: (title: string) => string
  open: () => boolean
}

interface Props {
  onConfirm?: () => void
}

const AlertDialog = forwardRef<AlertRef, Props>(({ onConfirm }, ref) => {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')

  const handleOpen: DialogProps['onOpenChange'] = (_event, data) => {
    setOpen(data.open)
  }

  useImperativeHandle(
    ref,
    () => ({
      setContent: (newContent) => {
        setContent(newContent)
        return newContent
      },
      setTitle: (newTitle) => {
        setTitle(newTitle)
        return newTitle
      },
      open: () => {
        setOpen(true)
        return true
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
            <DialogTrigger disableButtonEnhancement>
              <Button>Cancel</Button>
            </DialogTrigger>
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
})

AlertDialog.displayName = 'AlertDialog'
AlertDialog.defaultProps = {
  onConfirm: noOpIO(),
}

export default AlertDialog
