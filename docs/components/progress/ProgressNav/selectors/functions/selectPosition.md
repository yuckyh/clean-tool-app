**CLEaN Tool - v1.0.0** ( [Readme](../../../../../README.md) \| API )

***

[CLEaN Tool](../../../../../modules.md) / [components/progress/ProgressNav/selectors](../README.md) / selectPosition

# Function: selectPosition()

> **selectPosition**(`componentPath`, `locationPath`): (`state`) => `number`

The selector to get the position for the current progress navigation.

## Parameters

▪ **componentPath**: `string`

The progress nav's component path in the router.

▪ **locationPath**: `string`

The current location path.

## Returns

`function`

The selector function.

> > (`state`): `number`
>
> ### Parameters
>
> ▪ **state**: `object`
>
> ▪ **state.data**: `Readonly`\<[`State`](../../../../../reducers/data/interfaces/State.md)\>
>
> ▪ **state.matches**: `Readonly`\<[`State`](../../../../../selectors/progress/progress/private/interfaces/State.md)\>
>
> ▪ **state.progress**: `Readonly`\<[`State`](../../../../../selectors/progress/progress/private/interfaces/State.md)\>
>
> ### Returns
>
> `number`
>
> ### Source
>
> [Projects/clean-tool-app/src/components/progress/ProgressNav/selectors.ts:66](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```tsx
   const position = useAppSelector(selectPosition(componentPath, locationPath))
```

## Source

[Projects/clean-tool-app/src/components/progress/ProgressNav/selectors.ts:66](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
