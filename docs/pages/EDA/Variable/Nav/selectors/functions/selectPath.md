**CLEaN Tool - v1.0.0** ( [Readme](../../../../../../README.md) \| API )

***

[CLEaN Tool](../../../../../../modules.md) / [pages/EDA/Variable/Nav/selectors](../README.md) / selectPath

# Function: selectPath()

> **selectPath**(`props`): (`state`) => `string`

Selector function to get the path.

## Parameters

▪ **props**: `Readonly`\<[`BaseProps`](../private/interfaces/BaseProps.md)\>

The [props](../private/interfaces/BaseProps.md) for the component.

## Returns

`function`

The path.

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
> [Projects/clean-tool-app/src/pages/EDA/Variable/Nav/selectors.ts:33](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```tsx
 const path = useAppSelector(selectPath(props))
```

## Source

[Projects/clean-tool-app/src/pages/EDA/Variable/Nav/selectors.ts:32](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
