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
  open: () => void
}

interface Props {
  onConfirm?: () => void
  content: string
  title: string
}

const AlertDialog = forwardRef<AlertRef, Props>(
  ({ onConfirm, content, title }, ref) => {
    const [open, setOpen] = useState(false)

    const handleOpen: DialogProps['onOpenChange'] = (_event, data) => {
      setOpen(data.open)
    }

    useImperativeHandle(ref, () => ({
      open: () => {
        setOpen(true)
      },
    }))

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
  },
)

AlertDialog.displayName = 'AlertDialog'

export default AlertDialog
