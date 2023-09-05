import { useCallback, useEffect, useState } from 'react'
import { Form } from 'react-router-dom'
import FileInput from '@/components/FileInput'
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Dropdown,
  Field,
  Title1,
  Toast,
  ToastBody,
  ToastTitle,
  Toaster,
  Option,
  makeStyles,
  shorthands,
  tokens,
  useId,
  useToastController,
} from '@fluentui/react-components'
import type { DropdownProps } from '@fluentui/react-components'
import type { DropzoneOptions } from 'react-dropzone'
import { fileNameStorage } from '@/lib/FileNameStorage'
import type { FileResponse, FileRequest } from '@/workers/file'
import {
  useFile,
  useFileName,
  useFileWorker,
  useSheetName,
  useWorkbook,
} from '@/hooks'
import { sheetNameStorage } from '@/lib/SheetNameStorage'

type TaskType = 'uploaded' | 'deleted' | false

const useClasses = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '40%',
    ...shorthands.margin(0, 'auto'),
  },
  card: {
    ...shorthands.padding(tokens.spacingHorizontalXXXL, '20%'),
  },
  body: {
    display: 'grid',
    ...shorthands.gap(0, '8px'),
  },
  actions: {
    width: '100%',
    display: 'grid',
    gridAutoFlow: 'column',
    ...shorthands.gap('8px', 0),
  },

  input: {
    width: '100%',
    minWidth: 'initial',
  },
})

export const Component = () => {
  const fileName = useFileName()
  const [taskType, setTaskType] = useState<TaskType>(false)

  const toasterId = useId('toaster')

  const { dispatchToast } = useToastController(toasterId)
  const toastNotify = useCallback(() => {
    dispatchToast(<FileToast type={taskType} />, { intent: 'success' })
  }, [dispatchToast, taskType])

  const handleWorkerLoad = useCallback(
    ({ data }: MessageEvent<FileResponse>) => {
      const loadingActions = ['create', 'overwrite', 'delete']
      const hasMatch = !!loadingActions.find((action) => action === data.action)
      if (!hasMatch) {
        return
      }
      setTaskType(!hasMatch)
      toastNotify()
    },
    [toastNotify],
  )

  const fileWorker = useFileWorker()

  useEffect(() => {
    fileWorker.addEventListener('message', handleWorkerLoad)
    return () => {
      fileWorker.removeEventListener('message', handleWorkerLoad)
    }
  }, [fileWorker, handleWorkerLoad])

  const handleFileDrop = useCallback(
    (acceptedFiles: File[]): void => {
      const [file] = acceptedFiles
      if (!file) {
        return
      }

      setTaskType('uploaded')
      const request: FileRequest = {
        method: 'post',
        file,
        fileName: file.name,
      }

      fileWorker.postMessage(request)
    },
    [fileWorker],
  )

  const handleResetClick = useCallback(() => {
    setTaskType('deleted')
    const request: FileRequest = {
      method: 'delete',
      fileName: fileNameStorage.state,
    }
    fileWorker.postMessage(request)
  }, [fileWorker])

  const classes = useClasses()
  const file = useFile()
  const hasFile = !!file.size

  const zoneOptions: DropzoneOptions = {
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
      'application/vnd.oasis.opendocument.spreadsheet': ['.ods'],
    },
    maxFiles: 1,
    onDrop: handleFileDrop,
    disabled: hasFile,
  }

  const isCSV = file.type === 'text/csv'
  const workbook = useWorkbook()

  const selectedSheetName = useSheetName()

  const handleSheetSelect: DropdownProps['onOptionSelect'] = (
    _event,
    { selectedOptions },
  ) => {
    sheetNameStorage.state = selectedOptions[0] ?? ''
  }

  return (
    <Form className={classes.root} action="/column-matching" method="POST">
      <Card className={classes.card}>
        <CardHeader header={<Title1>Upload</Title1>} />
        <Field label="Upload Data" required={true}>
          <FileInput
            zoneOptions={zoneOptions}
            appearance="filled-darker"
            value={fileName}
          />
        </Field>
        {hasFile && !isCSV && (
          <Field label="Select sheet" required={true}>
            <Dropdown
              appearance="filled-darker"
              className={classes.input}
              onOptionSelect={handleSheetSelect}
              value={selectedSheetName}
              defaultValue={selectedSheetName}
              defaultSelectedOptions={[selectedSheetName]}
              selectedOptions={[selectedSheetName]}>
              {workbook?.SheetNames.map((sheetName) => (
                <Option key={sheetName} value={sheetName}>
                  {sheetName}
                </Option>
              ))}
            </Dropdown>
          </Field>
        )}
        <CardFooter
          action={
            <div className={classes.actions}>
              <Button disabled={!hasFile} onClick={handleResetClick}>
                Reset
              </Button>
              <Button appearance="primary" disabled={!hasFile} type="submit">
                Proceed
              </Button>
            </div>
          }
        />
      </Card>
      <Toaster toasterId={toasterId} />
    </Form>
  )
}

interface FileToastProps {
  type: TaskType
}

const FileToast = ({ type }: FileToastProps) => {
  const fileName = useFileName()
  return (
    <Toast>
      <ToastTitle>File {type}!</ToastTitle>
      <ToastBody>
        {fileName || 'File'} has been {type}.
      </ToastBody>
    </Toast>
  )
}

Component.displayName = 'Upload'
