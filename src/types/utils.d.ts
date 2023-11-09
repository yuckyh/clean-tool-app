/**
 * @file This file contains the project's utility type definitions.
 * @module types/utils
 */

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

type AsArray<T> = T extends readonly unknown[] ? T : T[] | readonly T[]

type AnyArray = readonly unknown[]

type ToArray<T> = readonly T[]

type ArrayElement<T extends AnyArray> = T extends readonly (infer U)[]
  ? U
  : never

type ExcludeFirst<A> = A extends [unknown, ...infer U] ? U : never

// XLSX support
