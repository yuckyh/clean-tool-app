type Property<T> = T[keyof T]

type Prettify<T> = {
  [K in keyof T]: T[K]
}

type Primitive = boolean | number | string

type AsArray<T> = [...T[]] | readonly [...T[]]

type AnyArray = AsArray<unknown>

type ArrayElement<T extends AnyArray> = T extends
  | (infer U)[]
  | readonly (infer U)[]
  ? U
  : never

type ExcludeFirst<A> = A extends [unknown, ...infer U] ? U : never

type Transpose<T extends AsArray<AnyArray>> = T extends (infer U)[]
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

type MonadFactory = <M extends Monad<T>, T>(value: T) => M
type MonadConverter<M extends Monad<T>, T> = (value: T) => M

interface Monad<T> {
  (): T
  convert: <M extends Monad<AsArray<T> | T>>(
    converter: MonadConverter<M, T>,
  ) => M
}

type JustMonad<T> = Monad<T> & (<U>(fn?: (value: T) => U) => JustMonad<U>)

type ListMonad<A extends AnyArray> = Monad<A> &
  (<T, U extends AsArray<T>>(
    fn?: (
      value: ArrayElement<A>,
      index: number,
      array: AsArray<ArrayElement<A>>,
    ) => T,
  ) => ListMonad<U>)
