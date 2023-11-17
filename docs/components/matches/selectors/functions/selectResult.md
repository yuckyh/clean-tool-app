**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [components/matches/selectors](../README.md) / selectResult

# Function: selectResult()

> **selectResult**(`props`): (`state`) => readonly `string`[]

Selector function to get the match result.

## Parameters

▪ **props**: `Readonly`\<[`BaseProps`](../private/interfaces/BaseProps.md)\>

The [props](../private/interfaces/BaseProps.md) for the component.

## Returns

`function`

The match result.

> > (`state`): readonly `string`[]
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
> readonly `string`[]
>
> ### Source
>
> [Projects/clean-tool-app/src/components/matches/selectors.ts:65](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```tsx
 const matchResult = useAppSelector(selectMatchResult(pos))
```

## Source

[Projects/clean-tool-app/src/components/matches/selectors.ts:64](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
