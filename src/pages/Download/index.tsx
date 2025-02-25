/**
 * @file This file contains the download page component.
 * @module pages/Download
 */

import type { TableColumnDefinition } from '@fluentui/react-components'

import SimpleDataGrid from '@/components/SimpleDataGrid'
import { arrayLookup } from '@/lib/array'
import { useAppSelector } from '@/lib/hooks'
import { getDataLength } from '@/selectors/data'
import { getColumnsLength } from '@/selectors/data/columns'
import { getFileName, getFormattedWorkbook } from '@/selectors/data/sheet'
import { getFormattedColumns } from '@/selectors/matches/format'
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

/**
 * The download page component.
 *
 * In this page, the user can preview and download the flagged data.
 * @returns The component object.
 * @category Component
 * @example
 * ```tsx
 *  <Route lazy={defaultLazyImport(() => import('./pages/Download'))} />
 * ```
 */
export default function Download() {
  const classes = useClasses()

  const dataLength = useAppSelector(getDataLength)
  const columnsLength = useAppSelector(getColumnsLength)
  const formattedColumns = useAppSelector(getFormattedColumns)

  const items = useMemo(() => RA.makeBy(dataLength, f.identity), [dataLength])
  const columnDefinitions: readonly TableColumnDefinition<number>[] = useMemo(
    () =>
      RA.makeBy(columnsLength, (col) =>
        createTableColumn({
          columnId: arrayLookup(formattedColumns)('')(col),
          renderCell: (row) => <PreviewCell col={col} row={row} />,
          renderHeaderCell: () => (
            <HeaderCell header={arrayLookup(formattedColumns)('')(col)} />
          ),
        }),
      ),
    [columnsLength, formattedColumns],
  )

  const fileName = useAppSelector(getFileName)
  const workbook = useAppSelector(getFormattedWorkbook)

  const handleFileDownload = () => {
    writeFile({ ...workbook }, `flagged-${fileName}`, { type: 'file' }) as File
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
      <SimpleDataGrid columns={columnDefinitions} items={items} />
      <div className={classes.actions}>
        <Button appearance="primary" onClick={handleFileDownload}>
          Download
        </Button>
      </div>
    </section>
  )
}
