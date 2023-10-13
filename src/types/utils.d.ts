type Property<T> = T[keyof T]

type Prettify<T> = {
  [K in keyof T]: T[K]
}

type Primitive = boolean | number | string

type IsArray<T> = T extends unknown[]
  ? T
  : T extends readonly unknown[]
  ? T
  : never

type AsArray<T> = T extends readonly unknown[] | unknown[]
  ? T
  : readonly T[] | T[]

type AnyArray = readonly unknown[] | unknown[]

type ToArray<T> = readonly T[] | T[]

type ArrayElement<T extends AnyArray> = T extends
  | readonly (infer U)[]
  | (infer U)[]
  ? U
  : never

type ExcludeFirst<A> = A extends [unknown, ...infer U] ? U : never

// XLSX support

type CellItem = Record<Column, boolean | number | string>
type Column = number | string

// Functional Programming

type FunctionReturnType<T, V extends AnyArray> = T extends (
  ...args: [...V]
) => infer R
  ? R
  : T

type Curried<V extends AnyArray, R> = V[number] extends undefined
  ? R
  : (arg: V[0]) => Curried<ExcludeFirst<V>, R>

type MonadFactory<M extends Monad<T>, T> = (value: T) => M

interface Monad<T> {
  (): T
  convert: <M extends Monad<T>>(converter: MonadFactory<M, T>) => M
}

interface JustMonad<T> extends Monad<T> {
  <U>(fn: (value: T) => U): JustMonad<U>
  pass: {
    <U extends AnyArray>(...args: U): JustMonad<FunctionReturnType<T, U>>
    (): JustMonad<T>
  }
}

interface ListMonad<T extends AnyArray> extends Monad<T> {
  (): T
  <U extends ToArray<V>, V>(
    fn?: (
      value: ArrayElement<T>,
      index: number,
      array: ToArray<ArrayElement<T>>,
    ) => V,
  ): ListMonad<U>
  pass: {
    <U extends AnyArray>(
      ...args: [...U]
    ): ListMonad<ToArray<FunctionReturnType<ArrayElement<T>, U>>>
    (): ListMonad<T>
  }
}
