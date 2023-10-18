import type { DropdownProps } from '@fluentui/react-components'

import { makeStyles, Dropdown, Option, Field } from '@fluentui/react-components'
import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'

import { tap, of } from 'fp-ts/IO'
import { pipe } from 'fp-ts/function'
import { map } from 'fp-ts/ReadonlyArray'
import { setSheetName } from '../reducers'

const useClasses = makeStyles({
  input: {
    minWidth: 'initial',
    width: '100%',
  },
})

// eslint-disable-next-line functional/functional-parameters
export default function SheetPickerInput() {
  const classes = useClasses()

  const dispatch = useAppDispatch()

  const sheetName = useAppSelector(({ sheet }) => sheet.sheetName)
  const sheetNames = useAppSelector(({ sheet }) => sheet.sheetNames)

  const handleSheetSelect: Required<DropdownProps>['onOptionSelect'] =
    useCallback(
      (_event, { optionValue = '' }) =>
        pipe(
          optionValue,
          setSheetName,
          of,
          tap((x) => of(dispatch(x))),
        ),
      [dispatch],
    )

  return (
    <Field label="Sheet" required>
      <Dropdown
        onOptionSelect={handleSheetSelect}
        selectedOptions={[sheetName]}
        appearance="filled-darker"
        className={classes.input}
        value={sheetName}>
        {pipe(
          sheetNames,
          map((name) => (
            <Option value={name} key={name}>
              {name}
            </Option>
          )),
        )}
      </Dropdown>
    </Field>
  )
}
