import type { AlertRef } from '@/components/AlertDialog'

import {
  makeStyles,
  shorthands,
  Button,
  Title1,
  tokens,
} from '@fluentui/react-components'
import { postFormattedJSON } from '@/features/sheet/actions'
import { setProgress } from '@/features/progress/reducers'
import AlertDialog from '@/components/AlertDialog'
import { useNavigate } from 'react-router-dom'
import { createLazyMemo } from '@/lib/utils'
import { useAppDispatch } from '@/lib/hooks'
import { useCallback, useRef } from 'react'

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
  () => import('@/components/ColumnsDataGrid'),
)

const MemoizedPreviewDataGrid = createLazyMemo(
  'MemoizedPreviewDataGrid',
  () => import('@/features/sheet/components/PreviewDataGrid'),
)

export const Component = () => {
  const classes = useClasses()

  const navigate = useNavigate()

  const dispatch = useAppDispatch()

  const handleCommitChanges = useCallback(() => {
    navigate('/eda')
    dispatch(setProgress('matched'))
    void dispatch(postFormattedJSON())
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
