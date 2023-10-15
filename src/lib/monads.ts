import { isFunction, toString, includes, isArray, flow, map } from 'lodash/fp'

export const just = <T>(value: T): JustMonad<T> => {
  function justCompose(): T
  function justCompose<U>(fn: (value: T) => U): JustMonad<U>
  function justCompose<U>(fn?: (value: T) => U) {
    return fn ? just(fn(value)) : value
  }

  const obj = justCompose as JustMonad<T>

  obj.convert = (converter) =>
    isArray(value) ? converter(value as IsArray<T>) : converter(value)

  function justPass(): JustMonad<T>
  function justPass<U extends AnyArray>(
    ...args: U
  ): JustMonad<FunctionReturnType<T, U>>
  function justPass<U extends AnyArray>(...args: U) {
    return isFunction(value) ? just(value(...args)) : justCompose
  }

  obj.pass = justPass

  return obj
}

export const list = <T extends AnyArray>(value: T) => {
  function listCompose(): T
  function listCompose<V extends readonly W[] | W[], W>(
    fn: (value: ArrayElement<T>) => W,
  ): ListMonad<V>
  function listCompose<V extends readonly W[] | W[], W>(
    fn?: (value: ArrayElement<T>) => W,
  ) {
    return fn ? list(map(fn)(value as ToArray<ArrayElement<T>>) as V) : value
  }

  const obj = listCompose as ListMonad<T>
  obj.convert = (converter) => converter(value)

  function listPass(): ListMonad<T>
  function listPass<U extends AnyArray>(
    ...args: [...U]
  ): ListMonad<ToArray<FunctionReturnType<ArrayElement<T>, U>>>

  function listPass<U extends AnyArray>(...args: [...U]) {
    return isFunction(value) || flow(toString, includes('=>'))(value)
      ? list<ToArray<FunctionReturnType<ArrayElement<T>, U>>>(
          map(
            (fn: (...args: [...U]) => FunctionReturnType<ArrayElement<T>, U>) =>
              fn(...args),
          )(
            value as ToArray<
              (...args: [...U]) => FunctionReturnType<ArrayElement<T>, U>
            >,
          ),
        )
      : obj
  }

  obj.pass = listPass

  return obj
}
