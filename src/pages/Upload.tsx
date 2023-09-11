import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { useNavigate } from 'react-router-dom'
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
  Option,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import type { DropdownProps } from '@fluentui/react-components'
import type { DropzoneOptions } from 'react-dropzone'
import { fileStateStore } from '@/lib/StateStore/file'
import type { FileResponse, FileRequest } from '@/workers/file'
import { useFileWorker, useWorkbookWorker, useToaster } from '@/hooks'
import { sheetStateStore } from '@/lib/StateStore/sheet'
import { ProgressState, progressStateStore } from '@/lib/StateStore/progress'

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

// TODO: Add sheet preview

export const Component = () => {
  const classes = useClasses()
  const [taskType, setTaskType] = useState<TaskType>(false)

  const [{ dispatchToast }, FileToaster] = useToaster("fileToast")
  const toastNotify = useCallback(() => {
    dispatchToast(<FileToast type={taskType} />, { intent: 'success' })
  }, [dispatchToast, taskType])

  const fileWorker = useFileWorker()
  const workbookWorker = useWorkbookWorker()
  const fileName = useSyncExternalStore(
    fileStateStore.subscribe,
    () => fileStateStore.state,
  )
  const file = useSyncExternalStore(
    fileStateStore.subscribe,
    () => fileStateStore.file,
  )
  const selectedSheetName = useSyncExternalStore(
    sheetStateStore.subscribe,
    () => sheetStateStore.state,
  )
  const sheetNames = useSyncExternalStore(
    sheetStateStore.subscribe,
    () => sheetStateStore.sheetNames,
  )
  const navigate = useNavigate()

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
      fileName: fileStateStore.state,
    }
    fileWorker.postMessage(request)
    progressStateStore.state = ProgressState.NONE
    sheetStateStore.state = ''
  }, [fileWorker])

  const handleSubmit = useCallback(() => {
    progressStateStore.state = ProgressState.UPLOADED
    navigate('/column-matching')
  }, [navigate])

  const hasFile = !!file.size
  const isCSV = file.type === 'text/csv'

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

  const handleSheetSelect: DropdownProps['onOptionSelect'] = (
    _event,
    { selectedOptions },
  ) => {
    sheetStateStore.state = selectedOptions[0] ?? ''
  }

  useEffect(() => {
    const handleWorkerLoad = ({ data }: MessageEvent<FileResponse>) => {
      const loadingActions = ['create', 'sync', 'overwrite', 'delete']
      const hasMatch = !!loadingActions.find((action) => action === data.action)
      if (!hasMatch) {
        return
      }
      setTaskType(!hasMatch)
      toastNotify()
    }

    fileWorker.addEventListener('message', handleWorkerLoad)

    return () => {
      fileWorker.removeEventListener('message', handleWorkerLoad)
    }
  }, [fileWorker, toastNotify, workbookWorker])

  return (
    <section className={classes.root}>
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
              {sheetNames.map((sheetName) => (
                <Option key={sheetName} value={sheetName} text={sheetName}>
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
              <Button
                appearance="primary"
                onClick={handleSubmit}
                disabled={!hasFile}>
                Proceed
              </Button>
            </div>
          }
        />
      </Card>
      <FileToaster />
    </section>
  )
}

interface FileToastProps {
  type: TaskType
}

const FileToast = ({ type }: FileToastProps) => {
  const fileName = useSyncExternalStore(
    fileStateStore.subscribe,
    () => fileStateStore.state,
  )

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
