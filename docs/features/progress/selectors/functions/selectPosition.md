**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [features/progress/selectors](../README.md) / selectPosition

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
> ▪ **state.columns**: `Readonly`\<[`State`](../../../../selectors/columns/selectors/private/interfaces/State.md)\>
>
> ▪ **state.progress**: `Readonly`\<[`State`](../../../../selectors/columns/selectors/private/interfaces/State.md)\>
>
> ▪ **state.sheet**: `Readonly`\<[`State`](../../../sheet/reducers/interfaces/State.md)\>
>
> ### Returns
>
> `number`
>
> ### Source
>
> [Projects/clean-tool-app/src/features/progress/selectors.ts:260](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```tsx
   const position = useAppSelector(selectPosition(componentPath, locationPath))
```

## Source

[Projects/clean-tool-app/src/features/progress/selectors.ts:260](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
