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
import { useBeforeUnload, useNavigate } from 'react-router-dom'
import { useCallback, useEffect, useRef } from 'react'
import type { SheetInputRef } from '@/features/sheet/components/SheetUploadInput'
import type { SimpleToasterRef } from '@/components/SimpleToaster'
import type { AlertRef } from '@/components/AlertDialog'

import {
  useLoadingTransition,
  useAppDispatch,
  useAppSelector,
} from '@/lib/hooks'
import { saveColumnState, deleteColumns } from '@/features/columns/reducers'
import SheetPickerInput from '@/features/sheet/components/SheetPickerInput'
import SheetUploadInput from '@/features/sheet/components/SheetUploadInput'
import { deleteProgressState, setProgress } from '@/features/progress/reducers'
import PreviewDataGrid from '@/features/sheet/components/PreviewDataGrid'
import { deleteSheet, fetchSheet } from '@/features/sheet/actions'
import VisitsInput from '@/features/sheet/components/VisitsInput'
import { getColumnsLength } from '@/features/sheet/selectors'
import { saveSheetState } from '@/features/sheet/reducers'
import SimpleToaster from '@/components/SimpleToaster'
import AlertDialog from '@/components/AlertDialog'
import { just } from '@/lib/monads'

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

// eslint-disable-next-line import/prefer-default-export
export function Component() {
  const classes = useClasses()

  const navigate = useNavigate()

  const dispatch = useAppDispatch()

  const hasSheet = useAppSelector(({ sheet }) => !!sheet.data.length)
  const hasMultipleSheets = useAppSelector(({ sheet }) => !sheet.bookType)
  const columnsLength = useAppSelector(getColumnsLength)

  const [isLoading, stopLoading] = useLoadingTransition()

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
    just(deleteProgressState).pass()(dispatch)
    just(deleteColumns).pass()(dispatch)
    just(deleteSheet)
      .pass()((x) => dispatch(x))()
      .catch(console.error)
  }, [dispatch])

  const handleSubmit = useCallback(() => {
    just(setProgress).pass('uploaded')((x) => dispatch(x))

    navigate('/column-matching')
  }, [dispatch, navigate])

  useEffect(() => {
    if (columnsLength) {
      stopLoading()
      return
    }

    just(fetchSheet)
      .pass()((x) => dispatch(x))()
      .catch(console.error)
      .finally(stopLoading)
  }, [columnsLength, dispatch, stopLoading])

  useBeforeUnload(
    useCallback(() => {
      just(saveSheetState).pass()((x) => dispatch(x))
      just(saveColumnState).pass()((x) => dispatch(x))
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
      {!isLoading ? (
        <PreviewDataGrid isOriginal />
      ) : (
        <Spinner
          label={<Subtitle1>Loading Preview...</Subtitle1>}
          labelPosition="below"
          size="huge"
        />
      )}
      <SimpleToaster ref={toasterRef} />
    </section>
  )
}

Component.displayName = 'Upload'
