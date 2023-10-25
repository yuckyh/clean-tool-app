/* eslint-disable functional/functional-parameters */
import type { AlertRef } from '@/components/AlertDialog'
import type { Progress } from '@/features/progress/reducers'

import AlertDialog from '@/components/AlertDialog'
import { setProgress } from '@/features/progress/reducers'
import { useAppDispatch } from '@/lib/hooks'
import { createLazyMemo } from '@/lib/utils'
/* eslint-disable import/prefer-default-export */
import {
  Button,
  Title1,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import * as IO from 'fp-ts/IO'
import { pipe } from 'fp-ts/function'
import { useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const useClasses = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalXL,
    width: '70%',
    ...shorthands.margin(0, 'auto'),
  },
})

const MemoizedColumnsDataGrid = createLazyMemo(
  'MemoizedColumnsDataGrid',
  () => import('@/pages/ColumnMatching/ColumnsDataGrid'),
)

const MemoizedPreviewDataGrid = createLazyMemo(
  'MemoizedPreviewDataGrid',
  () => import('@/features/sheet/components/PreviewDataGrid'),
)

export function Component() {
  const classes = useClasses()

  const navigate = useNavigate()

  const dispatch = useAppDispatch()

  const handleMatchingSubmit = useCallback(() => {
    pipe(
      'matched' as Progress,
      setProgress,
      (x) => dispatch(x),
      () => {
        navigate('/eda')
      },
      IO.of,
    )()
  }, [dispatch, navigate])

  const errorAlertRef = useRef<AlertRef>(null)
  const infoAlertRef = useRef<AlertRef>(null)

  useEffect(() => {
    errorAlertRef.current?.setContent(
      'You have selected the same column multiple times. Changes will not be made. Please select a different match and visit first if this was your intention',
    )
    errorAlertRef.current?.setTitle('Column Matching Error')
    infoAlertRef.current?.setContent(
      'We have automatically set the visit based on duplicating matches, if this was a mistake please edit accordingly.',
    )
    infoAlertRef.current?.setTitle('Visits Inferred')
  }, [errorAlertRef])

  return (
    <section className={classes.root}>
      <Title1>Column Matching</Title1>

      <MemoizedColumnsDataGrid
        errorAlertRef={errorAlertRef}
        infoAlertRef={infoAlertRef}
      />
      <MemoizedPreviewDataGrid />

      <AlertDialog ref={errorAlertRef} />
      <AlertDialog noCancel ref={infoAlertRef} />
      <div>
        <Button appearance="primary" onClick={handleMatchingSubmit}>
          Done
        </Button>
      </div>
    </section>
  )
}
