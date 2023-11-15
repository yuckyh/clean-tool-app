**CLEaN Tool - v1.0.0** ( [Readme](../../../../README.md) \| API )

***

[CLEaN Tool](../../../../modules.md) / [features/progress/selectors](../README.md) / selectShouldNavigateToAllowed

# Function: selectShouldNavigateToAllowed()

> **selectShouldNavigateToAllowed**(`componentPath`, `locationPath`): (`state`) => `boolean`

The selector to get whether the user should be navigated to the allowed path.

## Parameters

▪ **componentPath**: `string`

The progress nav's component path in the router.

▪ **locationPath**: `string`

The current location path.

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
> [Projects/clean-tool-app/src/features/progress/selectors.ts:234](https://github.com/yuckyh/clean-tool-app/)
>

## Example

```ts
   const shouldNavigateToAllowed = useAppSelector(
     selectShouldNavigateToAllowed(componentPath, locationPath),
   )
```

## Source

[Projects/clean-tool-app/src/features/progress/selectors.ts:234](https://github.com/yuckyh/clean-tool-app/)

***

Generated using [typedoc-plugin-markdown](https://www.npmjs.com/package/typedoc-plugin-markdown) and [TypeDoc](https://typedoc.org/)
