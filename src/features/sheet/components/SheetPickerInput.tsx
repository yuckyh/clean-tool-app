import type { DropdownProps } from '@fluentui/react-components'

import { makeStyles, Dropdown, Option, Field } from '@fluentui/react-components'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { useCallback } from 'react'
import { just } from '@/lib/utils'

import { setSheetName } from '../reducers'

const useClasses = makeStyles({
  input: {
    minWidth: 'initial',
    width: '100%',
  },
})

const SheetPickerInput = () => {
  const classes = useClasses()

  const dispatch = useAppDispatch()

  const sheetName = useAppSelector(({ sheet }) => sheet.sheetName)
  const sheetNames = useAppSelector(({ sheet }) => sheet.original.sheetNames)

  const handleSheetSelect: Required<DropdownProps>['onOptionSelect'] =
    useCallback(
      (_event, { optionValue = '' }) => {
        just(optionValue)(setSheetName)(dispatch)()
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
        {sheetNames.map((name) => (
          <Option value={name} key={name}>
            {name}
          </Option>
        ))}
      </Dropdown>
    </Field>
  )
}

export default SheetPickerInput
