import { useAppSelector } from '@/lib/hooks'
import { Toast, ToastBody, ToastTitle } from '@fluentui/react-components'

export type FileTaskType = 'deleted' | 'downloaded' | 'uploaded'

export interface Props {
  fileTask: FileTaskType
}

/**
 *
 * @param props
 * @param props.fileTask
 */
export default function FileToast({ fileTask }: Readonly<Props>) {
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
