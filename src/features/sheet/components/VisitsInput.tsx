import type { InputProps } from '@fluentui/react-components'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { Field, Input, makeStyles } from '@fluentui/react-components'
import * as IO from 'fp-ts/IO'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import { useCallback, useState } from 'react'

import { deleteVisits, syncVisits } from '../reducers'
import VisitInput from './VisitInput'

const useClasses = makeStyles({
  input: {
    minWidth: 'initial',
    width: '100%',
  },
})

// eslint-disable-next-line functional/functional-parameters
export default function VisitsInput() {
  const classes = useClasses()

  const dispatch = useAppDispatch()

  const visitsLength = useAppSelector(({ sheet }) => sheet.visits.length)

  const [visitsValue, setVisitsValue] = useState(visitsLength || 1)

  const handleNoOfVisitChange: Required<InputProps>['onChange'] = useCallback(
    (_event, { value }) => {
      const newVisitsLength = parseInt(value, 10)
      setVisitsValue(newVisitsLength)
      if (Number.isNaN(newVisitsLength)) {
        return
      }

      if (newVisitsLength === 1) {
        pipe(deleteVisits(), (x) => dispatch(x), IO.of)()
        return
      }

      pipe(newVisitsLength, syncVisits, (x) => dispatch(x), IO.of)()
    },
    [dispatch],
  )

  return (
    <>
      <Field label="Number of visits" required>
        <Input
          appearance="filled-darker"
          className={classes.input}
          onChange={handleNoOfVisitChange}
          type="number"
          value={visitsValue.toString()}
        />
      </Field>
      {visitsLength > 1 &&
        RA.makeBy(visitsLength, (pos) => <VisitInput key={pos} pos={pos} />)}
    </>
  )
}
