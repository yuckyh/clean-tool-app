/**
 * @file This file contains the sheet picker input component.
 */

import type { DropdownProps } from '@fluentui/react-components'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { deleteData, setSheetName } from '@/reducers/data'
import { deleteMatches } from '@/reducers/matches'
import { deleteProgress } from '@/reducers/progress'
import { getSheetName, getSheetNames } from '@/selectors/data/sheet'
import { Dropdown, Field, Option, makeStyles } from '@fluentui/react-components'
import * as IO from 'fp-ts/IO'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'
import { useCallback } from 'react'

const useClasses = makeStyles({
  input: {
    minWidth: 'initial',
    width: '100%',
  },
})

/**
 * The sheet picker input component.
 * @returns A sheet picker input component.
 * @example
 * ```tsx
 *  <SheetPickerInput />
 * ```
 */
export default function SheetPickerInput() {
  const classes = useClasses()

  const dispatch = useAppDispatch()

  const sheetName = useAppSelector(getSheetName)
  const sheetNames = useAppSelector(getSheetNames)

  const handleSheetSelect: Required<DropdownProps>['onOptionSelect'] =
    useCallback(
      (_event, { optionValue = '' }) =>
        f.pipe(
          [
            deleteData(),
            deleteProgress(),
            deleteMatches(),
            setSheetName(optionValue),
          ] as const,
          RA.map(f.flow((x) => dispatch(x), IO.of)),
          IO.sequenceArray,
        ),
      [dispatch],
    )

  return (
    <Field label="Sheet" required>
      <Dropdown
        appearance="filled-darker"
        className={classes.input}
        onOptionSelect={handleSheetSelect}
        selectedOptions={[sheetName]}
        value={sheetName}>
        {f.pipe(
          sheetNames,
          RA.map((name) => (
            <Option key={name} value={name}>
              {name}
            </Option>
          )),
        )}
      </Dropdown>
    </Field>
  )
}
