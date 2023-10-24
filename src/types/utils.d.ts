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

type AsArray<T> = T extends readonly unknown[] ? T : readonly T[] | T[]

type AnyArray = readonly unknown[]

type ToArray<T> = readonly T[]

type ArrayElement<T extends AnyArray> = T extends readonly (infer U)[]
  ? U
  : never

type ExcludeFirst<A> = A extends [unknown, ...infer U] ? U : never

// XLSX support

type CellItem = Record<Column, string>
type Column = number | string
