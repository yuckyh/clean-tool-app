/**
 * @file This file contains utilities for working with `Ord` from `fp-ts`.
 * @module lib/fp/Ord
 */

/* eslint-disable
  functional/functional-parameters
*/
import type * as Ord from 'fp-ts/Ord'

import * as f from 'fp-ts/function'

import { stubEq } from './Eq'

/**
 * Creates a stub `Ord` instance.
 * @returns A stub `Ord` instance.
 * @example
 * const ord = stubOrd()
 */
export const stubOrd = <V>(): Ord.Ord<V> => ({
  ...stubEq(),
  compare: f.constant(0),
})

export const refinedOrd = <V extends K, K>(ord: Ord.Ord<K>) => ord as Ord.Ord<V>
