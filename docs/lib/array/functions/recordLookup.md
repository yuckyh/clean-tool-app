**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [lib/array](../README.md) / recordLookup

# Function: recordLookup()

> **recordLookup**\<`K`, `T`\>(`record`): (`defaultValue`) => (`key`) => `T`

## Type parameters

▪ **K** extends `string`

▪ **T**

## Parameters

▪ **record**: `Readonly`\<`Record`\<`K`, `T`\>\>

## Returns

`function`

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
> > [Projects/clean-tool-app/src/lib/array.ts:55](https://github.com/yuckyh/clean-tool-app/)
> >
>
> ### Source
>
> [Projects/clean-tool-app/src/lib/array.ts:54](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```ts

```

## Source

[Projects/clean-tool-app/src/lib/array.ts:53](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
