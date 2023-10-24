/* eslint-disable import/prefer-default-export */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/functional-parameters */

import { getFormattedColumns } from '@/features/columns/selectors'
import { useAppSelector } from '@/lib/hooks'
import type { TableColumnDefinition } from '@fluentui/react-components'
import {
  createTableColumn,
  makeStyles,
  shorthands,
  Subtitle2,
  Button,
  tokens,
  Title1,
} from '@fluentui/react-components'
import { constant, identity, flow, pipe } from 'fp-ts/function'
import { useMemo } from 'react'
import * as RA from 'fp-ts/ReadonlyArray'
import * as O from 'fp-ts/Option'
import * as RR from 'fp-ts/ReadonlyRecord'
import * as RS from 'fp-ts/ReadonlySet'
import {
  getColumnsLength,
  getFormattedData,
  getIndexRow,
  FlagOrd,
  FlagEq,
} from '@/features/sheet/selectors'
import { stringLookup } from '@/lib/array'
import SimpleDataGrid from '@/components/SimpleDataGrid'
import { getFlaggedCells, getColumns, getData } from '@/app/selectors'
import { dumpName, dump } from '@/lib/logger'
import { utils } from 'xlsx'
import { writeFile } from 'xlsx-js-style'
import { strEquals } from '@/lib/fp'
import type { Flag } from '@/features/sheet/reducers'
import * as S from 'fp-ts/string'
import PreviewCell from './PreviewCell'

const useClasses = makeStyles({
  root: {
    rowGap: tokens.spacingVerticalXL,
    flexDirection: 'column',
    display: 'flex',
    width: '80%',
    ...shorthands.margin(0, 'auto'),
  },
  actions: {
    justifyContent: 'center',
    display: 'flex',
    width: '100%',
  },
})

const colorMap = pipe(
  {
    incorrect: 'FF00FFFF', // RRGGBBAA
    missing: 'FFFF00FF',
    outlier: 'FF0000FF',
  } as const,
  RR.map(flow(S.slice(1, 7), S.toUpperCase)),
)

export function Component() {
  const classes = useClasses()

  const dataLength = useAppSelector(({ sheet }) => sheet.data.length)
  const columnsLength = useAppSelector(getColumnsLength)
  const formattedColumns = useAppSelector(getFormattedColumns)

  const items = useMemo(() => RA.makeBy(dataLength, identity), [dataLength])
  const columnDefinitions: readonly TableColumnDefinition<number>[] = useMemo(
    () =>
      RA.makeBy(columnsLength, (col) =>
        createTableColumn({
          renderHeaderCell: () => stringLookup(formattedColumns)(col),
          renderCell: (row) => <PreviewCell col={col} row={row} />,
          columnId: stringLookup(formattedColumns)(col),
        }),
      ),
    [columnsLength, formattedColumns],
  )

  const fileName = useAppSelector(({ sheet }) => sheet.fileName)
  const sheetName = useAppSelector(({ sheet }) => sheet.sheetName)
  const flaggedCells = useAppSelector(getFlaggedCells)
  const formattedData = useAppSelector(getFormattedData)
  const dataTypes = useAppSelector(({ columns }) => columns.dataTypes)
  const indexRow = useAppSelector(getIndexRow)

  dumpName({ formattedData })

  const sheet = useMemo(
    () => utils.json_to_sheet(formattedData as CellItem[]),
    [formattedData],
  )

  const flaggedCellsAddr = useMemo(
    () =>
      pipe(
        flaggedCells,
        RA.map(([firstIndex, firstColumn]) =>
          pipe(
            flaggedCells,
            RA.filter(
              ([secondIndex, secondColumn]) =>
                strEquals(firstIndex)(secondIndex) &&
                strEquals(firstColumn)(secondColumn),
            ),
            (x) =>
              x.length > 1
                ? x.filter(([, , reason]) => reason !== 'outlier')
                : x,
            RA.head,
            pipe(['', '', 'outlier'] as Flag, constant, O.getOrElse),
          ),
        ),
        RS.fromReadonlyArray(FlagEq),
        RS.toReadonlyArray(FlagOrd),
        RA.mapWithIndex(
          (i, [flaggedIndex, flaggedCol, flagReason]) =>
            [
              {
                ...pipe(
                  sheet,
                  RR.lookup(
                    utils.encode_cell({
                      c: pipe(
                        formattedColumns,
                        RA.findIndex(strEquals(flaggedCol)),
                        pipe(Infinity, constant, O.getOrElse),
                      ),
                      r: pipe(
                        indexRow,
                        RA.findIndex(strEquals(flaggedIndex)),
                        pipe(Infinity, constant, O.getOrElse),
                      ),
                    }),
                  ),
                  pipe(
                    { t: dataTypes[i] === 'categorical' ? 's' : 'n', v: '' },
                    constant,
                    O.getOrElse,
                  ),
                ),
                s: {
                  fill: {
                    fgColor: {
                      rgb: colorMap[flagReason],
                    },
                    patternType: 'solid',
                  },
                },
              },
              utils.encode_cell({
                c: pipe(
                  formattedColumns,
                  RA.findIndex(strEquals(flaggedCol)),
                  pipe(Infinity, constant, O.getOrElse),
                ),
                r: pipe(
                  indexRow,
                  RA.findIndex(strEquals(flaggedIndex)),
                  pipe(Infinity, constant, O.getOrElse),
                ),
              }),
            ] as const,
        ),
      ),
    [dataTypes, flaggedCells, formattedColumns, indexRow, sheet],
  )

  const writtenSheet = useMemo(() => {
    const newSheet = { ...sheet }
    flaggedCellsAddr.forEach(([cell, addr]) => {
      newSheet[addr] = cell
    })
    return newSheet
  }, [flaggedCellsAddr, sheet])

  const workbook = useMemo(() => {
    const newWorkbook = utils.book_new()
    utils.book_append_sheet(newWorkbook, writtenSheet, sheetName)
    return newWorkbook
  }, [sheetName, writtenSheet])

  const handleFileDownload = () => {
    writeFile(workbook, `flagged-${fileName}`, { type: 'file' }) as File
  }

  return (
    <section className={classes.root}>
      <Title1>Download</Title1>
      <Subtitle2>Confirm your changes before downloading your file</Subtitle2>
      <SimpleDataGrid
        cellFocusMode={constant('none')}
        columns={columnDefinitions}
        items={items}
      />
      <div className={classes.actions}>
        <Button onClick={handleFileDownload} appearance="primary">
          Download
        </Button>
      </div>
    </section>
  )
}
