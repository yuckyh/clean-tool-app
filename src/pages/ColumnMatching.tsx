import type { AlertRef } from '@/components/AlertDialog'

import { AlertDialog } from '@/components/AlertDialog'
import PreviewDataGrid from '@/components/PreviewDataGrid'
import { getFormattedColumns } from '@/features/columnsSlice'
import { setProgress } from '@/features/progressSlice'
import { getFormattedData, postFormattedJSON } from '@/features/sheetSlice'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { just } from '@/lib/utils'
import {
  Button,
  Title1,
  Title2,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import { lazy, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const useClasses = makeStyles({
  root: {
    display: 'grid',
    width: '70%',
    ...shorthands.margin(0, 'auto'),
    ...shorthands.gap(0, tokens.spacingVerticalS),
  },
})

const ColumnsDataGrid = lazy(() => import('@/components/ColumnsDataGrid'))

export const Component = () => {
  const classes = useClasses()

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { fileName, sheetName } = useAppSelector(({ sheet }) => sheet)
  const formattedColumns = useAppSelector(getFormattedColumns)
  const formattedData = useAppSelector(getFormattedData)

  const handleCommitChanges = useCallback(() => {
    navigate('/EDA')
    just<Progres>('matched')(setProgress)(dispatch)
    void just({ fileName, formattedData, sheetName })(postFormattedJSON)(
      dispatch,
    )
  }, [dispatch, fileName, formattedData, navigate, sheetName])

  const alertRef = useRef<AlertRef>(null)

  return (
    <section className={classes.root}>
      <Title1>Column Matching</Title1>

      <ColumnsDataGrid alertRef={alertRef} />
      <Title2>Changes Preview</Title2>
      {formattedColumns.length > 0 && (
        <PreviewDataGrid columns={formattedColumns} />
      )}

      <AlertDialog
        content="You have selected the same column multiple times. Changes will not be made."
        ref={alertRef}
        title="Column Matching Error"
      />
      <div>
        <Button appearance="primary" onClick={handleCommitChanges}>
          Done
        </Button>
      </div>
    </section>
  )
}

Component.displayName = 'ColumnMatching'
