**CLEaN Tool - v1.0.0** ( [Readme](../../../../../../README.md) \| API )

***

[CLEaN Tool](../../../../../../modules.md) / [pages/EDA/Variable/Plot/selectors](../README.md) / selectOutliers

# Function: selectOutliers()

> **selectOutliers**(`props`): (`state`) => readonly readonly [`string`, `number`][]

Selector function to get the outliers.

## Parameters

▪ **props**: `Readonly`\<[`BaseProps`](../private/interfaces/BaseProps.md)\>

The [props](../private/interfaces/BaseProps.md) for the component.

## Returns

`function`

The outliers.

> > (`state`): readonly readonly [`string`, `number`][]
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
> readonly readonly [`string`, `number`][]
>
> ### Source
>
> [Projects/clean-tool-app/src/pages/EDA/Variable/Plot/selectors.ts:37](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```tsx
 const outliers = useAppSelector(selectOutliers(props))
```

## Source

[Projects/clean-tool-app/src/pages/EDA/Variable/Plot/selectors.ts:36](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
