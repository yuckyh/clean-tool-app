import type { FileResponse } from '@/workers/file'
import type { DialogProps, DropdownProps } from '@fluentui/react-components'
import type { DropzoneOptions } from 'react-dropzone'

import FileInput from '@/components/FileInput'
import SimpleDataGrid from '@/components/SimpleDataGrid'
import { useAppDispatch, useAppSelector, useFetchWorkbook } from '@/hooks'
import { deleteFile, postFile } from '@/store/fileSlice'
import { deleteProgress, setProgress } from '@/store/progressSlice'
import { deleteWorkbook, setSheetName } from '@/store/sheetSlice'
import { fileWorker } from '@/workers/static'
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Dropdown,
  Field,
  Option,
  Title1,
  Title2,
  Toast,
  ToastBody,
  ToastTitle,
  Toaster,
  createTableColumn,
  makeStyles,
  shorthands,
  tokens,
  useToastController,
} from '@fluentui/react-components'
import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { utils } from 'xlsx'

type TaskType = 'deleted' | 'uploaded' | true

type CellItem = Record<Column, boolean | number | string>
type Column = number | string

const useClasses = makeStyles({
  actions: {
    display: 'grid',
    gridAutoFlow: 'column',
    width: '100%',
    ...shorthands.gap(tokens.spacingVerticalS, 0),
  },
  body: {
    display: 'grid',
    ...shorthands.gap(0, tokens.spacingVerticalS),
  },
  card: {
    width: '50%',
    ...shorthands.margin(0, 'auto'),
    ...shorthands.padding(tokens.spacingHorizontalXXXL, '5%'),
  },
  input: {
    minWidth: 'initial',
    width: '100%',
  },
  root: {
    display: 'grid',
    gridAutoFlow: 'row',
    width: '70%',
    ...shorthands.margin(0, 'auto'),
    ...shorthands.gap(0, tokens.spacingVerticalXL),
  },
})

export const Component = () => {
  const { file, fileName } = useAppSelector(({ file }) => file)
  const classes = useClasses()
  const toasterId = useId()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const fetchWorkbook = useFetchWorkbook()

  const [taskType, setTaskType] = useState<TaskType>(true)
  const [alertOpen, setAlertOpen] = useState(false)

  const { dispatchToast } = useToastController(toasterId)

  const { sheet, sheetName } = useAppSelector(({ sheet }) => sheet)
  const sheetNames = useAppSelector(({ sheet }) => sheet.workbook?.SheetNames)

  const hasFile = useMemo(() => !!file, [file])
  const isCSV = useMemo(() => file?.type === 'text/csv', [file])

  const data = useMemo(
    () => (sheet ? utils.sheet_to_json(sheet) : [[]]),
    [sheet],
  )

  const columns = useMemo(() => Object.keys(data[0] ?? {}) as Column[], [data])

  const columnItems = useMemo(
    () =>
      columns.map((column) =>
        createTableColumn<CellItem>({
          columnId: column,
          renderCell: (item) => <>{item[column]}</>,
          renderHeaderCell: () => <>{column}</>,
        }),
      ),
    [columns],
  )

  const handleFileDrop: DropzoneOptions['onDrop'] = useCallback(
    (acceptedFiles: File[]): void => {
      const [file] = acceptedFiles
      if (!file) {
        return
      }

      setTaskType('uploaded')

      void (async (file: File) => {
        await dispatch(postFile({ file }))
      })(file)
    },
    [dispatch],
  )

  const handleResetClick = useCallback(() => {
    setAlertOpen(true)
  }, [])

  const handleResetConfirm = useCallback(() => {
    setTaskType('deleted')
    dispatch(deleteProgress())
    dispatch(deleteWorkbook())
    void (async () => {
      await dispatch(deleteFile())
    })()
  }, [dispatch])

  const handleSubmit = useCallback(() => {
    dispatch(setProgress('uploaded'))

    navigate('/column-matching')
  }, [dispatch, navigate])

  const handleSheetSelect: Required<DropdownProps>['onOptionSelect'] =
    useCallback(
      (_event, { optionValue }) => {
        dispatch(setSheetName(optionValue ?? ''))
      },
      [dispatch],
    )

  const toastNotify = useCallback(() => {
    dispatchToast(<FileToast type={taskType} />, { intent: 'success' })
  }, [dispatchToast, taskType])

  const zoneOptions: DropzoneOptions = useMemo(
    () => ({
      accept: {
        'application/vnd.ms-excel': ['.xls'],
        'application/vnd.oasis.opendocument.spreadsheet': ['.ods'],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
          '.xlsx',
        ],
        'text/csv': ['.csv'],
      },
      disabled: hasFile,
      maxFiles: 1,
      onDrop: handleFileDrop,
    }),
    [handleFileDrop, hasFile],
  )

  useEffect(() => {
    const handleWorkerLoad = ({ data }: MessageEvent<FileResponse>) => {
      const isTask = data.fileName && !data.file

      if (!isTask) {
        return
      }
      setTaskType(isTask)
      toastNotify()
    }

    fileWorker.addEventListener('message', handleWorkerLoad)

    return () => {
      fileWorker.removeEventListener('message', handleWorkerLoad)
    }
  }, [taskType, toastNotify])

  useEffect(() => {
    void fetchWorkbook()
  }, [fetchWorkbook])

  return (
    <section className={classes.root}>
      <Title1>Upload</Title1>
      <Card className={classes.card}>
        <CardHeader header={<Title2>Options</Title2>} />
        <Field label="File" required={true}>
          <FileInput
            appearance="filled-darker"
            value={fileName}
            zoneOptions={zoneOptions}
          />
        </Field>
        {hasFile && <Field />}
        {hasFile && !isCSV && (
          <Field label="Sheet" required={true}>
            <Dropdown
              appearance="filled-darker"
              className={classes.input}
              onOptionSelect={handleSheetSelect}
              selectedOptions={[sheetName]}
              value={sheetName}>
              {sheetNames?.map((name) => (
                <Option key={name} text={name} value={name}>
                  {name}
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
                disabled={!hasFile}
                onClick={handleSubmit}>
                Proceed
              </Button>
            </div>
          }
        />
      </Card>
      <UniqueColumnsAlert
        onConfirm={handleResetConfirm}
        open={alertOpen}
        setOpen={setAlertOpen}
      />
      {columnItems.length > 0 && (
        <>
          <Title2>Data Preview</Title2>
          <SimpleDataGrid
            cellFocusMode={() => 'cell'}
            columns={columnItems}
            items={data.slice(1, 6)}
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
  const { fileName } = useAppSelector(({ file }) => file)

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
  onConfirm: () => void
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const UniqueColumnsAlert = ({ onConfirm, open, setOpen }: AlertProps) => {
  const handleOpen: Required<DialogProps>['onOpenChange'] = useCallback(
    (_event, data) => {
      setOpen(data.open)
    },
    [setOpen],
  )
  return (
    <Dialog modalType="alert" onOpenChange={handleOpen} open={open}>
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
              <Button appearance="primary" onClick={onConfirm}>
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
