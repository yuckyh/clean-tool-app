/* eslint-disable functional/immutable-data */
import type { SetStateAction, Dispatch } from 'react'
import type { DropzoneOptions } from 'react-dropzone'
import {
  useImperativeHandle,
  useCallback,
  forwardRef,
  useEffect,
  useState,
  useMemo,
} from 'react'
import { makeStyles, Field, Input } from '@fluentui/react-components'
import { useDropzone } from 'react-dropzone'
import type { SimpleToasterRef } from '@/components/SimpleToaster'
import type { FileTaskType } from '@/components/FileToast'
import type { SheetResponse } from '@/workers/sheet'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import FileToast from '@/components/FileToast'
import { sheetWorker } from '@/app/workers'

import { pipe } from 'fp-ts/function'
import { dumpError } from '@/lib/logger'
import * as T from 'fp-ts/Task'
import { fetchSheet, postFile } from '../actions'

export interface SheetInputRef {
  setFileTask: Dispatch<SetStateAction<FileTaskType | undefined>>
}

interface Props {
  toasterRef: React.MutableRefObject<SimpleToasterRef | null>
}

const useClasses = makeStyles({
  root: {
    cursor: 'pointer',
  },
  input: {
    width: '100%',
  },
})

const SheetUploadInput = forwardRef<SheetInputRef, Props>(
  ({ toasterRef }, ref) => {
    const classes = useClasses()

    const dispatch = useAppDispatch()

    const fileName = useAppSelector(({ sheet }) => sheet.fileName)
    const dataLength = useAppSelector(({ sheet }) => sheet.data.length)

    const [fileTask, setFileTask] = useState<FileTaskType | undefined>()

    const zoneOptions: DropzoneOptions = useMemo(
      () => ({
        onDrop: (acceptedFiles: File[]) => {
          const [file] = acceptedFiles
          if (!file) {
            return
          }

          setFileTask('uploaded')

          pipe(file, postFile, (x) => dispatch(x), T.of)()
            .then(() => pipe(fetchSheet(), (x) => dispatch(x), T.of))
            .catch(dumpError)
        },
        accept: {
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
            '.xlsx',
          ],
          'application/vnd.oasis.opendocument.spreadsheet': ['.ods'],
          'application/vnd.ms-excel': ['.xls'],
          'text/csv': ['.csv'],
        },
        disabled: !!dataLength,
        maxFiles: 1,
      }),
      [dispatch, dataLength],
    )

    const { getInputProps, getRootProps } = useDropzone(zoneOptions)

    const toastNotify = useCallback(() => {
      if (fileTask) {
        toasterRef.current?.dispatchToast(<FileToast fileTask={fileTask} />, {
          intent: 'success',
        })

        return undefined
      }

      return undefined
    }, [fileTask, toasterRef])

    useImperativeHandle(ref, () => ({
      setFileTask,
    }))

    useEffect(() => {
      const handleWorkerLoad = ({ data }: MessageEvent<SheetResponse>) => {
        const isTask = data.fileName && !data.workbook

        if (!isTask) {
          setFileTask(undefined)
          return undefined
        }

        toastNotify()
        return undefined
      }

      sheetWorker.addEventListener('message', handleWorkerLoad)

      // eslint-disable-next-line functional/functional-parameters
      return () => {
        sheetWorker.removeEventListener('message', handleWorkerLoad)
      }
    }, [toastNotify])

    return (
      <Field label="File" required>
        <div {...getRootProps({ className: classes.root })}>
          <input {...getInputProps()} />
          <Input
            placeholder="Drag and drop or click to upload"
            disabled={zoneOptions.disabled}
            appearance="filled-darker"
            className={classes.input}
            value={fileName}
          />
        </div>
      </Field>
    )
  },
)

SheetUploadInput.displayName = 'SheetUploadInput'
export default SheetUploadInput
