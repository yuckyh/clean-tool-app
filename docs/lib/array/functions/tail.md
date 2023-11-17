**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [lib/array](../README.md) / tail

# Function: tail()

> **tail**\<`T`\>(`arr`): (`defaultValue`) => `T`

The function to get the last element of an array.

## Type parameters

▪ **T**

## Parameters

▪ **arr**: readonly `T`[]

The array.

## Returns

`function`

A function that returns the last element of the array or the provided default value.

> > (`defaultValue`): `T`
>
> ### Parameters
>
> ▪ **defaultValue**: `T`
>
> ### Returns
>
> `T`
>
> ### Source
>
> [Projects/clean-tool-app/src/lib/array.ts:77](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```ts
const value = tail(arr)(defaultValue)
```

## Source

[Projects/clean-tool-app/src/lib/array.ts:91](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
