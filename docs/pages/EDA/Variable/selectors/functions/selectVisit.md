**CLEaN Tool - v1.0.0** ( [Readme](../../../../../README.md) \| API )

***

[CLEaN Tool](../../../../../modules.md) / [pages/EDA/Variable/selectors](../README.md) / selectVisit

# Function: selectVisit()

> **selectVisit**(`visit`?): (`state`) => `string`

Selector function to get the non-null visit.

## Parameters

▪ **visit?**: `string`

The visit value.

## Returns

`function`

The non-null visit.

> > (`state`): `string`
>
> ### Parameters
>
> ▪ **state**: `object`
>
> ▪ **state.data**: `Readonly`\<[`State`](../../../../../reducers/data/interfaces/State.md)\>
>
> ▪ **state.matches**: `Readonly`\<[`State`](../../../../../selectors/progress/private/interfaces/State.md)\>
>
> ▪ **state.progress**: `Readonly`\<[`State`](../../../../../selectors/progress/private/interfaces/State.md)\>
>
> ### Returns
>
> `string`
>
> ### Source
>
> [Projects/clean-tool-app/src/pages/EDA/Variable/selectors.ts:51](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```tsx
 const visit = useAppSelector(selectVisit(visit))
```

## Source

[Projects/clean-tool-app/src/pages/EDA/Variable/selectors.ts:51](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
