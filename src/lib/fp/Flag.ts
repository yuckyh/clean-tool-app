/**
 * @file This file contains the flag typeclass.
 * @module lib/fp/Flag
 */

import type * as Ref from 'fp-ts/Refinement'

import * as _Eq from 'fp-ts/Eq'
import * as _Ord from 'fp-ts/Ord'
import * as RA from 'fp-ts/ReadonlyArray'
import * as S from 'fp-ts/string'

import { refinedEq } from './Eq'
import { refinedOrd } from './Ord'

/**
 * The possible reasons for a flag.
 */
export type FlagReason =
  | 'incorrect'
  | 'missing'
  | 'none'
  | 'outlier'
  | 'suspected'

/**
 * The flag type.
 */
export interface Flag {
  /**
   * The tag for the flag HKT.
   */
  readonly _tag: 'Flag'
  /**
   * The value of the flag.
   */
  value: readonly [string, string, FlagReason]
}

/**
 * The constructor for a flag.
 * @param index - The index of the flag.
 * @param column - The column of the flag.
 * @param reason - The reason for the flag.
 * @returns The flag.
 * @example
 *  const flag = of('foo', 'bar', 'incorrect')
 */
export const of = (index: string, column: string, reason: FlagReason) =>
  ({
    _tag: 'Flag',
    value: [index, column, reason] as const,
  }) as Flag

/**
 * The function to unwrap a flag.
 * @param flag - The flag instance.
 * @param flag.value - The value inside the flag.
 * @returns The value of the flag.
 * @example
 *  const value = unwrap(flag)
 */
export const unwrap = ({ value }: Readonly<Flag>) => value

/**
 * The function to get the Eq instance of its value.
 */
export const getEq = _Eq.contramap((flag: Readonly<Flag>) => flag.value)

/**
 * The default Eq instance of the flag.
 */
export const Eq: _Eq.Eq<Flag> = getEq(
  _Eq.tuple(S.Eq, S.Eq, refinedEq<FlagReason, string>(S.Eq)),
)

/**
 * The default Ord instance of the flag.
 */
export const Ord: _Ord.Ord<Flag> = _Ord.contramap(
  ({ value }: Readonly<Flag>) => value,
)(_Ord.tuple(S.Ord, S.Ord, refinedOrd<FlagReason, string>(S.Ord)))

/**
 * This refinement checks if a string is a flag reason.
 * @param str - The string to check.
 * @returns True if the string is a flag reason.
 * @example
 *  const isFlagReason = isFlagReason('incorrect') // true
 */
const isFlagReason: Ref.Refinement<string, FlagReason> = (
  str,
): str is FlagReason =>
  RA.elem(S.Eq)(str)(['incorrect', 'missing', 'none', 'outlier', 'suspected'])

/**
 * This refinement checks if a string array is a flag tuple.
 * @param arr - The string array to check.
 * @returns True if the string array is a flag tuple.
 * @example
 *  const isFlagTuple = isFlagTuple(['foo', 'bar', 'incorrect']) // true
 */
export const isFlagTuple: Ref.Refinement<
  readonly string[],
  readonly [string, string, string]
> = (arr): arr is readonly [string, string, string] =>
  arr.length === 3 &&
  S.isString(arr[0]) &&
  S.isString(arr[1]) &&
  S.isString(arr[2])

/**
 * This refinement checks if a string array is a flag value.
 * @param arr - The string array to check.
 * @returns True if the string array is a flag value.
 * @example
 *  const isFlagValue = isFlagValue(['foo', 'bar', 'incorrect']) // true
 */
export const isFlagValue: Ref.Refinement<readonly string[], Flag['value']> = (
  arr,
): arr is Flag['value'] => isFlagTuple(arr) && isFlagReason(arr[2])
