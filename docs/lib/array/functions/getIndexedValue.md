**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [lib/array](../README.md) / getIndexedValue

# Function: getIndexedValue()

> **getIndexedValue**\<`I`, `V`\>(`tuple`): `V`

Retrieves the value from an indexed tuple.

## Type parameters

▪ **I**

▪ **V**

## Parameters

▪ **tuple**: readonly [`I`, `V`]

The indexed tuple.

## Returns

`V`

The value.

## Example

```ts
const value = getIndexedValue([0, 'foo']) // 'foo'
```

## Source

[Projects/clean-tool-app/src/lib/array.ts:119](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
