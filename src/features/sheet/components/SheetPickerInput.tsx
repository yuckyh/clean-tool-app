import type { DropdownProps } from '@fluentui/react-components'

import { makeStyles, Dropdown, Option, Field } from '@fluentui/react-components'
import { useCallback } from 'react'
import { map } from 'lodash/fp'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'

import { setSheetName } from '../reducers'
import { just } from '@/lib/monads'

const useClasses = makeStyles({
  input: {
    minWidth: 'initial',
    width: '100%',
  },
})

export default function SheetPickerInput() {
  const classes = useClasses()

  const dispatch = useAppDispatch()

  const sheetName = useAppSelector(({ sheet }) => sheet.sheetName)
  const sheetNames = useAppSelector(({ sheet }) => sheet.sheetNames)

  const handleSheetSelect: Required<DropdownProps>['onOptionSelect'] =
    useCallback(
      (_event, { optionValue = '' }) => {
        just(optionValue)(setSheetName)(dispatch)
      },
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
        {map<string, JSX.Element>((name) => (
          <Option value={name} key={name}>
            {name}
          </Option>
        ))(sheetNames)}
      </Dropdown>
    </Field>
  )
}
