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

import { setProgress } from '@/features/progress/reducers'
import AlertDialog from '@/components/AlertDialog'
import { createLazyMemo } from '@/lib/utils'
import { just } from '@/lib/monads'
import { useAppDispatch } from '@/lib/hooks'

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

// eslint-disable-next-line import/prefer-default-export
export function Component() {
  const classes = useClasses()

  const navigate = useNavigate()

  const dispatch = useAppDispatch()

  const handleCommitChanges = useCallback(() => {
    navigate('/eda')
    just(setProgress).pass('matched')(dispatch)
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

Component.displayName = 'ColumnMatching'
