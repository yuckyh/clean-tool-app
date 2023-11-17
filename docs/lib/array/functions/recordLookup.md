**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [lib/array](../README.md) / recordLookup

# Function: recordLookup()

> **recordLookup**\<`K`, `T`\>(`record`): (`defaultValue`) => (`key`) => `T`

The function to access a record element safely.

## Type parameters

▪ **K** extends `string`

▪ **T**

## Parameters

▪ **record**: `Readonly`\<`Record`\<`K`, `T`\>\>

The record to access.

## Returns

`function`

A function that returns the element with the specified key or the provided default value.

> > (`defaultValue`): (`key`) => `T`
>
> ### Parameters
>
> ▪ **defaultValue**: `T`
>
> ### Returns
>
> `function`
>
> > > (`key`): `T`
> >
> > #### Parameters
> >
> > ▪ **key**: `K`
> >
> > #### Returns
> >
> > `T`
> >
> > #### Source
> >
> > [Projects/clean-tool-app/src/lib/array.ts:62](https://github.com/yuckyh/clean-tool-app/)
> >
>
> ### Source
>
> [Projects/clean-tool-app/src/lib/array.ts:61](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```ts
const value = recordLookup(record)(defaultValue)(key)
```

## Source

[Projects/clean-tool-app/src/lib/array.ts:60](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
