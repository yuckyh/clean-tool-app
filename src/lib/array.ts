import { filter, every, flow, zip } from 'lodash/fp'

type Key = number | string | symbol

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
  filter(
    flow(
      zip(filterIndex),
      every(([filterIndexer, indexer]) => indexer === filterIndexer),
    ),
  )(indices)
