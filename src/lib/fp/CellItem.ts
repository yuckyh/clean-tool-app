import type * as RR from 'fp-ts/ReadonlyRecord'

import * as f from 'fp-ts/function'

/**
 *
 */
export type Value = number | string

/**
 *
 */
export interface CellItem<V extends Value = Value> {
  /**
   *
   */
  readonly _tag: 'CellItem'
  /**
   *
   */
  value: RR.ReadonlyRecord<string, V>
}

/**
 *
 * @param value
 * @returns
 * @example
 */
export const of = <V extends Value>(
  value: RR.ReadonlyRecord<string, V>,
): Readonly<CellItem<V>> => ({
  _tag: 'CellItem',
  value,
})

/**
 *
 * @param cellItem
 * @param cellItem.value
 * @returns
 * @example
 */
export const unwrap = <V extends Value>({
  value,
}: Readonly<CellItem<V>>): RR.ReadonlyRecord<string, V> => value

/**
 *
 * @param fn
 * @returns
 * @example
 */
export const recordMap =
  <A extends Value, B extends Value>(
    fn: (a: RR.ReadonlyRecord<string, A>) => RR.ReadonlyRecord<string, B>,
  ) =>
  (cellItem: Readonly<CellItem<A>>): Readonly<CellItem<B>> =>
    f.pipe(cellItem, unwrap, fn, of)

/**
 *
 * @param fn
 * @returns
 * @example
 */
export const fold =
  <A extends Value, T>(fn: (a: CellItem<A>['value']) => T) =>
  (cellItem: Readonly<CellItem<A>>) =>
    fn(unwrap(cellItem))
