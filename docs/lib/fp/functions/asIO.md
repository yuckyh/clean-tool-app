**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [lib/fp](../README.md) / asIO

# Function: asIO()

> **asIO**\<`As`, `V`\>(`fn`): `IO`\<`V`\>

Converts a function that returns a value into a IO.

## Type parameters

▪ **As** extends readonly `unknown`[]

▪ **V**

## Parameters

▪ **fn**: (...`args`) => `V`

The function that returns a value.

## Returns

`IO`\<`V`\>

An IO representing the function.

## Example

```ts
const fn = () => 1
 const io = asIO(fn)
```

## Source

[Projects/clean-tool-app/src/lib/fp/index.ts:49](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
