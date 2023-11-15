/**
 * @file This file contains utilities for working with `Eq` from `fp-ts`.
 * @module lib/fp/Eq
 */

/* eslint-disable
  functional/functional-parameters
*/
import type * as Eq from 'fp-ts/Eq'

import * as f from 'fp-ts/function'

export const stubEq = <V>(): Eq.Eq<V> => ({
  equals: f.constTrue,
})

export const refinedEq = <V extends K, K>(eq: Eq.Eq<K>) => eq as Eq.Eq<V>
