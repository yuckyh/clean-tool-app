type Key = number | string | symbol

export const transpose = <T extends AsArray<AnyArray>>(
  matrix: T,
): Transpose<T> =>
  matrix[0]?.map((_, i) => matrix.map((row) => row[i])) as Transpose<T>

export const toObject = <K, T extends Key[]>(
  arr: T,
  callback: (i: number) => K,
) =>
  arr.reduce<Record<Key, K>>((obj, key, i) => {
    obj[key] = callback(i)
    return obj
  }, {})
