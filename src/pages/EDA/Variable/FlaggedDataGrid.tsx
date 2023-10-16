import type {
  DataGridCellFocusMode,
  DataGridProps,
  InputProps,
  TableRowId,
} from '@fluentui/react-components'

import {
  createTableColumn,
  makeStyles,
  shorthands,
  tokens,
  Title2,
  Field,
  Input,
  Card,
} from '@fluentui/react-components'
import { useCallback, useState, useMemo } from 'react'
import {
  findIndex,
  constant,
  parseInt,
  includes,
  filter,
  range,
  every,
  some,
  flow,
  zip,
} from 'lodash/fp'
import SimpleDataGrid from '@/components/SimpleDataGrid'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { addFlaggedCell } from '@/features/sheet/reducers'
import { just } from '@/lib/monads'

type IndexedSeries = (readonly [string, string])[]

interface Props {
  series: IndexedSeries
  title: string
}

const useClasses = makeStyles({
  card: {
    width: '100%',
    ...shorthands.margin(0, 'auto'),
    ...shorthands.padding(tokens.spacingHorizontalXXXL, '5%'),
  },
  columns: {
    columnGap: tokens.spacingVerticalXL,
    display: 'flex',
    width: '100%',
  },
  columnHeader: {
    fontWeight: 'bold',
  },
  input: {
    minWidth: '150px',
  },
})

const cellFocusMode: () => DataGridCellFocusMode = constant('none')

export default function FlaggedDataGrid({ series, title }: Props) {
  const classes = useClasses()

  const dispatch = useAppDispatch()

  const [flaggedRows, setFlaggedRows] = useState(new Set<TableRowId>([]))
  const flaggedCells = useAppSelector(({ sheet }) => sheet.flaggedCells)

  const handleSelectionChange: DataGridProps['onSelectionChange'] = (
    _1,
    { selectedItems },
  ) => {
    const checkedIndex =
      flaggedRows.size < selectedItems.size
        ? parseInt(10)(`${Array.from(selectedItems).pop()}`)
        : findIndex<TableRowId>((flagged) => !selectedItems.has(flagged))(
            Array.from(flaggedRows),
          )

    console.log(checkedIndex)

    const payload = series[checkedIndex] ?? []

    if (flaggedRows.size < selectedItems.size) {
      console.log('checking', flaggedCells.length)

      console.log(
        every(
          flow(
            zip(payload),
            some(([payloadValue, cell]) => cell !== payloadValue),
          )(flaggedCells),
        ),
      )
      // just(addFlaggedCell).pass([...checked, 'outlier'])(dispatch)
    } else {
      console.log('unchecking')
      // const checkedIndex = find<TableRowId>(
      //   (flagged) => !selectedItems.has(flagged),
      // )(Array.from(flaggedRows))

      console.log(checkedIndex, Array.from(flaggedRows).at(-1))

      console.log(flaggedCells.splice(checkedIndex, 1))
    }

    // dispatch
    setFlaggedRows(selectedItems)
  }

  const [indexFilter, setIndexFilter] = useState('')
  const [valueFilter, setValueFilter] = useState('')

  const handleIndexSearch: Required<InputProps>['onChange'] = useCallback(
    ({ target }) => {
      const { value } = target
      setIndexFilter(value)
    },
    [],
  )

  const handleValueSearch: Required<InputProps>['onChange'] = useCallback(
    ({ target }) => {
      const { value } = target
      setValueFilter(value)
    },
    [],
  )

  const filteredRows = useMemo(
    () =>
      filter<readonly [string, string]>(
        ([value, index]) =>
          includes(indexFilter)(index) && includes(valueFilter)(value),
      )(series),
    [indexFilter, series, valueFilter],
  )

  const items = useMemo(
    () => range(0)(filteredRows.length),
    [filteredRows.length],
  )

  const columnsDefinition = useMemo(
    () => [
      createTableColumn<number>({
        renderHeaderCell: () => <div className={classes.columnHeader}>sno</div>,
        renderCell: (row) => filteredRows[row]?.[1],
        columnId: 'index',
      }),
      createTableColumn<number>({
        renderHeaderCell: () => (
          <div className={classes.columnHeader}>{title}</div>
        ),
        renderCell: (row) => filteredRows[row]?.[0],
        columnId: title,
      }),
    ],
    [classes.columnHeader, filteredRows, title],
  )

  return (
    <Card className={classes.card} size="large">
      <Title2>Data Flagging</Title2>
      <div className={classes.columns}>
        <Field label="Search sno">
          <Input
            onChange={handleIndexSearch}
            appearance="filled-darker"
            className={classes.input}
          />
        </Field>
        <Field label="Search values">
          <Input
            onChange={handleValueSearch}
            appearance="filled-darker"
            className={classes.input}
          />
        </Field>
      </div>
      <SimpleDataGrid
        onSelectionChange={handleSelectionChange}
        cellFocusMode={cellFocusMode}
        selectionMode="multiselect"
        selectedItems={flaggedRows}
        columns={columnsDefinition}
        items={items}
      />
    </Card>
  )
}
