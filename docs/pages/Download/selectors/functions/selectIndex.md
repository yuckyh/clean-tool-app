**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [pages/Download/selectors](../README.md) / selectIndex

# Function: selectIndex()

> **selectIndex**(`props`): (`state`) => `string`

Selector function to get the index cell.

## Parameters

▪ **props**: `Readonly`\<[`BaseProps`](../private/interfaces/BaseProps.md)\>

The [props](../private/interfaces/BaseProps.md) for the component.

## Returns

`function`

The index cell.

> > (`state`): `string`
>
> ### Parameters
>
> ▪ **state**: `object`
>
> ▪ **state.data**: `Readonly`\<[`State`](../../../../reducers/data/interfaces/State.md)\>
>
> ▪ **state.matches**: `Readonly`\<[`State`](../../../../selectors/progress/private/interfaces/State.md)\>
>
> ▪ **state.progress**: `Readonly`\<[`State`](../../../../selectors/progress/private/interfaces/State.md)\>
>
> ### Returns
>
> `string`
>
> ### Source
>
> [Projects/clean-tool-app/src/pages/Download/selectors.ts:68](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```tsx
 const indexCell = useAppSelector(selectIndexCell(props))
```

## Source

[Projects/clean-tool-app/src/pages/Download/selectors.ts:67](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
