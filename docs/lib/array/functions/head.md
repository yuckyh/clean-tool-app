**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [lib/array](../README.md) / head

# Function: head()

> **head**\<`T`\>(`arr`): (`defaultValue`) => `T`

The function to get the first element of an array.

## Type parameters

▪ **T**

## Parameters

▪ **arr**: readonly `T`[]

The array.

## Returns

`function`

A function that returns the first element of the array or the provided default value.

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
const value = head(arr)(defaultValue)
```

## Source

[Projects/clean-tool-app/src/lib/array.ts:76](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
