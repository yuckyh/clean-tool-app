**CLEaN Tool - v1.0.0** ( [Readme](../../../../../README.md) \| API )

***

[CLEaN Tool](../../../../../modules.md) / [components/progress/ProgressNav/selectors](../README.md) / selectPaths

# Function: selectPaths()

> **selectPaths**(`componentPath`): (`state`) => readonly `string`[]

The selector to get the paths for the current progress navigation.

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
> ▪ **state.data**: `Readonly`\<[`State`](../../../../../reducers/data/interfaces/State.md)\>
>
> ▪ **state.matches**: `Readonly`\<[`State`](../../../../../selectors/progress/private/interfaces/State.md)\>
>
> ▪ **state.progress**: `Readonly`\<[`State`](../../../../../selectors/progress/private/interfaces/State.md)\>
>
> ### Returns
>
> readonly `string`[]
>
> ### Source
>
> [Projects/clean-tool-app/src/components/progress/ProgressNav/selectors.ts:57](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```tsx
   const paths = useAppSelector(selectPaths(componentPath))
```

## Source

[Projects/clean-tool-app/src/components/progress/ProgressNav/selectors.ts:57](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
