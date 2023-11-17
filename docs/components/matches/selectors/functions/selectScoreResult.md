**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [components/matches/selectors](../README.md) / selectScoreResult

# Function: selectScoreResult()

> **selectScoreResult**(`props`): (`state`) => readonly `number`[]

Selector function to get the score result.

## Parameters

▪ **props**: `Readonly`\<[`BaseProps`](../private/interfaces/BaseProps.md)\>

The [props](../private/interfaces/BaseProps.md) for the component.

## Returns

`function`

The score result.

> > (`state`): readonly `number`[]
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
> readonly `number`[]
>
> ### Source
>
> [Projects/clean-tool-app/src/components/matches/selectors.ts:80](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```tsx
 const scoreResult = useAppSelector(selectScoreResult(pos))
```

## Source

[Projects/clean-tool-app/src/components/matches/selectors.ts:79](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
