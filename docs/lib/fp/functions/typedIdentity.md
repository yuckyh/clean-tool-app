**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [lib/fp](../README.md) / typedIdentity

# Function: typedIdentity()

> **typedIdentity**\<`V`\>(`val`): `V`

An identity function that is typed.

## Type parameters

▪ **V**

## Parameters

▪ **val**: `unknown`

The value to return.

## Returns

`V`

The typed value.

## Example

```ts
type CoolNumber = number & { readonly cool: true }
 typedIdentity<CoolNumber>(1) // 1
```

## Source

[Projects/clean-tool-app/src/lib/fp/index.ts:82](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
