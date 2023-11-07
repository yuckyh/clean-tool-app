import type * as Ref from 'fp-ts/Refinement'

import * as _Eq from 'fp-ts/Eq'
import * as _Ord from 'fp-ts/Ord'
import * as S from 'fp-ts/string'

export type FlagReason =
  | 'incorrect'
  | 'missing'
  | 'none'
  | 'outlier'
  | 'suspected'

export interface Flag {
  readonly _tag: 'Flag'
  value: readonly [string, string, FlagReason]
}

export const of = (index: string, column: string, reason: FlagReason) =>
  ({
    _tag: 'Flag',
    value: [index, column, reason] as const,
  }) as Flag

export const getEq = _Eq.contramap((flag: Readonly<Flag>) => flag.value)

export const Eq: _Eq.Eq<Flag> = getEq(
  _Eq.tuple(S.Eq, S.Eq, S.Eq as _Eq.Eq<FlagReason>),
)

export const Ord: _Ord.Ord<Flag> = _Ord.contramap(
  ({ value }: Readonly<Flag>) => value,
)(_Ord.tuple(S.Ord, S.Ord, S.Ord as _Ord.Ord<FlagReason>))

const isFlagReason: Ref.Refinement<string | undefined, FlagReason> = (
  x,
): x is FlagReason =>
  x === 'incorrect' || x === 'missing' || x === 'outlier' || x === 'suspected'

export const isFlagValue: Ref.Refinement<readonly string[], Flag['value']> = (
  x,
): x is Flag['value'] => x.length === 3 && isFlagReason(x[2])
