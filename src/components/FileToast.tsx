/**
 * @file This file contains the file toast component.
 * @module components/FileToast
 */
import { useAppSelector } from '@/lib/hooks'
import { getFileName } from '@/selectors/data/sheet'
import { Toast, ToastBody, ToastTitle } from '@fluentui/react-components'

/**
 * The type of file I/O task.
 */
export type FileTaskType = 'deleted' | 'downloaded' | 'none' | 'uploaded'

/**
 * The props for the {@link FileToast}.
 */
interface Props {
  /**
   * The file task to display.
   */
  fileTask: FileTaskType
}

/**
 * The {@link FileToast} component displays a toast notification for file I/O
 * @param props - The {@link Props props} for the component.
 * @param props.fileTask - The file task to display.
 * @returns The component object.
 * @example
 * ```tsx
 *  dispatchToast(<FileToast fileTask="uploaded" />)
 * ```
 */
export default function FileToast({ fileTask }: Readonly<Props>) {
  const fileName = useAppSelector(getFileName)

  return (
    <Toast>
      <ToastTitle>File {fileTask}!</ToastTitle>
      <ToastBody>
        {fileName || 'File'} has been {fileTask}.
      </ToastBody>
    </Toast>
  )
}
