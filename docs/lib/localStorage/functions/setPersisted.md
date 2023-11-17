**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [lib/localStorage](../README.md) / setPersisted

# Function: setPersisted()

> **setPersisted**\<`T`, `K`\>(`key`, `value`): `T`

The function to set a persisted value in localStorage.

## Type parameters

▪ **T** extends `string`

▪ **K** extends `string`

## Parameters

▪ **key**: `K`

The key to set the value to.

▪ **value**: `T`

The value to set.

## Returns

`T`

The value that was set.

## Example

```ts
const foo = setPersisted('foo', 'bar') // foo === 'bar'
```

## Source

[Projects/clean-tool-app/src/lib/localStorage.ts:27](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
