import { ToastTitle, ToastBody, Toast } from '@fluentui/react-components'
import { useAppSelector } from '@/lib/hooks'

export type FileTaskType = 'downloaded' | 'uploaded' | 'deleted'

interface Props {
  fileTask: FileTaskType
}

export default function FileToast({ fileTask }: Props) {
  const fileName = useAppSelector(({ sheet }) => sheet.fileName)

  return (
    <Toast>
      <ToastTitle>File {fileTask}!</ToastTitle>
      <ToastBody>
        {fileName || 'File'} has been {fileTask}.
      </ToastBody>
    </Toast>
  )
}
