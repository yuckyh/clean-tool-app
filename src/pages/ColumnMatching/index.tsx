/**
 * @file This file contains the column matching page component.
 * @module pages/ColumnMatching
 */

import type { AlertRef } from '@/components/AlertDialog'
import type { Progress } from '@/reducers/progress'
import type { RefObject } from 'react'

import AlertDialog from '@/components/AlertDialog'
import { useAppDispatch } from '@/lib/hooks'
import { createLazyMemo } from '@/lib/utils'
import { setProgress } from '@/reducers/progress'
import {
  Button,
  Title1,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import * as IO from 'fp-ts/IO'
import * as f from 'fp-ts/function'
import { useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const MemoizedColumnsDataGrid = createLazyMemo(
  'MemoizedColumnsDataGrid',
  import('@/pages/ColumnMatching/MatchesDataGrid'),
)

const MemoizedPreviewDataGrid = createLazyMemo(
  'MemoizedPreviewDataGrid',
  import('@/components/data/PreviewDataGrid'),
)

const useClasses = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalXL,
    width: '70%',
    ...shorthands.margin(0, 'auto'),
  },
})

/**
 * This hook is used to initialize the alert dialogs.
 * @param errorAlertRef - The error alert ref object.
 * @param infoAlertRef - The info alert ref object.
 * @example
 * ```tsx
 *  useAlertInit(errorAlertRef, infoAlertRef)
 * ```
 */
const useAlertInit = (
  errorAlertRef: RefObject<AlertRef>,
  infoAlertRef: RefObject<AlertRef>,
) => {
  useEffect(() => {
    errorAlertRef.current?.setContent(
      'You have selected the same column multiple times. Changes will not be made. Please select a different match and visit first if this was your intention',
    )
    errorAlertRef.current?.setTitle('Column Matching Error')
  }, [errorAlertRef])

  useEffect(() => {
    infoAlertRef.current?.setContent(
      'We have automatically set the visit based on duplicating matches, if this was a mistake please edit accordingly.',
    )
    infoAlertRef.current?.setTitle('Visits Inferred')
  }, [infoAlertRef])
}

/**
 * The column matching page.
 * This page is responsible for matching the columns of the uploaded sheet to the columns from the codebook.
 * @category Page
 * @returns The component object.
 * @example
 * ```tsx
 *  <Route lazy={defaultLazyComponent(import('../pages/ColumnMatching'))} />
 * ```
 */
export default function ColumnMatching() {
  const classes = useClasses()

  const navigate = useNavigate()

  const dispatch = useAppDispatch()

  const handleMatchingSubmit = useCallback(() => {
    f.pipe(
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

  useAlertInit(errorAlertRef, infoAlertRef)

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
