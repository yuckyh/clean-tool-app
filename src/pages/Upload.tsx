import type { SimpleToasterRef } from '@/components/SimpleToaster'
import type { SheetResponse } from '@/workers/sheet'
import type { DropdownProps, InputProps } from '@fluentui/react-components'
import type { DropzoneOptions } from 'react-dropzone'

import { sheetWorker } from '@/app/workers'
import FileInput from '@/components/FileInput'
import PreviewDataGrid from '@/components/PreviewDataGrid'
import SimpleToaster from '@/components/SimpleToaster'
import { deleteColumns } from '@/features/columnsSlice'
import { deleteProgress, setProgress } from '@/features/progressSlice'
import {
  deleteWorkbook,
  fetchWorkbook,
  getOriginalColumns,
  postFile,
  setSheetName,
  setVisits,
} from '@/features/sheetSlice'
import {
  useAppDispatch,
  useAppSelector,
  useAsyncCallback,
  useAsyncEffect,
  useLoadingTransition,
} from '@/lib/hooks'
import { just } from '@/lib/utils'
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Dropdown,
  Field,
  Input,
  Option,
  Title1,
  Title2,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { AlertRef } from '../components/AlertDialog'
import type { FileTaskType } from '../components/FileToast'

import { AlertDialog } from '../components/AlertDialog'
import FileToast from '../components/FileToast'

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
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { bookType, fileName, sheetName, sheetNames, sheets, visits } =
    useAppSelector(({ sheet }) => sheet)
  const hasSheet = !!sheets?.[sheetName]
  const isCSV = bookType === 'csv'
  const originalColumns = useAppSelector(getOriginalColumns)

  const classes = useClasses()

  const alertRef = useRef<AlertRef>(null)
  const toasterRef = useRef<SimpleToasterRef>(null)

  const [isLoading, setIsLoading] = useLoadingTransition()
  const [fileTask, setFileTask] = useState<FileTaskType | undefined>()

  const handleFileDrop: DropzoneOptions['onDrop'] = useAsyncCallback(
    async (acceptedFiles: File[]) => {
      const [file] = acceptedFiles
      if (!file) {
        return
      }

      setFileTask('uploaded')

      await just({ file })(postFile)((x) => dispatch(x))()

      setIsLoading(true)
    },
    [dispatch, setIsLoading],
  )

  const handleResetClick = () => {
    alertRef.current?.openAlert()
  }

  const handleResetConfirm = useCallback(() => {
    setFileTask('deleted')
    dispatch(deleteProgress())
    dispatch(deleteColumns())
    void dispatch(deleteWorkbook())
  }, [dispatch])

  const handleSubmit = useCallback(() => {
    dispatch(setProgress('uploaded'))

    navigate('/column-matching')
  }, [dispatch, navigate])

  const handleSheetSelect: Required<DropdownProps>['onOptionSelect'] =
    useCallback(
      (_event, { optionValue = '' }) => {
        just(optionValue)(setSheetName)(dispatch)()
      },
      [dispatch],
    )

  const handleVisitChange: Required<InputProps>['onChange'] = useCallback(
    (_event, { value }) => {
      just(value)(parseInt)(setVisits)(dispatch)()
    },
    [dispatch],
  )

  const toastNotify = useCallback(() => {
    fileTask &&
      toasterRef.current?.dispatchToast(<FileToast fileTask={fileTask} />, {
        intent: 'success',
      })
  }, [fileTask])

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
      disabled: hasSheet,
      maxFiles: 1,
      onDrop: handleFileDrop,
    }),
    [handleFileDrop, hasSheet],
  )

  useEffect(() => {
    const handleWorkerLoad = ({ data }: MessageEvent<SheetResponse>) => {
      const isTask = data.fileName && !data.workbook

      if (!isTask) {
        setFileTask(undefined)
        return
      }

      toastNotify()
    }

    sheetWorker.addEventListener('message', handleWorkerLoad)

    return () => {
      sheetWorker.removeEventListener('message', handleWorkerLoad)
    }
  }, [toastNotify])

  useAsyncEffect(async () => {
    await just(fileName)(fetchWorkbook)(dispatch)()
    setIsLoading(false)
  }, [dispatch, fileName])

  return (
    <section className={classes.root}>
      <Title1>Upload</Title1>
      <Card className={classes.card}>
        <CardHeader header={<Title2>Options</Title2>} />
        <Field label="File" required>
          <FileInput
            appearance="filled-darker"
            value={fileName}
            zoneOptions={zoneOptions}
          />
        </Field>
        {hasSheet && !isCSV && (
          <Field label="Sheet" required>
            <Dropdown
              appearance="filled-darker"
              className={classes.input}
              onOptionSelect={handleSheetSelect}
              selectedOptions={[sheetName]}
              value={sheetName}>
              {sheetNames.map((name) => (
                <Option key={name} text={name} value={name}>
                  {name}
                </Option>
              ))}
            </Dropdown>
          </Field>
        )}
        {hasSheet && (
          <Field label="Number of visits" required>
            <Input
              appearance="filled-darker"
              className={classes.input}
              onChange={handleVisitChange}
              type="number"
              value={visits.toString()}
            />
          </Field>
        )}
        <CardFooter
          action={
            <div className={classes.actions}>
              <Button disabled={!hasSheet} onClick={handleResetClick}>
                Reset
              </Button>
              <Button
                appearance="primary"
                disabled={!hasSheet}
                onClick={handleSubmit}>
                Proceed
              </Button>
            </div>
          }
        />
      </Card>
      <AlertDialog
        content="Are you sure you want to reset the file? This will delete all
        progress."
        onConfirm={handleResetConfirm}
        ref={alertRef}
        title="Confirm Reset"
      />
      {originalColumns.length > 0 && !isLoading && (
        <>
          <Title2>Data Preview</Title2>
          <PreviewDataGrid columns={originalColumns} />
        </>
      )}
      <SimpleToaster ref={toasterRef} />
    </section>
  )
}

Component.displayName = 'Upload'
