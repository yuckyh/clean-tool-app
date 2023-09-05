import { useSheet } from '@/hooks'
import { progressStorage } from '@/lib/ProgressStorage'
import type { TableColumnDefinition } from '@fluentui/react-components'
import {
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  createTableColumn,
} from '@fluentui/react-components'
import type { NavigateFunction } from 'react-router-dom'
import { Form, useNavigate } from 'react-router-dom'
import type { WorkSheet } from 'xlsx'
import { utils } from 'xlsx'

type Item = string | number

export const Component = () => {
  const sheet = useSheet()
  return (
    <Form>
      <h1>Column Matching</h1>
      <ColumnsDataGrid sheet={sheet} />
    </Form>
  )
}

interface ColumnsDataGridProps {
  sheet?: WorkSheet
}

const ColumnsDataGrid = ({ sheet }: ColumnsDataGridProps) => {
  const navigate = useNavigate()

  if (!sheet) {
    middlewareNavigate(navigate)
    return null
  }
  const items: Item[][] = utils.sheet_to_json(sheet, { header: 1 })

  if (!items[0]) {
    middlewareNavigate(navigate)
    return null
  }

  console.log(items)

  const columns: TableColumnDefinition<Item>[] = [
    createTableColumn({
      columnId: 'column',
      renderHeaderCell: () => <>Column name</>,
      renderCell: (item) => <>{item}</>,
    }),
  ]

  return (
    <DataGrid columns={columns} items={items[0]}>
      <DataGridHeader>
        <DataGridRow selectionCell={{ 'aria-label': 'Select all rows' }}>
          {({ renderHeaderCell }) => (
            <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
          )}
        </DataGridRow>
      </DataGridHeader>
      <DataGridBody<Item>>
        {({ item, rowId }) => (
          <DataGridRow<Item>
            key={rowId}
            selectionCell={{ 'aria-label': 'Select row' }}>
            {({ renderCell }) => (
              <DataGridCell>{renderCell(item)}</DataGridCell>
            )}
          </DataGridRow>
        )}
      </DataGridBody>
    </DataGrid>
  )
}

Component.displayName = 'ColumnMatching'

const middlewareNavigate = (navigate: NavigateFunction) => {
  const { allowedPath } = progressStorage
  navigate(allowedPath.pop() ?? '/')
}
