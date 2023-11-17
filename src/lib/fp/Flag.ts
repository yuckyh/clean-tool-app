import type * as Ref from 'fp-ts/Refinement'

import * as _Eq from 'fp-ts/Eq'
import * as _Ord from 'fp-ts/Ord'
import * as RA from 'fp-ts/ReadonlyArray'
import * as S from 'fp-ts/string'

/**
 *
 */
export type FlagReason =
  | 'incorrect'
  | 'missing'
  | 'none'
  | 'outlier'
  | 'suspected'

/**
 *
 */
export interface Flag {
  /**
   *
   */
  readonly _tag: 'Flag'
  /**
   *
   */
  value: readonly [string, string, FlagReason]
}

/**
 *
 * @param index
 * @param column
 * @param reason
 * @returns
 * @example
 */
export const of = (index: string, column: string, reason: FlagReason) =>
  ({
    _tag: 'Flag',
    value: [index, column, reason] as const,
  }) as Flag

export const unwrap = ({ value }: Readonly<Flag>) => value

/**
 *
 */
export const getEq = _Eq.contramap((flag: Readonly<Flag>) => flag.value)

/**
 *
 */
export const Eq: _Eq.Eq<Flag> = getEq(
  _Eq.tuple(S.Eq, S.Eq, S.Eq as _Eq.Eq<FlagReason>),
)

/**
 *
 */
export const Ord: _Ord.Ord<Flag> = _Ord.contramap(
  ({ value }: Readonly<Flag>) => value,
)(_Ord.tuple(S.Ord, S.Ord, S.Ord as _Ord.Ord<FlagReason>))

/**
 *
 * @param x
 * @returns
 * @example
 */
const isFlagReason: Ref.Refinement<string, FlagReason> = (x): x is FlagReason =>
  RA.elem(S.Eq)(x)(['incorrect', 'missing', 'none', 'outlier', 'suspected'])

/**
 *
 * @param x
 * @returns
 * @example
 */
export const isFlagTuple: Ref.Refinement<
  readonly string[],
  readonly [string, string, string]
> = (x): x is readonly [string, string, string] =>
  x.length === 3 && S.isString(x[0]) && S.isString(x[1]) && S.isString(x[2])

/**
 *
 * @param x
 * @returns
 * @example
 */
export const isFlagValue: Ref.Refinement<readonly string[], Flag['value']> = (
  x,
): x is Flag['value'] => isFlagTuple(x) && isFlagReason(x[2])
