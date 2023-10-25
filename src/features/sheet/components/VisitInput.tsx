import type { InputProps } from '@fluentui/react-components'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { Field, Input, makeStyles } from '@fluentui/react-components'
import * as IO from 'fp-ts/IO'
import { pipe } from 'fp-ts/function'
import { useCallback } from 'react'

import { setVisit } from '../reducers'
import { getVisit } from '../selectors'

interface Props {
  pos: number
}

const useClasses = makeStyles({
  input: {
    minWidth: 'initial',
    width: '100%',
  },
})

export default function VisitInput({ pos }: Props) {
  const classes = useClasses()

  const dispatch = useAppDispatch()

  const visit = useAppSelector((state) => getVisit(state, pos))

  const handleVisitChange: Required<InputProps>['onChange'] = useCallback(
    ({ target }) => {
      const { value } = target

      pipe({ pos, visit: value }, setVisit, (x) => dispatch(x), IO.of)()
    },
    [dispatch, pos],
  )

  return (
    <Field label={`Time for visit ${pos + 1}`}>
      <Input
        appearance="filled-darker"
        className={classes.input}
        onChange={handleVisitChange}
        value={visit}
      />
    </Field>
  )
}
