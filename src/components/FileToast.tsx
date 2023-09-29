import { useAppSelector } from '@/lib/hooks'
import { Toast, ToastBody, ToastTitle } from '@fluentui/react-components'
import { forwardRef, useImperativeHandle, useState } from 'react'

export type FileTaskType = 'deleted' | 'downloaded' | 'uploaded'

interface Props {
  fileTask: FileTaskType
}

const FileToast = ({ fileTask }: Props) => {
  const { fileName } = useAppSelector(({ sheet }) => sheet)

  return (
    <Toast>
      <ToastTitle>File {fileTask}!</ToastTitle>
      <ToastBody>
        {fileName || 'File'} has been {fileTask}.
      </ToastBody>
    </Toast>
  )
}

export default FileToast
