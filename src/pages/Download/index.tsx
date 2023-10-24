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
import { constant, identity } from 'fp-ts/function'
import { useMemo } from 'react'
import * as RA from 'fp-ts/ReadonlyArray'
import {
  getWrittenWorkbook,
  getColumnsLength,
} from '@/features/sheet/selectors'
import { stringLookup } from '@/lib/array'
import SimpleDataGrid from '@/components/SimpleDataGrid'
import { writeFile } from 'xlsx-js-style'
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
  const workbook = useAppSelector(getWrittenWorkbook)

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
