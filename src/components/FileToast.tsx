import { useAppSelector } from '@/lib/hooks'
import { Toast, ToastBody, ToastTitle } from '@fluentui/react-components'

export type FileTaskType = 'deleted' | 'downloaded' | 'uploaded'

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
