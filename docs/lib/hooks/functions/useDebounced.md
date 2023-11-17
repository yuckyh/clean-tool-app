**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [lib/hooks](../README.md) / useDebounced

# Function: useDebounced()

> **useDebounced**\<`T`\>(`value`, `delay`): `T`

This hook is used to create a debounced value.

## Type parameters

▪ **T**

## Parameters

▪ **value**: `T`

The value to debounce

▪ **delay**: `number`= `100`

The delay in milliseconds

## Returns

`T`

The debounced value

## Example

```ts
const debouncedValue = useDebounced(value, delay)
```

## Source

[Projects/clean-tool-app/src/lib/hooks.ts:29](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
