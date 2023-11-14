/* eslint-disable
  functional/immutable-data
*/
import type { FileTaskType } from '@/components/FileToast'
import type { SheetResponse } from '@/workers/sheet'
import type { Dispatch, SetStateAction } from 'react'
import type { DropzoneOptions } from 'react-dropzone'

import { getDataLength, getFileName } from '@/app/selectors'
import { sheetWorker } from '@/app/workers'
import FileToast from '@/components/FileToast'
import { asIO, equals } from '@/lib/fp'
import { dumpError } from '@/lib/fp/logger'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import {
  Field,
  Input,
  makeStyles,
  useToastController,
} from '@fluentui/react-components'
import * as IOO from 'fp-ts/IOOption'
import * as P from 'fp-ts/Predicate'
import * as T from 'fp-ts/Task'
import * as f from 'fp-ts/function'
import * as S from 'fp-ts/string'
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

/**
 *
 */
export interface SheetInputRef {
  /**
   *
   */
  setFileTask: Dispatch<SetStateAction<FileTaskType>>
}

const useClasses = makeStyles({
  input: {
    width: '100%',
  },
  root: {
    cursor: 'pointer',
  },
})

/**
 *
 */
interface Props {
  /**
   *
   */
  toasterId: string
}

const SheetUploadInput = forwardRef<SheetInputRef, Props>(
  ({ toasterId }, ref) => {
    const classes = useClasses()

    const dispatch = useAppDispatch()

    const fileName = useAppSelector(getFileName)
    const dataLength = useAppSelector(getDataLength)

    const [fileTask, setFileTask] = useState<FileTaskType>('none')

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
      f.pipe(
        fileTask,
        f.pipe('none', equals(S.Eq), P.not, IOO.fromPredicate<FileTaskType>),
        IOO.match(
          () => {},
          (task) => {
            dispatchToast(<FileToast fileTask={task} />, {
              intent: 'success',
            })
          },
        ),
      )()
    }, [fileTask, dispatchToast])

    useImperativeHandle(ref, () => ({
      setFileTask,
    }))

    useEffect(() => {
      const handleWorkerLoad = ({
        data: { status },
      }: Readonly<MessageEvent<SheetResponse>>) => {
        if (status === 'fail') {
          setFileTask('none')
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
