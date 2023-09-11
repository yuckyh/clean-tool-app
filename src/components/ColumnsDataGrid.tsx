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
} from '@fluentui/react-components'
import {
  useState,
  useEffect,
  useSyncExternalStore,
  useMemo,
  useCallback,
} from 'react'
import Plot from '@/lib/plotly'
import { utils } from 'xlsx'
import Fuse from 'fuse.js'

import { fluentColorScale } from '@/lib/plotly'
import codebook from '@/../data/codebook.json'
import { sheetStateStore } from '@/lib/StateStore/sheet'
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

  useEffect(() => {
    setColumnNames(
      originalColumns.map((original, i) => ({
        original: original,
        matches: columnMatches[i] ?? [],
        index: 0,
        position: i,
      })),
    )
  }, [columnMatches, originalColumns])

  return columnNames
}

const ColumnsDataGrid = () => {
  const keys: CodebookEntryKey[] = useMemo(() => ['name'], [])
  const n = useMemo(() => 20, [])
  const columnNames = useColumnNames(n, keys)

  const [selectedIndices, setSelectedIndices] = useState(
    columnNames.map(({ index }) => index),
  )

  const columns: TableColumnDefinition<ColumnNameData>[] = [
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
          const { matches: matches, position } = item
          const defaultOption = matches[0]?.item[key]
          return (
            <Dropdown
              className={classes.dropdown}
              defaultValue={defaultOption}
              defaultSelectedOptions={defaultOption ? [defaultOption] : []}
              onOptionSelect={(_e, data) => {
                setSelectedIndices((prev) => {
                  const next = [...prev]
                  next[position] = matches.findIndex(
                    (match) => match.item[key] === data.optionValue,
                  )
                  return next
                })
              }}
              appearance="filled-darker">
              {matches.map(({ item, score, refIndex }) => (
                <Option key={refIndex} value={item[key]} text={item[key] ?? ''}>
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
        return (a.matches[aIndex]?.score ?? 1) - (b.matches[bIndex]?.score ?? 1)
      },
      renderHeaderCell: () => (
        <HeaderCell
          header="Score"
          subtitle="The fuzzy search score (1 indicates a perfect match)"
        />
      ),
      renderCell: (item) => (
        <ScoreCell item={item} selectedIndices={selectedIndices} />
      ),
    }),
  ]

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

  const classes = useClasses()

  return (
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

interface ScoreCellProp {
  item: ColumnNameData
  selectedIndices: number[]
}

const ScoreCell = ({ item, selectedIndices }: ScoreCellProp) => {
  const { matches: matches, position } = item
  const index = selectedIndices[position] ?? 0
  const score = 1 - (matches[index]?.score ?? 1)
  const formattedScore = score.toFixed(2)
  const classes = useClasses()
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
}

export default ColumnsDataGrid
