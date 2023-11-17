**CLEaN Tool - v1.0.0** ( [Readme](../../../../../../README.md) \| API )

***

[CLEaN Tool](../../../../../../modules.md) / [pages/EDA/Variable/DataGrid/selectors](../README.md) / selectTitle

# Function: selectTitle()

> **selectTitle**(`props`): (`state`) => `string`

Selector function to get the variable title.

## Parameters

▪ **props**: `Readonly`\<[`BaseProps`](../interfaces/BaseProps.md)\>

The [props](../interfaces/BaseProps.md) for the component.

## Returns

`function`

The variable title.

> > (`state`): `string`
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
> `string`
>
> ### Source
>
> [Projects/clean-tool-app/src/pages/EDA/Variable/DataGrid/selectors.ts:125](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```tsx
 const title = useAppSelector(selectTitle(props))
```

## Source

[Projects/clean-tool-app/src/pages/EDA/Variable/DataGrid/selectors.ts:124](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
