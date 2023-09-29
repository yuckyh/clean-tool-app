import type { DialogProps } from '@fluentui/react-components'

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
import { forwardRef, useImperativeHandle, useState } from 'react'

export interface AlertRef {
  openAlert: () => void
}

interface Props {
  content: string
  onConfirm?: () => void
  title: string
}
export const AlertDialog = forwardRef<AlertRef, Props>(
  ({ content, onConfirm, title }, ref) => {
    const [open, setOpen] = useState(false)

    const handleOpen: DialogProps['onOpenChange'] = (_event, data) => {
      setOpen(data.open)
    }

    const openAlert = () => {
      setOpen(true)
    }

    useImperativeHandle(ref, () => ({
      openAlert,
    }))

    return (
      <Dialog modalType="alert" onOpenChange={handleOpen} open={open}>
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
  },
)
AlertDialog.displayName = 'AlertDialog'
