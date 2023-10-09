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
} from '@/lib/hooks'
import { saveColumnState, deleteColumns } from '@/features/columns/reducers'
import SheetPickerInput from '@/features/sheet/components/SheetPickerInput'
import SheetUploadInput from '@/features/sheet/components/SheetUploadInput'
import { deleteProgress, setProgress } from '@/features/progress/reducers'
import PreviewDataGrid from '@/features/sheet/components/PreviewDataGrid'
import { deleteWorkbook, fetchWorkbook } from '@/features/sheet/actions'
import VisitsInput from '@/features/sheet/components/VisitsInput'
import { getColumns, getSheet } from '@/features/sheet/selectors'
import { useBeforeUnload, useNavigate } from 'react-router-dom'
import { saveSheetState } from '@/features/sheet/reducers'
import SimpleToaster from '@/components/SimpleToaster'
import { useCallback, useEffect, useRef } from 'react'
import AlertDialog from '@/components/AlertDialog'

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

  const fileName = useAppSelector(({ sheet }) => sheet.fileName)
  const hasSheet = useAppSelector((state) => !!getSheet(state))
  const hasMultipleSheets = useAppSelector(({ sheet }) => !sheet.bookType)
  const originalColumnsLength = useAppSelector(
    (state) => getColumns(state).length,
  )

  const [isLoading, setIsLoading] = useLoadingTransition()

  const alertRef = useRef<AlertRef>(null)
  const toasterRef = useRef<SimpleToasterRef>(null)
  const sheetInputRef = useRef<SheetInputRef>(null)

  const handleResetClick = useCallback(() => {
    alertRef.current?.setContent(
      'Are you sure you want to reset the file? This will delete all progress.',
    )
    alertRef.current?.setTitle('Confirm Reset')
    alertRef.current?.open()
  }, [alertRef])

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

  useEffect(() => {
    void dispatch(fetchWorkbook(fileName)).then(() => {
      setIsLoading(false)
    })
  }, [dispatch, fileName])

  useBeforeUnload(
    useCallback(() => {
      dispatch(saveSheetState())
      dispatch(saveColumnState())
    }, [dispatch]),
  )

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
      <AlertDialog onConfirm={handleResetConfirm} ref={alertRef} />
      {originalColumnsLength > 0 &&
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
