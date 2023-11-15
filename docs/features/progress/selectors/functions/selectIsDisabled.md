**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [features/progress/selectors](../README.md) / selectIsDisabled

# Function: selectIsDisabled()

> **selectIsDisabled**(`componentPath`, `locationPath`, `pos`): (`state`) => `boolean`

The selector to get whether the current progress nav item is disabled.

## Parameters

▪ **componentPath**: `string`

The progress nav's component path in the router.

▪ **locationPath**: `string`

The current location path.

▪ **pos**: `number`

The position of the current progress nav item.

## Returns

`function`

The selector function.

> > (`state`): `boolean`
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
> `boolean`
>
> ### Source
>
> [Projects/clean-tool-app/src/features/progress/selectors.ts:276](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```tsx
   const isDisabled = useAppSelector(selectIsDisabled(componentPath, locationPath, pos))
```

## Source

[Projects/clean-tool-app/src/features/progress/selectors.ts:275](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
