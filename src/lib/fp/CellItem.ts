/**
 * @file This file contains the cell item typeclass.
 * @module lib/fp/CellItem
 */

import type * as RR from 'fp-ts/ReadonlyRecord'

import * as f from 'fp-ts/function'

/**
 * A value can be either a number or a string.
 */
export type Value = number | string

/**
 * A cell item is a record of string keys and values.
 */
export interface CellItem<V extends Value = Value> {
  /**
   * The tag for the cell item HKT.
   */
  readonly _tag: 'CellItem'
  /**
   * The value of the cell item.
   */
  value: RR.ReadonlyRecord<string, V>
}

/**
 * The constructor for a cell item.
 * @param value - The value of the cell item.
 * @returns The cell item.
 * @example
 *  const cellItem = of({ foo: 1, bar: 'baz' })
 */
export const of = <V extends Value>(
  value: RR.ReadonlyRecord<string, V>,
): Readonly<CellItem<V>> => ({
  _tag: 'CellItem',
  value,
})

/**
 * The function to unwrap a cell item.
 * @param cellItem - The cell item instance.
 * @param cellItem.value - The value inside the cell item.
 * @returns The value of the cell item.
 * @example
 *  const value = unwrap(cellItem)
 */
export const unwrap = <V extends Value>({
  value,
}: Readonly<CellItem<V>>): RR.ReadonlyRecord<string, V> => value

/**
 * The function to map over a cell item.
 * @param fn - The function to map over the cell item.
 * @returns The mapped cell item.
 * @example
 *  const mappedCellItem = map((x) => {...x, a: 'foo'})(cellItem)
 */
export const recordMap =
  <A extends Value, B extends Value>(
    fn: (a: RR.ReadonlyRecord<string, A>) => RR.ReadonlyRecord<string, B>,
  ) =>
  (cellItem: Readonly<CellItem<A>>): Readonly<CellItem<B>> =>
    f.pipe(cellItem, unwrap, fn, of)

/**
 * The function to fold a cell item.
 * @param fn - The function that converts the value of the cell item.
 * @returns The converted value.
 * @example
 *  const value = fold((x) => x['a'])(cellItem)
 */
export const fold =
  <A extends Value, T>(fn: (a: CellItem<A>['value']) => T) =>
  (cellItem: Readonly<CellItem<A>>) =>
    fn(unwrap(cellItem))
