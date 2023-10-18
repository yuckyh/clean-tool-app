/* eslint-disable functional/functional-parameters */
/* eslint-disable import/prefer-default-export */
import {
  makeStyles,
  shorthands,
  Button,
  Title1,
  tokens,
} from '@fluentui/react-components'
import { useNavigate } from 'react-router-dom'
import { useCallback, useRef } from 'react'
import type { AlertRef } from '@/components/AlertDialog'

import type { Progress } from '@/features/progress/reducers'
import { setProgress } from '@/features/progress/reducers'
import AlertDialog from '@/components/AlertDialog'
import { createLazyMemo, noOpIO } from '@/lib/utils'
import { useAppDispatch } from '@/lib/hooks'
import { pipe } from 'fp-ts/function'

const useClasses = makeStyles({
  root: {
    rowGap: tokens.spacingVerticalXL,
    flexDirection: 'column',
    display: 'flex',
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

  const handleCommitChanges = useCallback(() => {
    pipe(
      'matched' as Progress,
      setProgress,
      dispatch,
      () => {
        navigate('/eda')
        return undefined
      },
      noOpIO,
    )()
    return undefined
  }, [dispatch, navigate])

  const alertRef = useRef<AlertRef>(null)

  return (
    <section className={classes.root}>
      <Title1>Column Matching</Title1>

      <MemoizedColumnsDataGrid alertRef={alertRef} />
      <MemoizedPreviewDataGrid />

      <AlertDialog ref={alertRef} />
      <div>
        <Button onClick={handleCommitChanges} appearance="primary">
          Done
        </Button>
      </div>
    </section>
  )
}
