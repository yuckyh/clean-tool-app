import type { DropdownProps } from '@fluentui/react-components'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { getSheetName, getSheetNames } from '@/selectors/data/sheet'
import { Dropdown, Field, Option, makeStyles } from '@fluentui/react-components'
import * as IO from 'fp-ts/IO'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'
import { useCallback } from 'react'

import { setSheetName } from '../reducers'

const useClasses = makeStyles({
  input: {
    minWidth: 'initial',
    width: '100%',
  },
})

/**
 *
 * @returns
 * @example
 */
export default function SheetPickerInput() {
  const classes = useClasses()

  const dispatch = useAppDispatch()

  const sheetName = useAppSelector(getSheetName)
  const sheetNames = useAppSelector(getSheetNames)

  const handleSheetSelect: Required<DropdownProps>['onOptionSelect'] =
    useCallback(
      (_event, { optionValue = '' }) =>
        f.pipe(optionValue, setSheetName, (x) => dispatch(x), IO.of),
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
