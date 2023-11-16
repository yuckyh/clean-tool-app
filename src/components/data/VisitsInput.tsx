import type { InputProps } from '@fluentui/react-components'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { getVisitsLength } from '@/selectors/data/visits'
import { Field, Input, makeStyles } from '@fluentui/react-components'
import * as IO from 'fp-ts/IO'
import * as RA from 'fp-ts/ReadonlyArray'
import * as f from 'fp-ts/function'
import { useCallback, useEffect, useState } from 'react'

import { syncVisits } from '../../reducers/data'
import VisitInput from './VisitInput'

const useClasses = makeStyles({
  input: {
    minWidth: 'initial',
    width: '100%',
  },
})

/**
 *
 * @example
 */
export default function VisitsInput() {
  const classes = useClasses()

  const dispatch = useAppDispatch()

  const visitsLength = useAppSelector(getVisitsLength)

  const [visitsValue, setVisitsValue] = useState(visitsLength)

  const handleNoOfVisitChange: Required<InputProps>['onChange'] = useCallback(
    (_event, { value }) => {
      const newVisitsLength = parseInt(value, 10)
      setVisitsValue(newVisitsLength)

      if (
        Number.isNaN(newVisitsLength) ||
        newVisitsLength < 0 ||
        newVisitsLength === visitsLength
      ) {
        return
      }

      f.pipe(newVisitsLength, syncVisits, (x) => dispatch(x), IO.of)()
    },
    [dispatch, visitsLength],
  )

  useEffect(() => {
    setVisitsValue(visitsLength)
  }, [visitsLength])

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
      {visitsLength > 0 &&
        RA.makeBy(visitsLength, (pos) => <VisitInput key={pos} pos={pos} />)}
    </>
  )
}
