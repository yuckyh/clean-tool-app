**CLEaN Tool - v1.0.0** ( [Readme](../../../README.md) \| API )

***

[CLEaN Tool](../../../modules.md) / [lib/array](../README.md) / findIndex

# Function: findIndex()

> **findIndex**\<`T`\>(`arr`): (`eq`) => (`value`) => `number`

The function to get the index of an element in an array.

## Type parameters

▪ **T**

## Parameters

▪ **arr**: readonly `T`[]

The array.

## Returns

`function`

A function that returns the index of the element or -1 if the element is not found.

> > (`eq`): (`value`) => `number`
>
> ### Parameters
>
> ▪ **eq**: `Eq`\<`T`\>
>
> ### Returns
>
> `function`
>
> > > (`value`): `number`
> >
> > #### Parameters
> >
> > ▪ **value**: `T`
> >
> > #### Returns
> >
> > `number`
> >
> > #### Source
> >
> > [Projects/clean-tool-app/src/lib/array.ts:103](https://github.com/yuckyh/clean-tool-app/)
> >
>
> ### Source
>
> [Projects/clean-tool-app/src/lib/array.ts:102](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```ts
const index = findIndex(arr)(eq)(value)
```

## Source

[Projects/clean-tool-app/src/lib/array.ts:101](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
