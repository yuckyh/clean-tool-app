import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react'
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
  createTableColumn,
  Title2,
  useToastController,
  Toaster,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
} from '@fluentui/react-components'
import type { DialogProps, DropdownProps } from '@fluentui/react-components'
import type { DropzoneOptions } from 'react-dropzone'
import { fileStateStore } from '@/lib/StateStore/file'
import type { FileResponse, FileRequest } from '@/workers/file'
import { fileWorker, useGetWorkbook, workbookWorker } from '@/hooks'
import { sheetStateStore } from '@/lib/StateStore/sheet'
import { ProgressState } from '@/lib/StateStore/progress'
import { progressStateStore } from '@/lib/StateStore/progress'
import { utils } from 'xlsx'
import type { WorkbookRequest } from '@/workers/workbook'
import SimpleDataGrid from '@/components/SimpleDataGrid'

type TaskType = 'uploaded' | 'deleted' | false

type CellItem = Record<Column, string | number | boolean>
type Column = string | number

const useClasses = makeStyles({
  root: {
    display: 'grid',
    gridAutoFlow: 'row',
    width: '70%',
    ...shorthands.margin(0, 'auto'),
    ...shorthands.gap(0, tokens.spacingVerticalXL),
  },
  card: {
    width: '50%',
    ...shorthands.margin(0, 'auto'),
    ...shorthands.padding(tokens.spacingHorizontalXXXL, '5%'),
  },
  body: {
    display: 'grid',
    ...shorthands.gap(0, tokens.spacingVerticalS),
  },
  actions: {
    width: '100%',
    display: 'grid',
    gridAutoFlow: 'column',
    ...shorthands.gap(tokens.spacingVerticalS, 0),
  },
  input: {
    width: '100%',
    minWidth: 'initial',
  },
})

export const Component = () => {
  useGetWorkbook()
  const classes = useClasses()
  const toasterId = useId()
  const navigate = useNavigate()

  const [taskType, setTaskType] = useState<TaskType>(false)
  const [alertOpen, setAlertOpen] = useState(false)

  const { dispatchToast } = useToastController(toasterId)

  const toastNotify = useCallback(() => {
    dispatchToast(<FileToast type={taskType} />, { intent: 'success' })
  }, [dispatchToast, taskType])

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
  const sheet = useSyncExternalStore(
    sheetStateStore.subscribe,
    () => sheetStateStore.sheet,
  )

  const data = useMemo(
    () => (sheet ? utils.sheet_to_json(sheet) : [[]]),
    [sheet],
  )

  const columnValues = useMemo(
    () => Object.keys(data[0] ?? {}) as Column[],
    [data],
  )

  const hasFile = useMemo(() => !!file.size, [file.size])
  const isCSV = useMemo(() => file.type === 'text/csv', [file])

  const handleFileDrop: DropzoneOptions['onDrop'] = useCallback(
    (acceptedFiles: File[]): void => {
      const [file] = acceptedFiles
      if (!file) {
        return
      }

      setTaskType('uploaded')
      const fileRequest: FileRequest = {
        method: 'post',
        file,
        fileName: file.name,
      }

      fileWorker.postMessage(fileRequest)

      const workbookRequest: WorkbookRequest = {
        method: 'get',
        file,
      }

      workbookWorker.postMessage(workbookRequest)
    },
    [],
  )

  const handleResetClick = useCallback(() => {
    setAlertOpen(true)
  }, [])

  const handleResetConfirm = useCallback(() => {
    setTaskType('deleted')
    const request: FileRequest = {
      method: 'delete',
      fileName: fileStateStore.state,
    }
    fileWorker.postMessage(request)
    localStorage.clear()
    window.dispatchEvent(new StorageEvent('storage', { key: null }))
  }, [])

  const handleSubmit = useCallback(() => {
    progressStateStore.state = ProgressState.UPLOADED
    navigate('/column-matching')
  }, [navigate])

  const handleSheetSelect: Required<DropdownProps>['onOptionSelect'] =
    useCallback((_event, { selectedOptions }) => {
      sheetStateStore.state = selectedOptions[0] ?? ''
    }, [])

  const zoneOptions: DropzoneOptions = useMemo(
    () => ({
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
    }),
    [handleFileDrop, hasFile],
  )

  useEffect(() => {
    const handleWorkerLoad = ({ data }: MessageEvent<FileResponse>) => {
      const loadingActions: FileResponse['action'][] = [
        'create',
        'sync',
        'overwrite',
        'delete',
      ]

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
  }, [toastNotify])

  const columns = useMemo(
    () =>
      columnValues.map((column) =>
        createTableColumn<CellItem>({
          columnId: column,
          renderHeaderCell: () => <>{column}</>,
          renderCell: (item) => <>{item[column]}</>,
        }),
      ),
    [columnValues],
  )

  return (
    <section className={classes.root}>
      <Title1>Upload</Title1>
      <Card className={classes.card}>
        <CardHeader header={<Title2>Options</Title2>} />
        <Field label="File" required={true}>
          <FileInput
            zoneOptions={zoneOptions}
            appearance="filled-darker"
            value={fileName}
          />
        </Field>
        {hasFile && <Field />}
        {hasFile && !isCSV && (
          <Field label="Sheet" required={true}>
            <Dropdown
              appearance="filled-darker"
              className={classes.input}
              onOptionSelect={handleSheetSelect}
              value={selectedSheetName}
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
      <UniqueColumnsAlert
        open={alertOpen}
        setOpen={setAlertOpen}
        onConfirm={handleResetConfirm}
      />
      {columns.length > 0 && (
        <>
          <Title2>Data Preview</Title2>
          <SimpleDataGrid
            items={data.slice(1, 6)}
            columns={columns}
            cellFocusMode={() => 'cell'}
          />
        </>
      )}
      <Toaster toasterId={toasterId} />
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

interface AlertProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  onConfirm: () => void
}

const UniqueColumnsAlert = ({ open, setOpen, onConfirm }: AlertProps) => {
  const handleOpen: Required<DialogProps>['onOpenChange'] = useCallback(
    (_event, data) => {
      setOpen(data.open)
    },
    [setOpen],
  )
  return (
    <Dialog modalType="alert" open={open} onOpenChange={handleOpen}>
      <DialogSurface>
        <DialogBody>
          <DialogTitle>Confirm Reset</DialogTitle>
          <DialogContent>
            Are you sure you want to reset the file? This will delete all
            progress.
          </DialogContent>
          <DialogActions>
            <DialogTrigger disableButtonEnhancement>
              <Button>Cancel</Button>
            </DialogTrigger>
            <DialogTrigger disableButtonEnhancement>
              <Button onClick={onConfirm} appearance="primary">
                Okay
              </Button>
            </DialogTrigger>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}

Component.displayName = 'Upload'
