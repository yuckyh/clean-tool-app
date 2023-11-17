**CLEaN Tool - v1.0.0** ( [Readme](../../../../../../README.md) \| API )

***

[CLEaN Tool](../../../../../../modules.md) / [pages/EDA/Variable/Plot/selectors](../README.md) / selectNonOutliers

# Function: selectNonOutliers()

> **selectNonOutliers**(`props`): (`state`) => readonly readonly [`string`, `number`][]

Selector function to get the non-outliers.

## Parameters

▪ **props**: `Readonly`\<[`BaseProps`](../private/interfaces/BaseProps.md)\>

The [props](../private/interfaces/BaseProps.md) for the component.

## Returns

`function`

The non-outliers.

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
> [Projects/clean-tool-app/src/pages/EDA/Variable/Plot/selectors.ts:53](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```tsx
 const nonOutliers = useAppSelector(selectNonOutliers(props))
```

## Source

[Projects/clean-tool-app/src/pages/EDA/Variable/Plot/selectors.ts:52](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
