import { zip } from 'lodash'
import { just } from './monads'

type Key = number | string | symbol

export const range = (end: number, start = 0, steps = 1) => {
  const length = Number.isFinite(end - start) ? end - start : 0
  return [...just(length / steps)(Math.round)(Array)().keys()].map(
    (_1, i) => start + i * steps,
  )
}

export const toObject = <K, T extends Key[]>(
  keyArr: T,
  callback: (i: number) => K,
) =>
  keyArr.reduce<Record<Key, K>>((obj, key, i) => {
    obj[key] = callback(i)
    return obj
  }, {})

export const accessArray =
  (index: number) =>
  <T>(arr: T[]) =>
    arr[index]

export const makeIndexPair = <T>(value: T, i: number) => [value, i] as const

export const indexDuplicateSearcher = <T extends ToArray<undefined | U>, U>(
  indices: T[],
  filterIndex: T,
) =>
  indices.filter((index) =>
    zip(index, filterIndex).every(
      ([value, filterValue]) => value === filterValue,
    ),
  )
