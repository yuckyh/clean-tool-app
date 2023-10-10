import type { InputProps } from '@fluentui/react-components'

import { makeStyles, Field, Input } from '@fluentui/react-components'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { useCallback, useState } from 'react'
import { range } from '@/lib/array'
import { just } from '@/lib/utils'

import { deleteVisits, pushVisit, popVisit, setVisit } from '../reducers'

const useClasses = makeStyles({
  input: {
    minWidth: 'initial',
    width: '100%',
  },
})

const VisitsInput = () => {
  const classes = useClasses()

  const dispatch = useAppDispatch()

  const { visits } = useAppSelector(({ sheet }) => sheet)
  const [visitsValue, setVisitsValue] = useState(visits.length || 1)

  const handleNoOfVisitChange: InputProps['onChange'] = (_event, { value }) => {
    const newVisitsLength = parseInt(value)
    setVisitsValue(newVisitsLength)
    if (isNaN(newVisitsLength)) {
      return
    }

    const visitsLengthDiff = newVisitsLength - visits.length

    if (newVisitsLength === 1) {
      dispatch(deleteVisits())
      return
    }

    if (visitsLengthDiff > 0) {
      range(visitsLengthDiff).forEach(() => dispatch(pushVisit()))
      return
    }

    if (visitsLengthDiff < 0) {
      range(-1 * visitsLengthDiff).forEach(() => dispatch(popVisit()))
      return
    }
  }

  const handleVisitChange = useCallback(
    (pos: number): Required<InputProps>['onChange'] =>
      ({ target }) => {
        const { value } = target

        just({ visit: value, pos })(setVisit)(dispatch)()
      },
    [dispatch],
  )

  return (
    <div>
      <Field label="Number of visits" required>
        <Input
          onChange={handleNoOfVisitChange}
          value={visitsValue.toString()}
          appearance="filled-darker"
          className={classes.input}
          type="number"
        />
      </Field>
      {visits.map((visit, i) => (
        <Field label={`Time for visit ${i + 1}`} key={i}>
          <Input
            onChange={handleVisitChange(i)}
            appearance="filled-darker"
            className={classes.input}
            value={visit}
          />
        </Field>
      ))}
    </div>
  )
}

export default VisitsInput
