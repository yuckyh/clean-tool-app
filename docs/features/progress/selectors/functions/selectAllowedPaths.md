**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [features/progress/selectors](../README.md) / selectAllowedPaths

# Function: selectAllowedPaths()

> **selectAllowedPaths**(`componentPath`): (`state`) => readonly `string`[]

The selector to get the allowed paths for the current progress navigation.

## Parameters

▪ **componentPath**: `string`

The progress nav's component path in the router.

## Returns

`function`

The selector function.

> > (`state`): readonly `string`[]
>
> ### Parameters
>
> ▪ **state**: `object`
>
> ▪ **state.columns**: `Readonly`\<[`State`](../../../../selectors/columns/selectors/private/interfaces/State.md)\>
>
> ▪ **state.progress**: `Readonly`\<[`State`](../../../../selectors/columns/selectors/private/interfaces/State.md)\>
>
> ▪ **state.sheet**: `Readonly`\<[`State`](../../../sheet/reducers/interfaces/State.md)\>
>
> ### Returns
>
> readonly `string`[]
>
> ### Source
>
> [Projects/clean-tool-app/src/features/progress/selectors.ts:218](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```ts
   const allowedPaths = useAppSelector(selectAllowedPaths(componentPath))
```

## Source

[Projects/clean-tool-app/src/features/progress/selectors.ts:218](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
