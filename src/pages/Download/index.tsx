/* eslint-disable import/prefer-default-export */

/* eslint-disable functional/functional-parameters */

import type { TableColumnDefinition } from '@fluentui/react-components'

import SimpleDataGrid from '@/components/SimpleDataGrid'
import { getFormattedColumns } from '@/features/columns/selectors'
import {
  getColumnsLength,
  getWrittenWorkbook,
} from '@/features/sheet/selectors'
import { stringLookup } from '@/lib/array'
import { useAppSelector } from '@/lib/hooks'
import {
  Button,
  Subtitle2,
  Tag,
  TagGroup,
  Title1,
  createTableColumn,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'
import { useMemo } from 'react'
import { writeFile } from 'xlsx-js-style'

import HeaderCell from './HeaderCell'
import PreviewCell from './PreviewCell'

const useClasses = makeStyles({
  actions: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
  incorrect: {
    backgroundColor: tokens.colorPaletteYellowBackground2,
    color: tokens.colorPaletteYellowForeground2,
  },
  missing: {
    backgroundColor: tokens.colorStatusWarningBackground2,
    color: tokens.colorStatusWarningForeground2,
  },
  outlier: {
    backgroundColor: tokens.colorNeutralForeground3,
    color: tokens.colorNeutralBackground3,
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalXL,
    width: '80%',
    ...shorthands.margin(0, 'auto'),
  },
  suspected: {
    backgroundColor: tokens.colorStatusDangerBackground2,
    color: tokens.colorStatusDangerForeground2,
  },
})

export function Component() {
  const classes = useClasses()

  const dataLength = useAppSelector(({ sheet }) => sheet.data.length)
  const columnsLength = useAppSelector(getColumnsLength)
  const formattedColumns = useAppSelector(getFormattedColumns)

  const items = useMemo(() => RA.makeBy(dataLength, f.identity), [dataLength])
  const columnDefinitions: readonly TableColumnDefinition<number>[] = useMemo(
    () =>
      RA.makeBy(columnsLength, (col) =>
        createTableColumn({
          columnId: stringLookup(formattedColumns)(col),
          renderCell: (row) => <PreviewCell col={col} row={row} />,
          renderHeaderCell: () => (
            <HeaderCell header={stringLookup(formattedColumns)(col)} />
          ),
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
      <TagGroup role="list">
        <Tag className={classes.outlier} role="listitem">
          User flagged
        </Tag>
        <Tag className={classes.suspected} role="listitem">
          Outlier
        </Tag>
        <Tag className={classes.missing} role="listitem">
          Blank Data
        </Tag>
        <Tag className={classes.incorrect} role="listitem">
          Incorrectly Formatted Data
        </Tag>
      </TagGroup>
      <SimpleDataGrid
        cellFocusMode={f.constant('none')}
        columns={columnDefinitions}
        items={items}
      />
      <div className={classes.actions}>
        <Button appearance="primary" onClick={handleFileDownload}>
          Download
        </Button>
      </div>
    </section>
  )
}
