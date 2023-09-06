import type {
  DataGridProps,
  TableColumnDefinition,
} from '@fluentui/react-components'
import {
  Button,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  Dropdown,
  Option,
  Spinner,
  Subtitle1,
  Caption1,
  Title1,
  createTableColumn,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import Plot from 'react-plotly.js'
import { type WorkSheet, utils } from 'xlsx'
import type Fuse from 'fuse.js'

import codebook from '@/../data/codebook.json'
import { useFuseSearch, useSheet, useWorkbookWorker } from '@/hooks'
import { useState } from 'react'

type CellItem = string | number | boolean
type CodebookColumn = (typeof codebook)[0]

interface Item {
  original: string
  matches: Fuse.FuseResult<CodebookColumn>[]
  index: number
  readonly position: number
}

const useClasses = makeStyles({
  root: {
    display: 'grid',
    width: '70%',
    ...shorthands.margin(0, 'auto'),
    ...shorthands.gap(0, '8px'),
  },
  dropdown: {
    minWidth: '200px',
  },
  headerCell: {
    display: 'flex',
    flexDirection: 'column',
  },
})

export const Component = () => {
  useWorkbookWorker()
  const classes = useClasses()
  const sheet = useSheet()

  return (
    <section className={classes.root}>
      <Title1>Column Matching</Title1>
      {sheet ? (
        <>
          <ColumnsDataGrid sheet={sheet} />
          <div>
            <Button appearance="primary">Done</Button>
          </div>
        </>
      ) : (
        <Spinner
          size="huge"
          labelPosition="below"
          label={<Subtitle1>Matching columns</Subtitle1>}
        />
      )}
    </section>
  )
}

interface ColumnsDataGridProps {
  sheet: WorkSheet
}
// TODO: score viz

const ColumnsDataGrid = ({ sheet }: ColumnsDataGridProps) => {
  const classes = useClasses()
  const keys: (keyof CodebookColumn)[] = ['name']
  const searchOpts: Fuse.IFuseOptions<CodebookColumn> = {
    keys,
    threshold: 0.7,
    includeScore: true,
  }
  const search = useFuseSearch(codebook, searchOpts)

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

  const cells: CellItem[][] = utils.sheet_to_json(sheet, { header: 1 })

  const originalColumns: string[] = cells[0] as string[]

  const items = originalColumns.map((original, i) => {
    const matches = search(original)
      .flatMap((match) =>
        keys.map((key) => ({
          ...match,
          item: {
            [key]: match.item[key],
          },
        })),
      )
      .slice(0, 20)
    return {
      original,
      matches,
      index: 0,
      position: i,
    }
  })

  const [selectedIndices, setSelectedIndices] = useState(
    items.map(({ index }) => index),
  )

  const columns: TableColumnDefinition<Item>[] = [
    createTableColumn({
      columnId: 'original',
      compare: (a, b) => a.original.localeCompare(b.original),
      renderHeaderCell: () => (
        <>
          <Subtitle1>Original</Subtitle1>
          <Caption1>The loaded column names (raw)</Caption1>
        </>
      ),
      renderCell: ({ original }) => <>{original}</>,
    }),
    ...keys.map((key) =>
      createTableColumn<Item>({
        columnId: 'matches',
        compare: (a, b) => {
          const aIndex = selectedIndices[a.position] ?? 0
          const bIndex = selectedIndices[b.position] ?? 0
          return (a.matches[aIndex]?.item[key] ?? '').localeCompare(
            b.matches[bIndex]?.item[key] ?? '',
          )
        },
        renderHeaderCell: () => (
          <>
            <Subtitle1>Replacement</Subtitle1>
            <Caption1>List of possible replacements (sorted by score)</Caption1>
          </>
        ),
        renderCell: (item) => {
          const { matches, position } = item
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
                <Option key={refIndex} value={item[key]} text={item[key]}>
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
        <>
          <Subtitle1>Score</Subtitle1>
          <Caption1>
            The fuzzy search score (1 indicates a perfect match)
          </Caption1>
        </>
      ),
      renderCell: ({ matches, position }) => {
        const index = selectedIndices[position] ?? 0
        const score = matches[index]?.score ?? 1
        return (
          <>
            <Plot
              data={[
                {
                  x: [(1 - score).toFixed(2)],
                  type: 'bar',
                  hovertemplate: 'score: %{x}',
                  marker: {
                    cmin: 0,
                    cmax: 1,
                  },
                },
              ]}
              layout={{
                // width: 200,
                // height: 50,
                margin: {
                  t: 0,
                  l: 0,
                  b: 0,
                  r: 0,
                },
                xaxis: {
                  range: [0, 1],
                },
                plot_bgcolor: tokens.colorNeutralBackground1,
                paper_bgcolor: tokens.colorNeutralBackground1,
              }}
              config={{ displayModeBar: false, responsive: true }} />
          </>
        )
      },
    }),
  ]

  return (
    <DataGrid
      columns={columns}
      items={items}
      sortable
      sortState={sortState}
      onSortChange={handleSortChange}>
      <DataGridHeader>
        <DataGridRow>
          {({ renderHeaderCell }) => (
            <DataGridHeaderCell>
              <div className={classes.headerCell}>{renderHeaderCell()}</div>
            </DataGridHeaderCell>
          )}
        </DataGridRow>
      </DataGridHeader>
      <DataGridBody<Item>>
        {({ item, rowId }) => (
          <DataGridRow<Item> key={rowId}>
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
