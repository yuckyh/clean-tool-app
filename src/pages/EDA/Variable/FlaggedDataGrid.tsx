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
import SimpleDataGrid from '@/components/SimpleDataGrid'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { constant, identity, pipe } from 'fp-ts/function'
import { console } from 'fp-ts'
import {
  findIndex,
  fromArray,
  deleteAt,
  filter,
  makeBy,
  every,
  some,
  zip,
} from 'fp-ts/ReadonlyArray'
import { getOrElse } from 'fp-ts/Option'

type IndexedSeries = readonly (readonly [string, string])[]

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

export default function FlaggedDataGrid({ series, title }: Readonly<Props>) {
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
        ? parseInt(`${Array.from(selectedItems).pop()}`, 10)
        : pipe(
            Array.from(flaggedRows),
            fromArray,
            findIndex((flagged) => !selectedItems.has(flagged)),
            getOrElse(constant(-1)),
          )

    console.log(checkedIndex)

    const payload = series[checkedIndex] ?? []

    setFlaggedRows(selectedItems)

    if (flaggedRows.size < selectedItems.size) {
      console.log(['checking', flaggedCells.length])

      console.log(
        pipe(
          flaggedCells,
          every((cell) =>
            pipe(
              cell,
              zip(payload),
              some(([payloadValue, cellValue]) => cellValue !== payloadValue),
            ),
          ),
        ),
      )
      // just(addFlaggedCell).pass([...checked, 'outlier'])(dispatch)
      return undefined
    }
    console.log('unchecking')
    // const checkedIndex = find<TableRowId>(
    //   (flagged) => !selectedItems.has(flagged),
    // )(Array.from(flaggedRows))

    console.log([checkedIndex, Array.from(flaggedRows).at(-1)])

    console.log(
      pipe(
        flaggedCells,
        deleteAt(checkedIndex),
        getOrElse(constant(flaggedCells)),
      ),
    )
    return undefined

    // dispatch
  }

  const [indexFilter, setIndexFilter] = useState('')
  const [valueFilter, setValueFilter] = useState('')

  const handleIndexSearch: Required<InputProps>['onChange'] = useCallback(
    ({ target }) => {
      const { value } = target
      setIndexFilter(value)
      return undefined
    },
    [],
  )

  const handleValueSearch: Required<InputProps>['onChange'] = useCallback(
    ({ target }) => {
      const { value } = target
      setValueFilter(value)
      return undefined
    },
    [],
  )

  const filteredRows = useMemo(
    () =>
      pipe(
        series,
        filter(
          ([index, value]) =>
            index.includes(indexFilter) && value.includes(valueFilter),
        ),
      ),
    [indexFilter, series, valueFilter],
  )

  const items = useMemo(
    () => makeBy(filteredRows.length, identity),
    [filteredRows.length],
  )

  const columnsDefinition = useMemo(
    () => [
      createTableColumn<number>({
        renderHeaderCell: constant(
          <div className={classes.columnHeader}>sno</div>,
        ),
        renderCell: (row) => filteredRows[row]?.[1],
        columnId: 'index',
      }),
      createTableColumn<number>({
        renderHeaderCell: constant(
          <div className={classes.columnHeader}>{title}</div>,
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
        items={items as number[]}
      />
    </Card>
  )
}
