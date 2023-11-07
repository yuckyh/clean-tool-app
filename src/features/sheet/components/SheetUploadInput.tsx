/* eslint-disable
  functional/immutable-data
*/
import type { FileTaskType } from '@/components/FileToast'
import type { SheetResponse } from '@/workers/sheet'
import type { Dispatch, SetStateAction } from 'react'
import type { DropzoneOptions } from 'react-dropzone'

import { sheetWorker } from '@/app/workers'
import FileToast from '@/components/FileToast'
import { asIO } from '@/lib/fp'
import { dumpError } from '@/lib/fp/logger'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import {
  Field,
  Input,
  makeStyles,
  useToastController,
} from '@fluentui/react-components'
import * as T from 'fp-ts/Task'
import * as f from 'fp-ts/function'
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react'
import { useDropzone } from 'react-dropzone'

import { fetchSheet, postFile } from '../actions'

export interface SheetInputRef {
  setFileTask: Dispatch<SetStateAction<FileTaskType | undefined>>
}

const useClasses = makeStyles({
  input: {
    width: '100%',
  },
  root: {
    cursor: 'pointer',
  },
})

interface Props {
  toasterId: string
}

const SheetUploadInput = forwardRef<SheetInputRef, Props>(
  ({ toasterId }, ref) => {
    const classes = useClasses()

    const dispatch = useAppDispatch()

    const fileName = useAppSelector(({ sheet }) => sheet.fileName)
    const dataLength = useAppSelector(({ sheet }) => sheet.data.length)

    const [fileTask, setFileTask] = useState<FileTaskType | undefined>()

    const { dispatchToast } = useToastController(toasterId)

    const zoneOptions: Readonly<DropzoneOptions> = useMemo(
      () => ({
        accept: {
          'application/vnd.ms-excel': ['.xls'],
          'application/vnd.oasis.opendocument.spreadsheet': ['.ods'],
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
            '.xlsx',
          ],
          'text/csv': ['.csv'],
        },
        disabled: !!dataLength,
        maxFiles: 1,
        onDrop: (acceptedFiles: readonly File[]) => {
          const [file] = acceptedFiles
          if (!file) {
            return
          }

          setFileTask('uploaded')

          f.pipe(file, postFile, (x) => dispatch(x), T.of)()
            .then(() => f.pipe(fetchSheet(), (x) => dispatch(x), T.of))
            .catch(dumpError)
        },
      }),
      [dispatch, dataLength],
    )

    const { getInputProps, getRootProps } = useDropzone(zoneOptions)

    const toastNotify = useCallback(() => {
      if (fileTask) {
        dispatchToast(<FileToast fileTask={fileTask} />, {
          intent: 'success',
        })
      }
    }, [fileTask, dispatchToast])

    useImperativeHandle(ref, () => ({
      setFileTask,
    }))

    useEffect(() => {
      const handleWorkerLoad = ({
        data,
      }: Readonly<MessageEvent<SheetResponse>>) => {
        const isTask = data.fileName && !data.workbook

        if (!isTask) {
          setFileTask(undefined)
          return
        }

        toastNotify()
      }

      sheetWorker.addEventListener('message', handleWorkerLoad)

      return asIO(() => {
        sheetWorker.removeEventListener('message', handleWorkerLoad)
      })
    }, [toastNotify])

    return (
      <Field label="File" required>
        <div {...getRootProps({ className: classes.root })}>
          <input {...getInputProps()} />
          <Input
            appearance="filled-darker"
            className={classes.input}
            disabled={zoneOptions.disabled}
            placeholder="Drag and drop or click to upload"
            value={fileName}
          />
        </div>
      </Field>
    )
  },
)

SheetUploadInput.displayName = 'SheetUploadInput'
export default SheetUploadInput
