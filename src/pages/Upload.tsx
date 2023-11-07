/* eslint-disable
  functional/functional-parameters
*/

import type { AlertRef } from '@/components/AlertDialog'
import type { Progress } from '@/features/progress/reducers'
import type { SheetInputRef } from '@/features/sheet/components/SheetUploadInput'

import AlertDialog from '@/components/AlertDialog'
import { deleteColumns } from '@/features/columns/reducers'
import { deleteProgressState, setProgress } from '@/features/progress/reducers'
import { deleteSheet, fetchSheet } from '@/features/sheet/actions'
import PreviewDataGrid from '@/features/sheet/components/PreviewDataGrid'
import SheetPickerInput from '@/features/sheet/components/SheetPickerInput'
import SheetUploadInput from '@/features/sheet/components/SheetUploadInput'
import VisitsInput from '@/features/sheet/components/VisitsInput'
import { promisedTask } from '@/lib/fp'
import { dumpError } from '@/lib/fp/logger'
import {
  useAppDispatch,
  useAppSelector,
  useLoadingTransition,
} from '@/lib/hooks'
import { getColumnsLength } from '@/selectors/columns/selectors'
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Spinner,
  Subtitle1,
  Title1,
  Title2,
  // Toaster,
  makeStyles,
  shorthands,
  tokens,
  useId,
} from '@fluentui/react-components'
import * as IO from 'fp-ts/IO'
import * as RA from 'fp-ts/ReadonlyArray'
import * as T from 'fp-ts/Task'
import * as TE from 'fp-ts/TaskEither'
import * as f from 'fp-ts/function'
import { useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const useClasses = makeStyles({
  actions: {
    columnGap: tokens.spacingVerticalS,
    display: 'flex',
    width: '100%',
  },
  body: {
    display: 'flex',
    rowGap: tokens.spacingVerticalS,
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
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalXL,
    width: '70%',
    ...shorthands.margin(0, 'auto'),
  },
})

/**
 * The upload page.
 * This page is used to upload the file, select the sheet if it has more than one sheet, and also specify the visit information.
 * This page is also where the user can reset the cleaning process.
 * @category Page
 * @returns The component object
 */
export default function Upload() {
  const classes = useClasses()

  const navigate = useNavigate()

  const dispatch = useAppDispatch()

  const hasSheet = useAppSelector(({ sheet }) => !!sheet.data.length)
  const hasMultipleSheets = useAppSelector(({ sheet }) => !sheet.bookType)
  const columnsLength = useAppSelector(getColumnsLength)

  const [isLoading, stopLoading] = useLoadingTransition()

  const toasterId = useId()

  const alertRef = useRef<AlertRef>(null)
  // const toasterRef = useRef<SimpleToasterRef>(null)
  const sheetInputRef = useRef<SheetInputRef>(null)

  useEffect(() => {
    alertRef.current?.setContent(
      'Are you sure you want to reset the file? This will delete all progress.',
    )
    alertRef.current?.setTitle('Confirm Reset')
  }, [alertRef])

  const handleResetClick = useCallback(() => {
    alertRef.current?.open()
  }, [alertRef])

  const handleResetConfirm = useCallback(() => {
    f.pipe(
      [deleteProgressState, deleteColumns] as const,
      RA.map(f.flow((x) => dispatch(x()), IO.of)),
      IO.sequenceArray,
      f.constant(sheetInputRef.current?.setFileTask('deleted')),
      IO.of,
      IO.tap(IO.of),
      () => deleteSheet,
      T.of,
      T.tap((x) => f.pipe(dispatch(x()), promisedTask)),
      T.tapIO(
        IO.of(() => {
          localStorage.clear()
        }),
      ),
    )().catch(dumpError)
  }, [dispatch])

  const handleUploadSubmit = useCallback(() => {
    return f.pipe(
      'uploaded' as Progress,
      setProgress,
      (x) => dispatch(x),
      IO.of,
      IO.tap(
        IO.of(() => {
          // globalThis.location.reload()
          /* Workaround to fix a bug, removes the transition animation
            Supposed to be */
          navigate('/column-matching')
          // globalThis.location.reload()
          // eslint-disable-next-line functional/immutable-data
          // globalThis.location.href = '/column-matching'
        }),
      ),
    )()
  }, [dispatch])

  useEffect(() => {
    f.pipe(
      columnsLength,
      (length): TE.TaskEither<typeof fetchSheet, void> =>
        length === 0 ? TE.left(fetchSheet) : TE.fromIO(stopLoading),
      TE.getOrElse((x) =>
        f.pipe(
          stopLoading,
          T.fromIO,
          T.tap(() => f.pipe(dispatch(x()), promisedTask)),
        ),
      ),
    )().catch(dumpError)
    return undefined
  }, [columnsLength, dispatch, stopLoading])

  return (
    <section className={classes.root}>
      <Title1>Upload</Title1>
      <Card className={classes.card}>
        <CardHeader header={<Title2>Options</Title2>} />

        <SheetUploadInput ref={sheetInputRef} toasterId={toasterId} />

        {hasSheet && !hasMultipleSheets && <SheetPickerInput />}
        {hasSheet && <VisitsInput />}
        <CardFooter
          action={
            <div className={classes.actions}>
              <Button disabled={!hasSheet} onClick={handleResetClick}>
                Reset
              </Button>
              <Button
                appearance="primary"
                disabled={!hasSheet}
                onClick={handleUploadSubmit}>
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
      {/* <Toaster toasterId={toasterId} /> */}
    </section>
  )
}
