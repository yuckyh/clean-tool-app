import type { InputProps } from '@fluentui/react-components'

import { makeStyles, Field, Input } from '@fluentui/react-components'
import { useCallback, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'

import * as IO from 'fp-ts/IO'
import { pipe } from 'fp-ts/function'
import * as RA from 'fp-ts/ReadonlyArray'
import { deleteVisits, syncVisits, setVisit } from '../reducers'
import { dump, dumpName } from '@/lib/logger'
import { getVisit } from '../selectors'

const useClasses = makeStyles({
  input: {
    minWidth: 'initial',
    width: '100%',
  },
})

interface VisitInputProps {
  pos: number
}

function VisitInput({ pos }: VisitInputProps) {
  const classes = useClasses()

  const dispatch = useAppDispatch()

  const visit = useAppSelector((state) => getVisit(state, pos))

  const handleVisitChange: Required<InputProps>['onChange'] = useCallback(
    ({ target }) => {
      const { value } = target

      pipe({ visit: value, pos }, setVisit, (x) => dispatch(x), IO.of)()
    },
    [dispatch, pos],
  )

  return (
    <Field label={`Time for visit ${pos + 1}`}>
      <Input
        onChange={handleVisitChange}
        appearance="filled-darker"
        className={classes.input}
        value={visit}
      />
    </Field>
  )
}

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
        return undefined
      }

      if (newVisitsLength === 1) {
        return pipe(deleteVisits(), (x) => dispatch(x), IO.of)()
      }

      return pipe(newVisitsLength, syncVisits, (x) => dispatch(x), IO.of)()
    },
    [dispatch],
  )

  return (
    <>
      <Field label="Number of visits" required>
        <Input
          onChange={handleNoOfVisitChange}
          value={visitsValue.toString()}
          appearance="filled-darker"
          className={classes.input}
          type="number"
        />
      </Field>
      {RA.makeBy(visitsLength, (pos) => (
        <VisitInput key={pos} pos={dump(pos)} />
      ))}
    </>
  )
}
