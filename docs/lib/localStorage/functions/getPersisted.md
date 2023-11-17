**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [lib/localStorage](../README.md) / getPersisted

# Function: getPersisted()

> **getPersisted**\<`T`, `K`\>(`key`, `defaultValue`): `T`

The function to get a persisted value from localStorage.

## Type parameters

▪ **T** extends `string`

▪ **K** extends `string`

## Parameters

▪ **key**: `K`

The key to get the value from.

▪ **defaultValue**: `T`

The default value to return if the key is not found.

## Returns

`T`

The value from localStorage if the key is found, otherwise the default value.

## Example

```ts
const foo = getPersisted('foo', 'bar') // foo === 'bar'
```

## Source

[Projects/clean-tool-app/src/lib/localStorage.ts:14](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
