import type { SheetInputRef } from '@/features/sheet/components/SheetUploadInput'
import type { SimpleToasterRef } from '@/components/SimpleToaster'
import type { AlertRef } from '@/components/AlertDialog'

import {
  CardFooter,
  CardHeader,
  makeStyles,
  shorthands,
  Subtitle1,
  Spinner,
  Button,
  Title1,
  Title2,
  tokens,
  Card,
} from '@fluentui/react-components'
import {
  useLoadingTransition,
  useAppDispatch,
  useAppSelector,
  useAsyncEffect,
} from '@/lib/hooks'
import SheetPickerInput from '@/features/sheet/components/SheetPickerInput'
import SheetUploadInput from '@/features/sheet/components/SheetUploadInput'
import { deleteProgress, setProgress } from '@/features/progress/reducers'
import PreviewDataGrid from '@/features/sheet/components/PreviewDataGrid'
import { deleteWorkbook, fetchWorkbook } from '@/features/sheet/actions'
import VisitsInput from '@/features/sheet/components/VisitsInput'
import { deleteColumns } from '@/features/columns/reducers'
import { saveSheetState } from '@/features/sheet/reducers'
import { getColumns } from '@/features/sheet/selectors'
import SimpleToaster from '@/components/SimpleToaster'
import { useCallback, useEffect, useRef } from 'react'
import AlertDialog from '@/components/AlertDialog'
import { useNavigate } from 'react-router-dom'

const useClasses = makeStyles({
  root: {
    rowGap: tokens.spacingVerticalXL,
    flexDirection: 'column',
    display: 'flex',
    width: '70%',
    ...shorthands.margin(0, 'auto'),
  },
  card: {
    width: '50%',
    ...shorthands.margin(0, 'auto'),
    ...shorthands.padding(tokens.spacingHorizontalXXXL, '5%'),
  },
  actions: {
    columnGap: tokens.spacingVerticalS,
    display: 'flex',
    width: '100%',
  },
  body: {
    rowGap: tokens.spacingVerticalS,
    display: 'flex',
  },
  input: {
    minWidth: 'initial',
    width: '100%',
  },
})

export const Component = () => {
  const classes = useClasses()

  const navigate = useNavigate()

  const dispatch = useAppDispatch()

  const sheetName = useAppSelector(({ sheet }) => sheet.sheetName)
  const fileName = useAppSelector(({ sheet }) => sheet.fileName)
  const hasSheet = useAppSelector(
    ({ sheet }) => !!sheet.original.sheets[sheetName],
  )
  const hasMultipleSheets = useAppSelector(({ sheet }) => !sheet.bookType)
  const originalColumns = useAppSelector((state) => getColumns(state))

  const [isLoading, setIsLoading] = useLoadingTransition()

  const alertRef = useRef<AlertRef>(null)
  const toasterRef = useRef<SimpleToasterRef>(null)
  const sheetInputRef = useRef<SheetInputRef>(null)

  const handleResetClick = () => {
    alertRef.current?.open()
  }

  const handleResetConfirm = useCallback(() => {
    sheetInputRef.current?.setFileTask('deleted')
    dispatch(deleteProgress())
    dispatch(deleteColumns())
    void dispatch(deleteWorkbook())
  }, [dispatch])

  const handleSubmit = useCallback(() => {
    dispatch(setProgress('uploaded'))

    navigate('/column-matching')
  }, [dispatch, navigate])

  useAsyncEffect(async () => {
    await dispatch(fetchWorkbook(fileName))
    setIsLoading(false)
  }, [dispatch, fileName])

  useEffect(() => {
    const handleUnload = () => {
      dispatch(saveSheetState())
    }

    window.addEventListener('unload', handleUnload)

    return () => {
      window.removeEventListener('unload', handleUnload)
    }
  }, [dispatch])

  return (
    <section className={classes.root}>
      <Title1>Upload</Title1>
      <Card className={classes.card}>
        <CardHeader header={<Title2>Options</Title2>} />

        <SheetUploadInput toasterRef={toasterRef} ref={sheetInputRef} />

        {hasSheet && !hasMultipleSheets && <SheetPickerInput />}
        {hasSheet && <VisitsInput />}
        <CardFooter
          action={
            <div className={classes.actions}>
              <Button onClick={handleResetClick} disabled={!hasSheet}>
                Reset
              </Button>
              <Button
                onClick={handleSubmit}
                appearance="primary"
                disabled={!hasSheet}>
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
        title="Confirm Reset"
        ref={alertRef}
      />
      {originalColumns.length > 0 &&
        (!isLoading ? (
          <>
            <Title2>Data Preview</Title2>
            <PreviewDataGrid isOriginal />
          </>
        ) : (
          <Spinner
            label={<Subtitle1>Loading Preview...</Subtitle1>}
            labelPosition="below"
            size="huge"
          />
        ))}
      <SimpleToaster ref={toasterRef} />
    </section>
  )
}

Component.displayName = 'Upload'
