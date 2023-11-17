**CLEaN Tool - v1.0.0** ( [Readme](../../../../../../README.md) \| API )

***

[CLEaN Tool](../../../../../../modules.md) / [pages/EDA/Variable/Nav/selectors](../README.md) / selectPathWords

# Function: selectPathWords()

> **selectPathWords**(`pathname`): (`state`) => readonly `string`[]

Selector function to get the path words.

## Parameters

▪ **pathname**: `string`

The location pathname.

## Returns

`function`

The path words.

> > (`state`): readonly `string`[]
>
> ### Parameters
>
> ▪ **state**: `object`
>
> ▪ **state.data**: `Readonly`\<[`State`](../../../../../../reducers/data/interfaces/State.md)\>
>
> ▪ **state.matches**: `Readonly`\<[`State`](../../../../../../selectors/progress/private/interfaces/State.md)\>
>
> ▪ **state.progress**: `Readonly`\<[`State`](../../../../../../selectors/progress/private/interfaces/State.md)\>
>
> ### Returns
>
> readonly `string`[]
>
> ### Source
>
> [Projects/clean-tool-app/src/pages/EDA/Variable/Nav/selectors.ts:60](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```tsx
 const pathWords = useAppSelector(selectPathWords(pathname))
```

## Source

[Projects/clean-tool-app/src/pages/EDA/Variable/Nav/selectors.ts:60](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
