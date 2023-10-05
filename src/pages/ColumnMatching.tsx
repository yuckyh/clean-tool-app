import type { Progress } from '@/features/progress/reducers'
import type { AlertRef } from '@/components/AlertDialog'

import {
  makeStyles,
  shorthands,
  Button,
  Title1,
  Title2,
  tokens,
} from '@fluentui/react-components'
import { postFormattedJSON } from '@/features/sheet/actions'
import { setProgress } from '@/features/progress/reducers'
import AlertDialog from '@/components/AlertDialog'
import { createLazyMemo, just } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'
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
    navigate('/EDA')
    just<Progress>('matched')(setProgress)(dispatch)()
    void dispatch(postFormattedJSON())
  }, [dispatch, navigate])

  const alertRef = useRef<AlertRef>(null)

  return (
    <section className={classes.root}>
      <Title1>Column Matching</Title1>

      <MemoizedColumnsDataGrid alertRef={alertRef} />
      <Title2>Changes Preview</Title2>
      <MemoizedPreviewDataGrid />

      <AlertDialog
        content="You have selected the same column multiple times. Changes will not be made."
        title="Column Matching Error"
        ref={alertRef}
      />
      <div>
        <Button onClick={handleCommitChanges} appearance="primary">
          Done
        </Button>
      </div>
    </section>
  )
}

Component.displayName = 'ColumnMatching'
