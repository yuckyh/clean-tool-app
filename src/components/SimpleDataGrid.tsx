import type {
  DataGridProps,
  TableColumnDefinition,
} from '@fluentui/react-components'
import {
  DataGrid,
  DataGridHeader,
  DataGridRow,
  DataGridHeaderCell,
  DataGridBody,
  DataGridCell,
} from '@fluentui/react-components'

interface SimpleDataGridProps<T> {
  items: T[]
  dataGridProps: DataGridProps
}

const SimpleDataGrid: <T>(props: SimpleDataGridProps<T>) => JSX.Element = ({
  items,
  dataGridProps,
}) => (
  <DataGrid {...dataGridProps}>
    <DataGridHeader>
      <DataGridRow>
        {({ renderHeaderCell }) => (
          <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
        )}
      </DataGridRow>
    </DataGridHeader>
    <DataGridBody<(typeof items)[0]>>
      {({ item, rowId }) => (
        <DataGridRow<(typeof items)[0]> key={rowId}>
          {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
        </DataGridRow>
      )}
    </DataGridBody>
  </DataGrid>
)

export default SimpleDataGrid
