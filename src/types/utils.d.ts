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

type ArrayElement<T extends AnyArray> = T extends
  | readonly (infer U)[]
  | (infer U)[]
  ? U
  : never

type ExcludeFirst<A> = A extends [unknown, ...infer U] ? U : never

type Transpose<T extends IsArray<AnyArray>> = T extends (infer U)[]
  ? {
      [K in keyof U]: {
        [L in keyof T]: T[L][K]
      }
    }
  : T extends readonly (infer U)[]
  ? {
      readonly [K in keyof U]: {
        readonly [L in keyof T]: T[L][K]
      }
    }
  : never

// XLSX support

type CellItem = Record<Column, boolean | number | string>
type Column = number | string

// Functional Programming

type Curried<Args extends AnyArray, Return> = Args[0] extends undefined
  ? Return
  : (arg: Args[0]) => Curried<ExcludeFirst<Args>, Return>

type MonadFactory<M extends Monad<T>, T> = (value: T) => M

interface Monad<T> {
  (): T
  convert: <M extends Monad<T>>(converter: MonadFactory<M, T>) => M
}

type JustMonad<T> = Monad<T> & (<U>(fn: (value: T) => U) => JustMonad<U>)

type ListMonad<T extends AnyArray> = Monad<T> &
  (<V extends IsArray<readonly W[] | W[]>, W>(
    fn?: (value: ArrayElement<T>, index: number, array: T) => W,
  ) => ListMonad<V>)
