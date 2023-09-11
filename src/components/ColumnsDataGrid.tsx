import type {
  DataGridProps,
  TableColumnDefinition,
} from '@fluentui/react-components'
import {
  createTableColumn,
  Dropdown,
  Option,
  Subtitle1,
  Caption1,
  tokens,
  makeStyles,
  Button,
  Spinner,
} from '@fluentui/react-components'
import {
  useState,
  useSyncExternalStore,
  useMemo,
  useCallback,
  useEffect,
  startTransition,
} from 'react'
import Plot from '@/components/Plot'
import { utils } from 'xlsx'
import Fuse from 'fuse.js'

import { fluentColorScale } from '@/lib/plotly'
import codebook from '@/../data/codebook.json'
import { sheetStateStore } from '@/lib/StateStore/sheet'
import { columnStateStore } from '@/lib/StateStore/column'
import SimpleDataGrid from './SimpleDataGrid'

type CodebookEntry = (typeof codebook)[0]
type CodebookEntryKey = keyof CodebookEntry
type CodebookMatch = Partial<CodebookEntry>

type MatchKeys = Partial<Record<CodebookEntryKey, string>>

interface ColumnNameData {
  original: string
  matches: Fuse.FuseResult<MatchKeys>[]
  index: number
  readonly position: number
}

const useClasses = makeStyles({
  dropdown: {
    minWidth: '200px',
  },
  headerCell: {
    display: 'flex',
    flexDirection: 'column',
  },
  plot: {
    maxHeight: '44px',
    width: '80%',
    height: '44px',
  },
})

const useFuseSearch: <T>(
  list: readonly T[],
  options?: Fuse.IFuseOptions<T>,
) => Fuse<T>['search'] = (list, options) => {
  return useCallback(
    (...args) => {
      const fuse = new Fuse(list, options)
      return fuse.search(...args)
    },
    [list, options],
  )
}

const useColumnNames = (n = 20, keys: CodebookEntryKey[] = ['name']) => {
  const [columnNames, setColumnNames] = useState<ColumnNameData[]>([])
  const searchOpts: Fuse.IFuseOptions<CodebookMatch> = useMemo(
    () => ({
      keys,
      threshold: 1,
      includeScore: true,
    }),
    [keys],
  )

  const search = useFuseSearch<CodebookMatch>(codebook, searchOpts)

  const sheet = useSyncExternalStore(
    sheetStateStore.subscribe,
    () => sheetStateStore.sheet,
  )

  const originalColumns = useMemo(
    () =>
      (sheet
        ? utils.sheet_to_json(sheet, {
            header: 1,
          })[0]
        : []) as string[],
    [sheet],
  )

  const columnMatches = useMemo(
    () =>
      originalColumns
        .map((column) =>
          search(column).map(({ item, ...match }) => ({
            ...match,
            item: keys.reduce(
              (prev: CodebookMatch, curr) => ({
                ...prev,
                [curr]: item[curr],
              }),
              {},
            ),
          })),
        )
        .slice(0, n),
    [originalColumns, keys, n, search],
  )

  const checkIsPending = useCallback(
    (
      callback: (...args: unknown[]) => void,
      state: boolean,
      interval = 100,
    ) => {
      setTimeout(() => {
        if (state) {
          checkIsPending(callback, state, interval)
        } else {
          callback()
        }
      }, interval)
    },
    [],
  )

  useEffect(() => {
    const result = originalColumns.map((original, i) => ({
      original,
      matches: columnMatches[i] ?? [],
      index: 0,
      position: i,
    }))

    columnStateStore.matches = result.map(({ matches }) =>
      matches.flatMap(({ item }) => keys.flatMap((key) => item[key] ?? '')),
    )

      startTransition(() => {
        setColumnNames(result)
      })
  }, [checkIsPending, columnMatches, keys, originalColumns])

  return columnNames
}

const ColumnsDataGrid = () => {
  const classes = useClasses()
  const keys: CodebookEntryKey[] = useMemo(() => ['name'], [])
  const n = useMemo(() => 20, [])
  const columnNames = useColumnNames(n, keys)

  const selectedIndices = useSyncExternalStore(
    columnStateStore.subscribe,
    () => columnStateStore.indices,
  )

  const selectedColumns = Array.from(
    useSyncExternalStore(
      columnStateStore.subscribe,
      () => columnStateStore.columns,
    ),
  )

  const [sortState, setSortState] = useState<
    Parameters<NonNullable<DataGridProps['onSortChange']>>[1]
  >({
    sortColumn: 'matches',
    sortDirection: 'ascending',
  })

  const handleSortChange: DataGridProps['onSortChange'] = (
    _event,
    nextSortState,
  ) => {
    setSortState(nextSortState)
  }

  const columns: TableColumnDefinition<ColumnNameData>[] = useMemo(
    () => [
      createTableColumn({
        columnId: 'original',
        compare: (a, b) => a.original.localeCompare(b.original),
        renderHeaderCell: () => (
          <HeaderCell
            header="Original"
            subtitle="The loaded column names (raw)"
          />
        ),
        renderCell: ({ original }) => <>{original}</>,
      }),
      ...keys.map((key) =>
        createTableColumn<ColumnNameData>({
          columnId: 'matches',
          compare: (a, b) => {
            const aIndex = selectedIndices[a.position] ?? 0
            const bIndex = selectedIndices[b.position] ?? 0
            return (a.matches[aIndex]?.item[key] ?? '').localeCompare(
              b.matches[bIndex]?.item[key] ?? '',
            )
          },
          renderHeaderCell: () => (
            <HeaderCell
              header="Replacement"
              subtitle="List of possible replacements (sorted by score)"
            />
          ),
          renderCell: (item) => {
            const { matches, position } = item
            const value = matches[selectedIndices[position] ?? 0]?.item[key]
            return (
              <Dropdown
                className={classes.dropdown}
                value={value}
                selectedOptions={value ? [value] : []}
                onOptionSelect={(_e, data) => {
                  const newIndex = matches.findIndex(
                    (match) => match.item[key] === data.optionValue,
                  )
                  const newIndices = [...selectedIndices]
                  newIndices[position] = newIndex

                  const newColumn = matches[newIndex]?.item[key]

                  const newColumns = [...selectedColumns]
                  newColumns[position] =
                    newColumn ?? selectedColumns[position] ?? ''

                  const uSelectedColumns = Array.from(new Set(selectedColumns))
                  const uNewColumns = Array.from(new Set(newColumns))

                  if (uSelectedColumns.length !== uNewColumns.length) {
                    console.log('not unique')
                    return
                  }

                  selectedIndices[position] = newIndex

                  columnStateStore.indices = selectedIndices
                }}
                appearance="filled-darker">
                {matches.map(({ item, score, refIndex }) => (
                  <Option
                    key={refIndex}
                    value={item[key]}
                    text={item[key] ?? ''}>
                    {item[key]}, {(1 - (score ?? 1)).toFixed(2)}
                  </Option>
                ))}
              </Dropdown>
            )
          },
        }),
      ),
      createTableColumn({
        columnId: 'score',
        compare: (a, b) => {
          const aIndex = selectedIndices[a.position] ?? 0
          const bIndex = selectedIndices[b.position] ?? 0
          return (
            (a.matches[aIndex]?.score ?? 1) - (b.matches[bIndex]?.score ?? 1)
          )
        },
        renderHeaderCell: () => (
          <HeaderCell
            header="Score"
            subtitle="The fuzzy search score (1 indicates a perfect match)"
          />
        ),
        renderCell: ({ matches, position }) => {
          const index = selectedIndices[position] ?? 0
          const score = 1 - (matches[index]?.score ?? 1)
          const formattedScore = score.toFixed(2)
          const data: Plotly.Data[] = [
            {
              name: '',
              x: [formattedScore],
              type: 'bar',
              hovertemplate: 'score: %{x}',
              marker: {
                cmin: 0,
                cmax: 1,
                color: [score],
                colorscale: fluentColorScale(
                  tokens.colorPaletteRedForeground1,
                  tokens.colorPaletteGreenForeground1,
                  64,
                ),
              },
            },
          ]

          const layout: Partial<Plotly.Layout> = {
            autosize: true,

            margin: {
              t: 0,
              l: 0,
              b: 0,
              r: 0,
            },
            xaxis: {
              range: [0, 1],
              zeroline: false,
              showgrid: false,
              showticklabels: false,
              fixedrange: true,
              nticks: 0,
              ticks: '',
            },
            yaxis: {
              fixedrange: true,
              nticks: 0,
              ticks: '',
              showticklabels: false,
            },
            dragmode: false,
            clickmode: 'none',
          }

          const config: Partial<Plotly.Config> = {
            scrollZoom: false,
          }
          return (
            <>
              <Plot
                className={classes.plot}
                data={data}
                layout={layout}
                config={config}
              />
              {formattedScore}
            </>
          )
        },
      }),
    ],
    [classes.dropdown, classes.plot, keys, selectedColumns, selectedIndices],
  )

  useEffect(() => {
    columnStateStore.matches = columnNames.map(({ matches }) =>
      matches.map(({ item }) => item.name ?? ''),
    )
    columnStateStore.indices = columnNames.map(({ index }) => index)
  }, [columnNames, keys])

  return columnNames.length > 0 ? (
    <>
      <SimpleDataGrid<ColumnNameData>
        items={columnNames}
        dataGridProps={{
          items: columnNames,
          columns,
          sortable: true,
          sortState,
          onSortChange: handleSortChange,
        }}
      />
      <div>
        <Button appearance="primary">Done</Button>
      </div>
    </>
  ) : (
    <Spinner
      size="huge"
      labelPosition="below"
      label={<Subtitle1>Matching columns...</Subtitle1>}
    />
  )
}

const HeaderCell = ({
  header,
  subtitle,
}: {
  header: string
  subtitle: string
}) => {
  const classes = useClasses()
  return (
    <div className={classes.headerCell}>
      <Subtitle1>{header}</Subtitle1>
      <Caption1>{subtitle}</Caption1>
    </div>
  )
}

export default ColumnsDataGrid
