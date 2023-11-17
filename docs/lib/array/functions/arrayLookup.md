**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [lib/array](../README.md) / arrayLookup

# Function: arrayLookup()

> **arrayLookup**\<`T`\>(`arr`): (`defaultValue`) => (`pos`) => `T`

The function to access an array element safely.

## Type parameters

▪ **T**

## Parameters

▪ **arr**: readonly `T`[]

The array to access.

## Returns

`function`

A function that returns the element at the specified position or the provided default value.

> > (`defaultValue`): (`pos`) => `T`
>
> ### Parameters
>
> ▪ **defaultValue**: `T`
>
> ### Returns
>
> `function`
>
> > > (`pos`): `T`
> >
> > #### Parameters
> >
> > ▪ **pos**: `number`
> >
> > #### Returns
> >
> > `T`
> >
> > #### Source
> >
> > [Projects/clean-tool-app/src/lib/array.ts:46](https://github.com/yuckyh/clean-tool-app/)
> >
>
> ### Source
>
> [Projects/clean-tool-app/src/lib/array.ts:45](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```ts
const value = arrayLookup(arr)(defaultValue)(pos)
```

## Source

[Projects/clean-tool-app/src/lib/array.ts:44](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
