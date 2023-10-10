import _ from 'lodash'

import { list } from './utils'

type Key = number | string | symbol

export const range = (end: number, start = 0, steps = 1) => {
  const length = isFinite(end - start) ? end - start : 0
  return list([...Array(Math.round(length / steps)).keys()])(
    (_, i) => start + i * steps,
  )() as number[]
}

export const toObject = <K, T extends Key[]>(
  keyArr: T,
  callback: (i: number) => K,
) =>
  keyArr.reduce<Record<Key, K>>((obj, key, i) => {
    obj[key] = callback(i)
    return obj
  }, {})

export const indexDuplicateSearcher = <
  T extends AsArray<readonly U[] | U[]>,
  U,
>(
  indices: T[],
  filterIndex: T,
) =>
  indices.filter((index) =>
    _.zip(index, filterIndex).every(([index, filter]) => index === filter),
  )
