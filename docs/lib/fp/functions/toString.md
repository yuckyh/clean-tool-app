**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [lib/fp](../README.md) / toString

# Function: toString()

> **toString**\<`V`\>(`val`): `string`

Function to convert a primitive to a string.

## Type parameters

▪ **V** extends [`Primitive`](../../../types/utils/type-aliases/Primitive.md)

## Parameters

▪ **val**: `V`

The primitive to convert.

## Returns

`string`

The string representation of the primitive.

## Example

```ts
toString(1) // '1'
 toString('1') // '1'
 toString(true) // 'true'
```

## Source

[Projects/clean-tool-app/src/lib/fp/index.ts:72](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
